import pandas as pd
import requests
from urllib.parse import urlparse

def scrape_shopify_variants():
    df = pd.read_csv("data/rare_beauty_collections.csv")

    variant_data = []

    for idx, row in df.iterrows():
        product_url = row["product_url"]
        category = row["category"]

        if not isinstance(product_url, str) or not product_url.startswith("http"):
            continue

        # extract handle from product URL
        try:
            path = urlparse(product_url).path  # /products/soft-pinch-liquid-blush
            handle = path.split("/products/")[1].split("/")[0]
        except Exception as e:
            print(f"⚠️ could not parse handle from {product_url}: {e}")
            continue

        json_url = f"https://www.rarebeauty.com/products/{handle}.js"
        print(f"\n({idx+1}/{len(df)}) 🟢 Fetching variants from: {json_url}")

        try:
            response = requests.get(json_url)
            if response.status_code != 200:
                print(f"❌ Could not fetch JSON for {handle}")
                continue

            data = response.json()

            for variant in data.get("variants", []):
                variant_data.append({
                    "category": category,
                    "product_name": data.get("title", "N/A"),
                    "handle": handle,
                    "variant_id": variant.get("id"),
                    "variant_title": variant.get("public_title") or variant.get("title"),
                    "variant_price": variant.get("price")/100 if variant.get("price") else "N/A",
                    "variant_available": variant.get("available"),
                    "variant_sku": variant.get("sku"),
                    "variant_image": variant.get("featured_image", {}).get("src") if variant.get("featured_image") else data.get("featured_image"),
                    "product_url": product_url,
                })

        except Exception as e:
            print(f"⚠️ Error on {json_url}: {e}")
            continue

    # save results
    out_df = pd.DataFrame(variant_data)
    out_df.to_csv("data/rare_beauty_variants.csv", index=False)
    print("\n✅ Saved all variants to data/rare_beauty_variants.csv")

if __name__ == "__main__":
    scrape_shopify_variants()
