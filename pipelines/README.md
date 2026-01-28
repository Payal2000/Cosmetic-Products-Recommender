# Pinecone Ingestion Pipeline

This directory contains scripts for processing and uploading Rare Beauty product data to Pinecone.

## 📋 Prerequisites

### 1. Install Required Packages
```bash
pip install pandas openai pinecone-client tqdm
```

### 2. Set Environment Variables

Create a `.env` file or export these variables:

```bash
export OPENAI_API_KEY="sk-..."
export PINECONE_API_KEY="pcsk_..."
export INDEX_NAME="rare-beauty-products"  # Optional, defaults to this
```

Or use them inline when running scripts:
```bash
OPENAI_API_KEY=sk-... PINECONE_API_KEY=pcsk_... python3 pipelines/ingest_to_pinecone.py
```

### 3. Prepare Data

Run the merge script to combine all scraped data:
```bash
python3 scraper/merge_rare_beauty.py
```

This creates `data/rare_beauty_master.csv` with all product variants and details.

## 🚀 Usage

### Step 1: Test Your Setup

Verify everything is configured correctly:

```bash
python3 pipelines/test_setup.py
```

This will check:
- ✅ Required Python packages
- ✅ Environment variables
- ✅ Data files
- ✅ API connections to OpenAI and Pinecone

### Step 2: Run the Ingestion Pipeline

```bash
python3 pipelines/ingest_to_pinecone.py
```

The pipeline will:
1. Load the master product dataset
2. Create rich embedding text from product data
3. Generate embeddings using OpenAI (text-embedding-3-small)
4. Upload vectors to Pinecone with metadata
5. Show progress with a progress bar

**Features:**
- ✅ Automatic retry with exponential backoff
- ✅ Checkpoint/resume support (if it fails, just re-run)
- ✅ Batch processing to handle large datasets
- ✅ Rate limiting protection
- ✅ Progress tracking with tqdm

## 📊 What Gets Embedded?

For each product variant, we create embeddings from:
- Product name
- Variant/shade name
- Category (face, lips, eyes, etc.)
- Full description
- Ingredients list
- Finish/claims (matte, dewy, etc.)

## 🗂️ Metadata Stored in Pinecone

Each vector includes metadata for filtering and display:

```python
{
    "product_name": "Soft Pinch Liquid Blush",
    "variant_title": "Hope",
    "category": "face",
    "price": 25.0,
    "available": true,
    "variant_sku": "ABC123",
    "variant_image": "https://...",
    "product_url": "https://...",
    "description": "...",
    "ingredients": "...",
    "finish": "matte, buildable"
}
```

## 🔧 Troubleshooting

### "OPENAI_API_KEY environment variable not set"
Set your OpenAI API key:
```bash
export OPENAI_API_KEY="sk-..."
```

### "PINECONE_API_KEY environment variable not set"
Set your Pinecone API key:
```bash
export PINECONE_API_KEY="pcsk_..."
```

### "No such file: data/rare_beauty_master.csv"
Run the merge script first:
```bash
python3 scraper/merge_rare_beauty.py
```

### Rate Limit Errors
The script automatically retries with exponential backoff. If you still hit rate limits, the checkpoint system will save progress and you can resume.

### Resume from Checkpoint
If the pipeline fails partway through, just re-run it. It will automatically resume from where it left off using the checkpoint file (`data/ingestion_checkpoint.json`).

## 📈 Expected Results

For the current Rare Beauty dataset:
- **504 product variants** will be embedded
- **~2-5 minutes** to complete (depending on API speed)
- **1536-dimensional vectors** (using text-embedding-3-small)
- **~100KB** of metadata per 100 products

## 🎯 Next Steps

After ingestion, your products are searchable via the Streamlit app:

```bash
streamlit run frontend/app.py
```

Or use the semantic search module directly:

```python
from semantic_search.search import search_products

results = search_products(
    query="natural dewy blush for fair skin",
    category_filter=["face"],
    top_k=10
)
```
