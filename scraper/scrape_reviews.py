# scrape_all_collections_reviews.py

from playwright.sync_api import sync_playwright
import pandas as pd
import re
import requests

def scrape_all_collections_reviews():
    collections = {
        "face": "https://www.rarebeauty.com/collections/face",
        "lips": "https://www.rarebeauty.com/collections/lip",
        "eyes": "https://www.rarebeauty.com/collections/eye",
        "body": "https://www.rarebeauty.com/collections/body",
        "tools": "https://www.rarebeauty.com/collections/tools",
        "online_only": "https://www.rarebeauty.com/collections/online-only",
    }

    all_data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        page = browser.new_page()

        for category, url in collections.items():
            print(f"📦 Scraping category: {category} → {url}")
            page.goto(url, timeout=60000)
            page.wait_for_load_state("domcontentloaded")
            try:
                page.wait_for_selector("div.collection-grid__item", timeout=10000)
            except:
                print(f"🚫 No products found for {category}, skipping...")
                continue

            products = page.query_selector_all("div.collection-grid__item")
            print(f"🛒 Found {len(products)} products in {category}")

            for idx, product in enumerate(products, start=1):
                name_element = product.query_selector("h3.pi__title a")
                name = name_element.inner_text().strip() if name_element else ""
                link = (
                    "https://www.rarebeauty.com"
                    + name_element.get_attribute("href")
                    if name_element and name_element.get_attribute("href") else ""
                )
                image_element = product.query_selector("img")
                image_url = image_element.get_attribute("src") if image_element else ""
                price_element = product.query_selector("button.pi__quick-add")
                price = price_element.inner_text().strip().replace("\n", " ") if price_element else ""

                # now get variants for each product using .js endpoint
                try:
                    handle = link.split("/products/")[1].split("?")[0]
                    json_url = f"https://www.rarebeauty.com/products/{handle}.js"
                    product_json = requests.get(json_url).json()
                    variants = product_json.get("variants", [])
                except Exception as e:
                    print(f"⚠️ Could not get variants JSON for {name}: {e}")
                    variants = []

                # loop over each variant to get its URL and reviews
                for variant in variants:
                    variant_id = variant.get("id")
                    variant_title = variant.get("public_title") or variant.get("title")
                    variant_url = f"{link}?variant={variant_id}"

                    rating = "N/A"
                    review_count = "N/A"

                    try:
                        variant_page = browser.new_page()
                        variant_page.goto(variant_url, timeout=60000)
                        variant_page.wait_for_load_state("domcontentloaded")

                        # star rating
                        try:
                            rating_element = variant_page.query_selector("span.sr-only")
                            if rating_element:
                                text = rating_element.inner_text()
                                match = re.search(r"(\d\.\d+) star", text)
                                rating = match.group(1) if match else "N/A"
                        except:
                            rating = "N/A"

                        # review count
                        try:
                            review_element = variant_page.query_selector("a[aria-label*='reviews']")
                            if review_element:
                                review_text = review_element.inner_text()
                                review_count_match = re.search(r"(\d+)", review_text)
                                review_count = review_count_match.group(1) if review_count_match else "N/A"
                        except:
                            review_count = "N/A"

                        variant_page.close()
                    except Exception as e:
                        print(f"⚠️ Could not get reviews for {name} ({variant_title}): {e}")

                    all_data.append({
                        "category": category,
                        "product_rank": idx,
                        "product_name": name,
                        "variant_title": variant_title,
                        "variant_id": variant_id,
                        "variant_url": variant_url,
                        "image_url": image_url,
                        "price": price,
                        "rating": rating,
                        "review_count": review_count
                    })

        browser.close()

    df = pd.DataFrame(all_data)
    df.to_csv("data/rare_beauty_all_reviews_by_variant.csv", index=False)
    print("✅ All collections + all variants scraped successfully → data/rare_beauty_all_reviews_by_variant.csv")

if __name__ == "__main__":
    scrape_all_collections_reviews()
