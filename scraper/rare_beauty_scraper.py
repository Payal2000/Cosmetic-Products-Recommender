from playwright.sync_api import sync_playwright
import pandas as pd
import re

def scrape_rare_beauty_collections():
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
        browser = p.chromium.launch(headless=False, slow_mo=200)
        page = browser.new_page()

        for category, base_url in collections.items():
            print(f"\n🔎 Scraping category: {category}")
            category_product_count = 0

            for page_num in range(1, 10):
                url = f"{base_url}?page={page_num}"
                print(f"👉 Visiting: {url}")
                page.goto(url, timeout=60000)

                try:
                    page.wait_for_selector("div.collection-grid__item", timeout=5000)
                except Exception:
                    print(f"🚫 No products on {url}, moving on...")
                    break

                product_cards = page.query_selector_all("div.collection-grid__item")
                print(f"🛒 Found {len(product_cards)} products on page {page_num}")

                if not product_cards:
                    break  # no products

                for product in product_cards:
                    name_element = product.query_selector("h3.pi__title a")
                    name = name_element.inner_text().strip() if name_element else ""

                    link = (
                        "https://www.rarebeauty.com"
                        + name_element.get_attribute("href")
                        if name_element and name_element.get_attribute("href") else ""
                    )

                    image = product.query_selector("img")
                    image_url = ""
                    if image:
                        src = image.get_attribute("src")
                        image_url = src if src else ""

                    price_element = product.query_selector("button.pi__quick-add")
                    if price_element:
                        raw_price = price_element.inner_text().strip()
                        price_match = re.search(r"\$\s*\d+(\.\d{2})?", raw_price)
                        price = price_match.group(0) if price_match else ""
                    else:
                        price = ""

                    all_data.append({
                        "category": category,
                        "name": name,
                        "product_url": link,
                        "image_url": image_url,
                        "price": price,
                    })

                    category_product_count += 1
                    print(f"➡️ [{category}] Collected {category_product_count} products")

                    if category_product_count >= 100:
                        print(f"✅ Reached 100 products in category '{category}', moving on.")
                        break

                if category_product_count >= 100:
                    break

        browser.close()

    df = pd.DataFrame(all_data)
    df.to_csv("data/rare_beauty_collections.csv", index=False)
    print("\n✅ All done! Data saved to data/rare_beauty_collections.csv")

if __name__ == "__main__":
    scrape_rare_beauty_collections()
