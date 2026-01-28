"""
Test script to verify environment setup before running ingestion.
"""

import os
import sys

def test_environment():
    """Test that all required packages and credentials are available."""

    print("🧪 Testing Environment Setup\n")
    print("=" * 60)

    errors = []
    warnings = []

    # Test 1: Check required packages
    print("\n1️⃣ Checking required packages...")
    required_packages = {
        'pandas': 'pandas',
        'openai': 'openai',
        'pinecone': 'pinecone-client',
        'tqdm': 'tqdm'
    }

    for package, pip_name in required_packages.items():
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - MISSING")
            errors.append(f"Install {package}: pip install {pip_name}")

    # Test 2: Check environment variables
    print("\n2️⃣ Checking environment variables...")
    required_env_vars = ['OPENAI_API_KEY', 'PINECONE_API_KEY']
    optional_env_vars = ['INDEX_NAME']

    for var in required_env_vars:
        if os.getenv(var):
            print(f"   ✅ {var} is set")
        else:
            print(f"   ❌ {var} - NOT SET")
            errors.append(f"Set {var} environment variable")

    for var in optional_env_vars:
        if os.getenv(var):
            print(f"   ✅ {var} is set (value: {os.getenv(var)})")
        else:
            print(f"   ⚠️  {var} - NOT SET (will use default)")
            warnings.append(f"Optional: Set {var} environment variable")

    # Test 3: Check data files
    print("\n3️⃣ Checking data files...")
    required_files = ['data/rare_beauty_master.csv']

    for filepath in required_files:
        if os.path.exists(filepath):
            import pandas as pd
            df = pd.read_csv(filepath)
            print(f"   ✅ {filepath} ({len(df)} records)")
        else:
            print(f"   ❌ {filepath} - NOT FOUND")
            errors.append(f"Run: python3 scraper/merge_rare_beauty.py")

    # Test 4: Test API connections
    print("\n4️⃣ Testing API connections...")

    # OpenAI test
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input="test"
        )
        print(f"   ✅ OpenAI API connection successful")
    except Exception as e:
        print(f"   ❌ OpenAI API connection failed: {e}")
        errors.append("Check OPENAI_API_KEY is valid")

    # Pinecone test
    try:
        from pinecone import Pinecone
        pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        indexes = pc.list_indexes()
        print(f"   ✅ Pinecone API connection successful")
        print(f"      Existing indexes: {[idx.name for idx in indexes]}")
    except Exception as e:
        print(f"   ❌ Pinecone API connection failed: {e}")
        errors.append("Check PINECONE_API_KEY is valid")

    # Results
    print("\n" + "=" * 60)
    if errors:
        print("\n❌ SETUP INCOMPLETE - Please fix the following:\n")
        for i, error in enumerate(errors, 1):
            print(f"   {i}. {error}")
        print("\n" + "=" * 60)
        sys.exit(1)
    else:
        print("\n✅ ALL CHECKS PASSED!")
        if warnings:
            print("\n⚠️  Optional improvements:")
            for warning in warnings:
                print(f"   - {warning}")
        print("\n🚀 You're ready to run the ingestion pipeline!")
        print("\n   Run: python3 pipelines/ingest_to_pinecone.py")
        print("\n" + "=" * 60)


if __name__ == "__main__":
    test_environment()
