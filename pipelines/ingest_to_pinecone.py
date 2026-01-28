"""
Robust Pinecone Ingestion Pipeline for Rare Beauty Products

This script:
1. Loads the master product dataset
2. Generates embeddings using OpenAI
3. Uploads vectors to Pinecone with metadata
4. Handles errors and supports resuming
"""

import pandas as pd
import os
import time
from tqdm import tqdm
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
import json

# ============ CONFIGURATION ============

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME", "rare-beauty-products")

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSION = 1536
BATCH_SIZE = 100  # Process 100 products at a time
UPSERT_BATCH_SIZE = 100  # Upload 100 vectors at a time

# Data file
MASTER_CSV = "data/rare_beauty_master.csv"
CHECKPOINT_FILE = "data/ingestion_checkpoint.json"

# ============ INITIALIZE CLIENTS ============

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY environment variable not set")

openai_client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)

# ============ HELPER FUNCTIONS ============

def create_embedding_text(row):
    """
    Creates rich text for embedding from product data.
    Combines multiple fields to create semantic-rich context.
    """
    parts = []

    # Product name and variant
    if pd.notna(row.get('product_name')):
        parts.append(f"Product: {row['product_name']}")
    if pd.notna(row.get('variant_title')) and str(row['variant_title']) != 'nan':
        parts.append(f"Shade/Variant: {row['variant_title']}")

    # Category
    if pd.notna(row.get('category')):
        parts.append(f"Category: {row['category']}")

    # Description (most important for semantic search)
    if pd.notna(row.get('description')):
        desc = str(row['description'])[:1000]  # Limit to 1000 chars
        parts.append(f"Description: {desc}")

    # Ingredients
    if pd.notna(row.get('ingredients')):
        ingredients = str(row['ingredients'])[:500]  # Limit ingredients
        parts.append(f"Ingredients: {ingredients}")

    # Finish/claims
    if pd.notna(row.get('finish')) and str(row['finish']) != 'nan':
        parts.append(f"Finish: {row['finish']}")

    return " | ".join(parts)


def generate_embeddings_batch(texts, max_retries=3):
    """
    Generate embeddings with retry logic for rate limiting.
    """
    for attempt in range(max_retries):
        try:
            response = openai_client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=texts
            )
            return [item.embedding for item in response.data]
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"⚠️  Error generating embeddings (attempt {attempt + 1}): {e}")
                print(f"   Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                raise


def prepare_metadata(row):
    """
    Prepare metadata for Pinecone upload.
    Only include serializable types and non-null values.
    """
    metadata = {}

    # String fields
    for field in ['product_name', 'category', 'variant_title', 'variant_sku',
                  'handle', 'variant_image', 'product_url', 'description',
                  'ingredients', 'finish']:
        value = row.get(field)
        if pd.notna(value) and str(value) != 'nan':
            # Limit text fields to 40KB (Pinecone limit)
            metadata[field] = str(value)[:40000]

    # Numeric fields
    if pd.notna(row.get('variant_price')):
        metadata['price'] = float(row['variant_price'])

    # Boolean fields
    if pd.notna(row.get('variant_available')):
        metadata['available'] = bool(row['variant_available'])

    # ID fields
    if pd.notna(row.get('variant_id')):
        metadata['variant_id'] = str(row['variant_id'])

    return metadata


def load_checkpoint():
    """Load checkpoint to resume from where we left off."""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r') as f:
            return json.load(f)
    return {"last_processed_index": -1}


def save_checkpoint(index):
    """Save current progress."""
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump({"last_processed_index": index}, f)


def setup_index():
    """
    Create or verify Pinecone index exists.
    """
    print(f"🔧 Setting up Pinecone index: {INDEX_NAME}")

    # Check if index exists
    existing_indexes = [idx.name for idx in pc.list_indexes()]

    if INDEX_NAME not in existing_indexes:
        print(f"📝 Creating new index: {INDEX_NAME}")
        pc.create_index(
            name=INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        print("✅ Index created successfully")
        # Wait for index to be ready
        time.sleep(5)
    else:
        print(f"✅ Index {INDEX_NAME} already exists")

    return pc.Index(INDEX_NAME)


def ingest_to_pinecone():
    """
    Main ingestion pipeline.
    """
    print("=" * 60)
    print("🚀 RARE BEAUTY PINECONE INGESTION PIPELINE")
    print("=" * 60)

    # Load data
    print(f"\n📂 Loading data from {MASTER_CSV}...")
    df = pd.read_csv(MASTER_CSV)
    print(f"✅ Loaded {len(df)} products")

    # Setup Pinecone
    index = setup_index()

    # Load checkpoint
    checkpoint = load_checkpoint()
    start_index = checkpoint["last_processed_index"] + 1

    if start_index > 0:
        print(f"\n🔄 Resuming from index {start_index}")

    # Process in batches
    total_batches = (len(df) - start_index + BATCH_SIZE - 1) // BATCH_SIZE
    print(f"\n🔢 Processing {len(df) - start_index} products in {total_batches} batches")
    print(f"   Batch size: {BATCH_SIZE}")
    print(f"   Embedding model: {EMBEDDING_MODEL}")

    vectors_uploaded = 0

    for batch_start in tqdm(range(start_index, len(df), BATCH_SIZE),
                            desc="Processing batches"):
        batch_end = min(batch_start + BATCH_SIZE, len(df))
        batch_df = df.iloc[batch_start:batch_end]

        # Create embedding texts
        embedding_texts = [create_embedding_text(row) for _, row in batch_df.iterrows()]

        # Generate embeddings
        try:
            embeddings = generate_embeddings_batch(embedding_texts)
        except Exception as e:
            print(f"\n❌ Failed to generate embeddings for batch {batch_start}-{batch_end}: {e}")
            print("   Saving checkpoint and exiting...")
            save_checkpoint(batch_start - 1)
            return

        # Prepare vectors for Pinecone
        vectors_to_upsert = []
        for idx, (_, row) in enumerate(batch_df.iterrows()):
            vector_id = f"variant_{row['variant_id']}"
            embedding = embeddings[idx]
            metadata = prepare_metadata(row)

            vectors_to_upsert.append({
                "id": vector_id,
                "values": embedding,
                "metadata": metadata
            })

        # Upload to Pinecone in sub-batches
        for i in range(0, len(vectors_to_upsert), UPSERT_BATCH_SIZE):
            sub_batch = vectors_to_upsert[i:i + UPSERT_BATCH_SIZE]
            try:
                index.upsert(vectors=sub_batch)
                vectors_uploaded += len(sub_batch)
            except Exception as e:
                print(f"\n❌ Failed to upsert vectors: {e}")
                print("   Saving checkpoint and exiting...")
                save_checkpoint(batch_start - 1)
                return

        # Save checkpoint after each batch
        save_checkpoint(batch_end - 1)

        # Small delay to avoid rate limits
        time.sleep(0.5)

    # Get index stats
    print(f"\n✅ Ingestion complete!")
    print(f"   Total vectors uploaded: {vectors_uploaded}")

    # Wait for index to update
    time.sleep(2)
    stats = index.describe_index_stats()
    print(f"\n📊 Pinecone Index Stats:")
    print(f"   Total vectors: {stats.total_vector_count}")
    print(f"   Index dimension: {stats.dimension}")

    # Clean up checkpoint
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)
        print(f"\n🧹 Checkpoint file removed")

    print("\n" + "=" * 60)
    print("🎉 INGESTION PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    ingest_to_pinecone()
