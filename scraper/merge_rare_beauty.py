import pandas as pd
from urllib.parse import urlparse

# load all three dataframes
collections_df = pd.read_csv("data/rare_beauty_collections.csv")
details_df = pd.read_csv("data/rare_beauty_detailed.csv")
variants_df = pd.read_csv("data/rare_beauty_variants.csv")

# add handle columns to each
def extract_handle(url):
    try:
        return urlparse(url).path.split("/products/")[1].split("/")[0]
    except:
        return None

collections_df["handle"] = collections_df["product_url"].apply(extract_handle)
details_df["handle"] = details_df["product_url"].apply(extract_handle)
variants_df["handle"] = variants_df["handle"].astype(str)

# merge product-level details into variants
merged = variants_df.merge(
    details_df[["handle", "description", "ingredients", "finish"]],
    on="handle",
    how="left"
)

print("✅ columns after merging details:")
print(merged.columns.tolist())

# merge category from collections
merged = merged.merge(
    collections_df[["handle", "category"]],
    on="handle",
    how="left"
)

print("✅ columns after merging category:")
print(merged.columns.tolist())

# safe final columns
expected_columns = [
    "category",
    "product_name",
    "handle",
    "variant_id",
    "variant_title",
    "variant_price",
    "variant_available",
    "variant_sku",
    "variant_image",
    "description",
    "ingredients",
    "finish",
    "product_url",
]

# only include columns that actually exist
final_columns = [col for col in expected_columns if col in merged.columns]
merged = merged[final_columns]

# save to master
merged.to_csv("data/rare_beauty_master.csv", index=False)
print("\n✅ Merged master CSV created: data/rare_beauty_master.csv")
