import streamlit as st
from pinecone import Pinecone
from openai import OpenAI

# CONFIG
st.set_page_config(
    page_title="Rare Beauty Recommender",
    layout="wide"
)

# Pinecone
PINECONE_API_KEY = st.secrets["PINECONE_API_KEY"]
PINECONE_ENVIRONMENT = st.secrets["PINECONE_ENVIRONMENT"]
INDEX_NAME = st.secrets["INDEX_NAME"]

OPENAI_API_KEY = st.secrets["OPENAI_API_KEY"]

# Initialize
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)

client = OpenAI(api_key=OPENAI_API_KEY)

st.title("Rare Beauty Recommender")

# ============ SESSION STATE ==============

if "conversation" not in st.session_state:
    st.session_state.conversation = []

# ============ SIDEBAR FILTERS ==============

st.sidebar.image(
    "https://theindustry.beauty/wp-content/uploads/2024/09/RAREB.jpg",
    width=180
)
st.sidebar.header("🪞 Rare Beauty Recommender")

query = st.sidebar.text_area("What are you looking for?", "", height=120)

category_filter = st.sidebar.multiselect(
    "Choose categories",
    ["face", "lips", "eyes", "tools", "body"],
)

price_range = st.sidebar.slider("Select price range ($)", 0, 100, (0, 50))

min_rating = st.sidebar.slider("Minimum rating", 0.0, 5.0, 3.0)

# ============ PRELOADED MAKEUP LOOKS ==============

st.sidebar.markdown("**💄 Try a pre-loaded makeup look:**")
if st.sidebar.button("Summer Dewy Glow"):
    query = "products for a summer dewy glow with Rare Beauty"
if st.sidebar.button("Natural Office Look"):
    query = "lightweight natural makeup for office from Rare Beauty"
if st.sidebar.button("Evening Glam Look"):
    query = "evening glam look with Rare Beauty products"

search_button = st.sidebar.button("Search")

# ============ CSS FOR CARDS ==============

st.markdown("""
    <style>
    .product-card {
        background-color: #fdf7f4;
        border: 1px solid #e0cfc5;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 2px 2px 12px rgba(174, 144, 128, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 4px 4px 16px rgba(174, 144, 128, 0.3);
    }
    .product-card img {
        border-radius: 10px;
        margin-bottom: 8px;
    }
    .product-name {
        font-size: 16px;
        font-weight: 600;
        color: #5c3b31;
        margin-bottom: 4px;
    }
    .product-price {
        color: #a64b2a;
        font-weight: bold;
        margin-bottom: 4px;
    }
    .product-category {
        color: #6d4c41;
        font-size: 14px;
        margin-bottom: 4px;
    }
    .product-description {
        font-size: 13px;
        color: #3d2b24;
        margin-bottom: 4px;
    }
    .product-rating {
        font-size: 13px;
        color: #3d2b24;
    }
    </style>
""", unsafe_allow_html=True)

# ============ MAIN LOGIC ==============

if search_button and query.strip():
    st.session_state.conversation.append(query)

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    query_vector = response.data[0].embedding

    pinecone_filter = {}
    if category_filter:
        pinecone_filter["category"] = {"$in": category_filter}

    results = index.query(
        vector=query_vector,
        top_k=30,
        include_metadata=True,
        filter=pinecone_filter
    )

    st.write(f"### 🔎 Results for **{query}**")

    matches = results.get("matches", [])

    if not matches:
        st.info("No products found.")
    else:
        columns = st.columns(4)
        for i, match in enumerate(matches):
            metadata = match["metadata"]
            name = metadata.get("product_name", "Unknown")
            price = metadata.get("price", 0.0)
            category = metadata.get("category", "N/A")
            rating = metadata.get("rating", 0.0)
            review_count = metadata.get("review_count", 0)
            description = metadata.get("description", "No description available")
            variant = metadata.get("variant_title_product", "Default")
            image_url = metadata.get("image_url", "")

            if price < price_range[0] or price > price_range[1]:
                continue
            if rating < min_rating:
                continue

            if image_url.startswith("//"):
                image_url = "https:" + image_url

            col = columns[i % 4]
            with col:
                st.markdown(f"""
                <div class="product-card">
                    <img src="{image_url}" width="100%">
                    <div class="product-name">{name}</div>
                    <div class="product-price">${price:.2f}</div>
                    <div class="product-category">{category}</div>
                    <div class="product-description">{description[:120]}...</div>
                    <div class="product-rating">⭐ {rating} ({review_count} reviews)</div>
                    <div class="product-description">Variant: {variant}</div>
                </div>
                """, unsafe_allow_html=True)

# ============ SESSION HISTORY ==============

if st.session_state.conversation:
    st.write("### 🗣️ Your conversation so far:")
    for q in st.session_state.conversation:
        st.markdown(f"- {q}")

st.markdown("---")
if st.button("💄 Try-On Yourself!"):
    st.markdown(
        """
        <meta http-equiv="refresh" content="0; url='cosmetic-products-recommender-zmp1.vercel.app'" />
        """,
        unsafe_allow_html=True
    )

st.caption("Made with ❤️ using Streamlit, Pinecone, and OpenAI")