# rare_beauty_bestsellers.py

from playwright.sync_api import sync_playwright
import pandas as pd
import re

def scrape_bestsellers():
    url = "https://www.rarebeauty.com/collections/bestsellers"
    data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        page = browser.new_page()
        page.goto(url, timeout=60000)
        page.wait_for_load_state("domcontentloaded")

        page.wait_for_selector("div.collection-grid__item")

        products = page.query_selector_all("div.collection-grid__item")
        print(f"🛒 Found {len(products)} bestsellers")

        for idx, product in enumerate(products, start=1):
            # name
            name_element = product.query_selector("h3.pi__title a")
            name = name_element.inner_text().strip() if name_element else ""

            # product url
            link = (
                "https://www.rarebeauty.com"
                + name_element.get_attribute("href")
                if name_element and name_element.get_attribute("href") else ""
            )

            # image
            image_element = product.query_selector("img")
            image_url = image_element.get_attribute("src") if image_element else ""

            # price
            price_element = product.query_selector("button.pi__quick-add")
            price = price_element.inner_text().strip().replace("\n", " ") if price_element else ""

            # default if rating/reviews not found
            rating = "N/A"
            review_count = "N/A"

            # move into product page to get rating and review
            if link:
                try:
                    product_page = browser.new_page()
                    product_page.goto(link, timeout=60000)
                    product_page.wait_for_load_state("domcontentloaded")

                    # star rating (e.g., 4.8 star)
                    try:
                        rating_element = product_page.query_selector("span.sr-only")
                        if rating_element:
                            text = rating_element.inner_text()
                            match = re.search(r"(\d\.\d+) star", text)
                            rating = match.group(1) if match else "N/A"
                    except:
                        rating = "N/A"

                    # review count
                    try:
                        review_element = product_page.query_selector("a[aria-label*='reviews']")
                        if review_element:
                            review_text = review_element.inner_text()
                            review_count_match = re.search(r"(\d+)", review_text)
                            review_count = review_count_match.group(1) if review_count_match else "N/A"
                    except:
                        review_count = "N/A"

                    product_page.close()

                except Exception as e:
                    print(f"⚠️ Could not get reviews/ratings for {name}: {e}")

            data.append({
                "bestseller_rank": idx,
                "product_name": name,
                "product_url": link,
                "image_url": image_url,
                "price": price,
                "rating": rating,
                "review_count": review_count
            })

        browser.close()

    df = pd.DataFrame(data)
    df.to_csv("data/rare_beauty_bestsellers.csv", index=False)
    print("✅ Bestseller scrape complete with ratings + reviews saved to data/rare_beauty_bestsellers.csv")

if __name__ == "__main__":
    scrape_bestsellers()
