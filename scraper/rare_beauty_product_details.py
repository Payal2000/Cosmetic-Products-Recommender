from playwright.sync_api import sync_playwright
import pandas as pd

def scrape_product_details():
    df = pd.read_csv("data/rare_beauty_collections.csv")

    descriptions = []
    ingredients = []
    shades = []
    finishes = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=150)
        page = browser.new_page()

        for idx, row in df.iterrows():
            url = row["product_url"]
            print(f"\n({idx+1}/{len(df)}) 🔎 Scraping details for: {url}")
            
            if not isinstance(url, str) or not url.startswith("http"):
                descriptions.append("N/A")
                ingredients.append("N/A")
                shades.append("N/A")
                finishes.append("N/A")
                continue

            try:
                page.goto(url, timeout=30000)
                page.wait_for_load_state("domcontentloaded")
            except Exception as e:
                print(f"⚠️ Could not load page: {e}")
                descriptions.append("N/A")
                ingredients.append("N/A")
                shades.append("N/A")
                finishes.append("N/A")
                continue

            # description
            try:
                long_desc = page.query_selector("p.pv-extra-details__section-description")
                if long_desc:
                    description = long_desc.inner_text().strip()
                else:
                    short_desc = page.query_selector("section.pv-details p")
                    description = short_desc.inner_text().strip() if short_desc else "N/A"
            except:
                description = "N/A"

            # ingredients
            try:
                ingredient_button = page.query_selector("button[aria-label='Ingredients']")
                if ingredient_button:
                    ingredient_button.click()
                    page.wait_for_selector("div.modal_content", timeout=7000)
                    ingredient_box = page.query_selector("div.modal_content")
                    ingredients_text = ingredient_box.inner_text().strip() if ingredient_box else "N/A"
                    close_btn = page.query_selector("button.modal__Close")
                    if close_btn:
                        close_btn.click()
                else:
                    ingredients_text = "N/A"
            except Exception as e:
                print(f"⚠️ Could not get ingredients: {e}")
                ingredients_text = "N/A"

            # shades (just collect shade names)
            try:
                shade_elements = page.query_selector_all("ul.config__options--shade li.config__option")
                shade_list = []
                for s in shade_elements:
                    input_el = s.query_selector("input")
                    if input_el:
                        val = input_el.get_attribute("value")
                        if val:
                            shade_list.append(val.strip())
                    label_el = s.query_selector("label")
                    if label_el:
                        label_val = label_el.inner_text().strip()
                        if label_val and label_val not in shade_list:
                            shade_list.append(label_val)
                shade_text = ", ".join(shade_list) if shade_list else "N/A"
            except:
                shade_text = "N/A"

            # finish / claims
            try:
                finish_elements = page.query_selector_all("div.pv-extra-details_claims-features-wrapper p")
                finish_list = [f.inner_text().strip() for f in finish_elements] if finish_elements else []
                finish_text = ", ".join(finish_list) if finish_list else "N/A"
            except:
                finish_text = "N/A"

            # store results
            descriptions.append(description)
            ingredients.append(ingredients_text)
            shades.append(shade_text)
            finishes.append(finish_text)

            # safe checkpoint every 20 products
            if idx % 20 == 0 and idx > 0:
                checkpoint_df = df.iloc[:len(descriptions)].copy()
                checkpoint_df["description"] = descriptions
                checkpoint_df["ingredients"] = ingredients
                checkpoint_df["shades"] = shades
                checkpoint_df["finish"] = finishes
                checkpoint_df.to_csv("data/rare_beauty_detailed_checkpoint.csv", index=False)
                print(f"💾 Saved checkpoint at product {idx+1}")

        browser.close()

    # final merge
    df["description"] = descriptions
    df["ingredients"] = ingredients
    df["shades"] = shades
    df["finish"] = finishes

    df.to_csv("data/rare_beauty_detailed.csv", index=False)
    print("\n✅ Product detail scraping complete. Saved to data/rare_beauty_detailed.csv")

if __name__ == "__main__":
    scrape_product_details()
