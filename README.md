# Rare Beauty Data Pipeline & Recommender System

This repository contains the implementation of a comprehensive **Rare Beauty Product Data Pipeline** and **Virtual Product Recommender** with Augmented Reality (AR) Try-On features. The solution integrates modern data engineering tools and techniques to provide an end-to-end workflow, from scraping product data to building a semantic product recommendation system and virtual try-on experience.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Pipeline Architecture](#pipeline-architecture)
- [Steps Completed](#steps-completed)
- [Setup & Installation](#setup--installation)
- [How to Use](#how-to-use)
- [Future Work](#future-work)

## Project Overview

This project builds an advanced data pipeline and recommendation system for Rare Beauty products. The goal is to provide personalized product recommendations based on reviews, product descriptions, shades, price, popularity, and personal preferences, while also allowing users to visualize how makeup products would look on them using an AR try-on feature.

### Key Features:
- **Web Scraping**: Collects product data, reviews, and variants from Rare Beauty's website.
- **Data Warehouse**: Integrates with Snowflake for storage, analysis, and transformations.
- **Semantic Search**: Uses Pinecone and OpenAI embeddings to recommend products based on similarity to user queries.
- **AR Try-On**: Implements a virtual makeup try-on using MediaPipe FaceMesh for lipstick and eyeshadow shades.
- **Streamlit Frontend**: Provides an interactive, user-friendly web interface to search products and try on makeup virtually.

## Tech Stack

- **Python**: Used for web scraping, data transformations, and API integrations.
- **SQL (Snowflake)**: Data storage and transformations.
- **dbt**: For managing data transformations and models in Snowflake.
- **Pinecone**: Vector search for semantic product recommendations.
- **OpenAI Embeddings**: Used to generate semantic vectors for product and review data.
- **Streamlit**: Web application framework for interactive product search and AR try-on.
- **MediaPipe FaceMesh**: Used for the AR makeup try-on feature.
- **AWS S3**: For storing product data files and ensuring easy access.

## Folder Structure
```
📦 
├─ .gitignore
├─ README.md
├─ ar-tryon
│  ├─ app.js
│  └─ index.html
├─ frontend
│  └─ app.py
├─ pipelines
│  └─ merge_and_clean.py
├─ rare_beauty_dbt
│  ├─ dbt_project.yml
│  ├─ logs
│  │  └─ dbt.log
│  ├─ rare_beauty
│  │  ├─ .gitignore
│  │  ├─ README.md
│  │  ├─ analyses
│  │  │  └─ .gitkeep
│  │  ├─ macros
│  │  │  └─ .gitkeep
│  │  ├─ models
│  │  │  ├─ int_rare_beauty_products.sql
│  │  │  ├─ sources.yml
│  │  │  ├─ stg_rare_beauty_master_merged.sql
│  │  │  └─ stg_rare_beauty_products.sql
│  │  ├─ seeds
│  │  │  └─ .gitkeep
│  │  ├─ snapshots
│  │  │  └─ .gitkeep
│  │  └─ tests
│  │     └─ .gitkeep
│  └─ target
│     ├─ catalog.json
│     ├─ compiled
│     │  └─ rare_beauty
│     │     └─ rare_beauty
│     │        └─ models
│     │           ├─ int_rare_beauty_products.sql
│     │           ├─ stg_rare_beauty_master_merged.sql
│     │           └─ stg_rare_beauty_products.sql
│     ├─ graph.gpickle
│     ├─ graph_summary.json
│     ├─ index.html
│     ├─ manifest.json
│     ├─ partial_parse.msgpack
│     ├─ run
│     │  └─ rare_beauty
│     │     └─ rare_beauty
│     │        └─ models
│     │           ├─ int_rare_beauty_products.sql
│     │           ├─ stg_rare_beauty_master_merged.sql
│     │           └─ stg_rare_beauty_products.sql
│     ├─ run_results.json
│     └─ semantic_manifest.json
├─ requirements.txt
├─ scraper
│  ├─ merge_master_reviews.py
│  ├─ merge_rare_beauty.py
│  ├─ rare_beauty_bestsellers.py
│  ├─ rare_beauty_product_details.py
│  ├─ rare_beauty_scraper.py
│  ├─ rare_beauty_variant_scraper.py
│  └─ scrape_reviews.py
└─ semantic_search
   └─ search.py
```


## Pipeline Architecture

1. **Web Scraping**:
   - `rare_beauty_scraper.py`: Scrapes product details like name, category, price, image URL, and more.
   - `rare_beauty_product_details.py`: Scrapes detailed product information such as descriptions, ingredients, and shades.
   - `rare_beauty_variants.py`: Fetches variant details from Shopify’s product JSON endpoints.
   - **Output**: Data is stored in CSV files and merged into a `rare_beauty_master.csv`.

2. **Data Integration**:
   - **Snowflake Setup**: Data is ingested into Snowflake from an S3 bucket and transformed using dbt.
   - **Transformations**: Cleaned and enriched data is transformed into views and tables in Snowflake for further analysis.

3. **Recommendation System**:
   - **Pinecone Setup**: Semantic search capabilities are implemented using Pinecone to index and query product vectors.
   - **OpenAI Embeddings**: Product names, descriptions, and reviews are converted into vectors for recommendation.

4. **Augmented Reality Try-On**:
   - **FaceMesh Integration**: Using MediaPipe’s FaceMesh, users can visualize how lipstick and eyeshadow shades look on their faces in real-time.

5. **Frontend**:
   - **Streamlit Web App**: The frontend allows users to input queries, filter by product category or price range, and try on makeup virtually.

## Steps Completed

1. **Scraping**: 
   - Built scrapers to collect product details, variants, and reviews from Rare Beauty’s website.
   
2. **Data Storage**:
   - Integrated AWS S3 for data storage and Snowflake for data warehousing.
   
3. **Data Transformation**:
   - Used dbt to create a streamlined Snowflake data model for product and review data.

4. **Recommender System**:
   - Implemented a semantic search using Pinecone and OpenAI embeddings for product recommendations.
   
5. **AR Try-On**:
   - Developed an AR feature for virtual makeup try-on using MediaPipe’s FaceMesh.

6. **Frontend**:
   - Built a user-friendly interface with Streamlit to interact with the recommender and AR try-on system.

## Setup & Installation

### Prerequisites:
- Python 3.x
- Snowflake Account
- Pinecone Account
- OpenAI API Key
- AWS S3 Bucket

### Installation Steps:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/rare-beauty-recommender.git
   cd rare-beauty-recommender
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

   Set up your Snowflake, Pinecone, and OpenAI API credentials in the appropriate configuration files (e.g., `secrets.py`, `.env`).

3. Run the scrapers to collect the product data:
   ```bash
   python rare_beauty_scraper.py
   python rare_beauty_product_details.py
   python rare_beauty_variants.py
   ```

4. Load the data into Snowflake and run dbt transformations:
   ```bash
   dbt run
   ```

5. Run the Streamlit web app:
   ```bash
   streamlit run app.py
   ```

### How to Use

- **Product Search**: Use the Streamlit interface to search for Rare Beauty products based on name, category, or price range.
- **Try-On Makeup**: Use your webcam to try on lipstick or eyeshadow shades from Rare Beauty’s product line.
- **Semantic Recommendations**: Enter a query and get personalized product recommendations based on semantic search powered by Pinecone and OpenAI embeddings.

## Demo

<img src="https://github.com/Payal2000/Cosmetic-Products-Recommender/blob/main/Demo-1.jpeg" alt="Demo Image" width="300"/>











   
