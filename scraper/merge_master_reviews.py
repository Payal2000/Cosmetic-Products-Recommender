import pandas as pd

# Load product-level data
products = pd.read_csv("data/rare_beauty_variants.csv")
print(f"✅ Products rows: {len(products)}")

# Load reviews data
reviews = pd.read_csv("data/rare_beauty_all_reviews_by_variant.csv")
print(f"✅ Reviews rows: {len(reviews)}")

# Add a synthetic variant_id in reviews to match
if "variant_id" not in reviews.columns:
    reviews["variant_id"] = None  # fill with None to allow join

# Merge on category + product_name + variant_id
merged = pd.merge(
    products,
    reviews,
    on=["category", "product_name", "variant_id"],
    how="outer",
    suffixes=("_product", "_review")
)

# Fill missing review columns with N/A
for col in ["rating", "review_count"]:
    if col in merged.columns:
        merged[col] = merged[col].fillna("N/A")

# Save final master
merged.to_csv("data/rare_beauty_master_merged.csv", index=False)
print("✅ Merged data saved to data/rare_beauty_master_merged.csv")
