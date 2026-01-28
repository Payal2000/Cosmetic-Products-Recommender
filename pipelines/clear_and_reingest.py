"""
Clear Pinecone index and re-ingest all products fresh
"""
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pinecone import Pinecone

# Initialize
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "pcsk_4re8cR_AZR6MC7Ytc3aQ9E2LrEmtRj1J1YoNi2woe8ZeCdTJTbHGSmK3aAH3AkTGXUj6gG")
INDEX_NAME = os.getenv("INDEX_NAME", "rare-beauty-vectors")

print("=" * 60)
print("🗑️  CLEARING AND RE-INGESTING PINECONE INDEX")
print("=" * 60)

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)

# Get current stats
stats = index.describe_index_stats()
print(f"\n📊 Current index stats:")
print(f"   Total vectors: {stats.total_vector_count}")

# Delete all vectors
print(f"\n🗑️  Deleting all vectors from index '{INDEX_NAME}'...")
index.delete(delete_all=True)

print("✅ All vectors deleted!")

# Verify
import time
time.sleep(3)  # Wait for deletion to propagate
stats = index.describe_index_stats()
print(f"\n📊 After deletion:")
print(f"   Total vectors: {stats.total_vector_count}")

print("\n✅ Index cleared! Now running ingestion...")
print("=" * 60)

# Now run the ingestion
os.system(f"OPENAI_API_KEY='{os.getenv('OPENAI_API_KEY')}' PINECONE_API_KEY='{PINECONE_API_KEY}' INDEX_NAME='{INDEX_NAME}' python3 pipelines/ingest_to_pinecone.py")
