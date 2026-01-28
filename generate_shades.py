#!/usr/bin/env python3
"""
Generate complete shades.ts file from scraped Rare Beauty product data
"""
import pandas as pd
import os

# Read the master CSV
csv_path = os.path.join(os.path.dirname(__file__), 'data', 'rare_beauty_master.csv')
df = pd.read_csv(csv_path)

print("=" * 60)
print("Generating shades.ts from scraped product data")
print("=" * 60)

# Helper function to generate foundation colors based on shade number and undertone
def generate_foundation_color(shade_name):
    """Generate realistic foundation hex colors based on shade name"""
    try:
        num = int(shade_name[:3])  # Extract shade number
        undertone = shade_name[-1]  # W (warm), N (neutral), C (cool)

        # Base color progression from light to deep
        if num <= 150:  # Very light
            base_colors = {'W': '#FFE9D2', 'N': '#F3E0CD', 'C': '#E6D7C6'}
        elif num <= 200:  # Light
            base_colors = {'W': '#E6C3A7', 'N': '#CEBCA8', 'C': '#D6C5B2'}
        elif num <= 250:  # Light-medium
            base_colors = {'W': '#D4AF91', 'N': '#BD9B80', 'C': '#AF9178'}
        elif num <= 300:  # Medium
            base_colors = {'W': '#9E734E', 'N': '#A27C4D', 'C': '#917349'}
        elif num <= 350:  # Medium-deep
            base_colors = {'W': '#836133', 'N': '#725831', 'C': '#614F2D'}
        elif num <= 400:  # Deep
            base_colors = {'W': '#6E4424', 'N': '#5A3820', 'C': '#5F4029'}
        elif num <= 450:  # Very deep
            base_colors = {'W': '#553015', 'N': '#462814', 'C': '#462C1A'}
        elif num <= 500:  # Ultra deep
            base_colors = {'W': '#3C1C06', 'N': '#2D1405', 'C': '#2D180B'}
        else:  # Deepest
            base_colors = {'W': '#280C00', 'N': '#1E0800', 'C': '#140400'}

        return base_colors.get(undertone, base_colors['N'])
    except:
        return "#D4AF91"  # Default medium shade

# Helper function for blush colors
def generate_blush_color(shade_name):
    """Map blush shade names to realistic hex colors"""
    blush_colors = {
        # Soft Pinch Liquid Blush (main product)
        'Bliss': '#F4AEB7',
        'Hope': '#D79FA8',
        'Adore': '#E898A6',
        'Happy': '#FB7798',
        'Worth': '#E8A5AC',
        'Virtue': '#F2B5BB',
        'Love': '#E25C4C',
        'Resilience': '#D16C6C',
        'Joy': '#F7976C',
        'Grateful': '#D33638',
        'Lucky': '#FF5D73',
        'Spirited': '#FF7A8A',
        'Grace': '#F4949D',
        'Encourage': '#E0A2AA',
        'Believe': '#B84C5C',
        'Faith': '#8B3D51',
        'Charm': '#F5A5B8',
        'Truth': '#D88A99',
        'Wonder': '#E583A4',

        # Soft Pinch Luminous Powder Blush
        'Cheer': '#F9B5C0',

        # Soft Pinch Matte Bouncy Blush
        'Divine': '#EFA1B1',
        'Alive': '#FF8599',
        'Thriving': '#E27B8E',
        'Soulful': '#B85C6F',

        # Stay Vulnerable Melting Blush
        'Nearly Neutral': '#C6846A',
        'Nearly Apricot': '#F5A49D',
        'Nearly Mauve': '#E583A4',
        'Nearly Rose': '#F4AEB7',
        'Nearly Berry': '#A24C58',
    }
    return blush_colors.get(shade_name, '#E898A6')

# Helper function for lip colors
def generate_lip_color(shade_name, product_type):
    """Map lip shade names to realistic hex colors"""

    # All lip shade colors mapped by name
    lip_shade_colors = {
        # Soft Pinch Tinted Lip Oil (dewy finish)
        'Serenity': '#B76E6B',
        'Affection': '#A24C58',
        'Happy': '#FB7798',
        'Joy': '#F7976C',
        'Delight': '#C6846A',
        'Hope': '#D79FA8',
        'Wonder': '#E583A4',
        'Honesty': '#C18A76',
        'Truth': '#B47271',

        # Kind Words Matte Lipstick & Liner
        'Worthy': '#C27A7D',
        'Talented': '#D0948C',
        'Humble': '#BE8289',
        'Gifted': '#B06C74',
        'Bold': '#912F3B',
        'Wise': '#7A3D44',
        'Strong': '#68343A',
        'Lively': '#DE8F90',
        'Fun': '#ED9BA7',
        'Creative': '#E2858F',
        'Devoted': '#A5404F',

        # Lip Soufflé Matte Lip Cream
        'Inspire': '#E33638',
        'Heroic': '#A8344C',
        'Brave': '#E25C4C',
        'Daring': '#A589A3',
        'Fearless': '#8B3D51',
        'Courage': '#D79FA8',
        'Transform': '#8C1D2B',
        'Energize': '#FF6F61',
        'Strengthen': '#7A2430',
        'Motivate': '#FF5D73',
        'Ascend': '#C67C89',
        'Thrilling': '#B5455D',

        # Stay Vulnerable Glossy Lip Balm
        'Nearly Neutral': '#C6846A',
        'Nearly Apricot': '#F5A49D',
        'Nearly Mauve': '#E583A4',
        'Nearly Rose': '#F4AEB7',
        'Nearly Berry': '#A24C58',
        'Nearly Petal': '#F2B5BB',

        # Positive Light Luminizing Lip Gloss
        'Dazzle': '#FFB3C1',
        'Beam': '#FFC5A3',
        'Flicker': '#F5A49D',
        'Glimmer': '#FFCCD5',
        'Spark': '#FFD4C4',
        'Blaze': '#FF9BAD',

        # Find Comfort Lip Butter
        'Easygoing': '#D9A598',
        'Loved': '#E8A5AC',
        'Friendly': '#F4AEB7',
        'Uplifting': '#FFB8C3',
    }

    return lip_shade_colors.get(shade_name, '#C27A7D')

# Helper for brow colors
def generate_brow_color(shade_name):
    """Map brow shade names to realistic hex colors"""
    brow_colors = {
        'Soft Blonde': '#D1B79A',
        'Blonde': '#C8A87D',
        'Warm Auburn': '#A56547',
        'Soft Brown': '#8A6752',
        'Brown': '#6D4F3A',
        'Cool Brown': '#5B4A3B',
        'Deep Brown': '#4B3A2F',
        'Soft Black': '#3C2E27',
        'Rich Taupe': '#927E6A',
        'Warm Brown': '#8A6B54',
        'Taupe': '#B29A81',
    }
    return brow_colors.get(shade_name, '#8A6752')

# Helper for bronzer/contour
def generate_contour_color(shade_name):
    """Map contour shade names to realistic hex colors"""
    contour_colors = {
        'Power Boost': '#A2644F',
        'Happy Sol': '#A76552',
        'Always Sunny': '#9C644B',
        'True Warmth': '#8B5847',
        'Good Energy': '#A5694F',
        'On the Horizon': '#8A5A47',
        'Full of Life': '#7A4C3A',
        'Summer Feels': '#C9936F',
        'Sun Blaze': '#B8845E',
        'Warmed Up': '#A77557',
        'Sunny Spirits': '#96664C',
        'Radiate Warmth': '#85573F',
        'Bronze Bliss': '#744834',
        'New Dawn': '#633929',
    }
    return contour_colors.get(shade_name, '#A2644F')

# Extract foundation shades
foundation_df = df[df['product_name'] == 'Liquid Touch Weightless Foundation']
foundation_shades = {}
for _, row in foundation_df.iterrows():
    shade = row['variant_title']
    foundation_shades[shade] = generate_foundation_color(shade)

print(f"✅ Extracted {len(foundation_shades)} foundation shades")

# Extract ALL blush products and their shades
all_blush_products = {}
blush_product_names = [
    'Soft Pinch Liquid Blush',
    'Soft Pinch Matte Bouncy Blush',
    'Soft Pinch Luminous Powder Blush',
    'Stay Vulnerable Melting Blush'
]

for product_name in blush_product_names:
    product_df = df[df['product_name'] == product_name]
    if len(product_df) > 0:
        shades = {}
        for _, row in product_df.iterrows():
            shade = row['variant_title']
            if shade and shade != 'Default Title':
                shades[shade] = generate_blush_color(shade)

        if shades:
            all_blush_products[product_name] = shades
            print(f"✅ Extracted {len(shades)} shades for {product_name}")

# Extract ALL lip products and their shades
all_lip_products = {}
lip_product_names = [
    'Soft Pinch Tinted Lip Oil',
    'Kind Words Matte Lipstick',
    'Lip Soufflé Matte Lip Cream',
    'Stay Vulnerable Glossy Lip Balm',
    'Positive Light Luminizing Lip Gloss',
    'Find Comfort Lip Butter',
    'Kind Words Matte Lip Liner'
]

for product_name in lip_product_names:
    product_df = df[df['product_name'] == product_name]
    if len(product_df) > 0:
        shades = {}
        for _, row in product_df.iterrows():
            shade = row['variant_title']
            if shade and shade != 'Default Title':
                shades[shade] = generate_lip_color(shade, product_name)

        if shades:
            all_lip_products[product_name] = shades
            print(f"✅ Extracted {len(shades)} shades for {product_name}")

# Extract brow shades
brow_df = df[df['product_name'].str.contains('Brow Harmony', na=False)]
brow_shades = {}
for _, row in brow_df.iterrows():
    shade = row['variant_title']
    if shade and shade != 'Default Title':
        brow_shades[shade] = generate_brow_color(shade)

print(f"✅ Extracted {len(brow_shades)} brow shades")

# Extract bronzer shades
bronzer_df = df[df['product_name'].str.contains('Bronzer', na=False)]
bronzer_shades = {}
for _, row in bronzer_df.iterrows():
    shade = row['variant_title']
    if shade:
        bronzer_shades[shade] = generate_contour_color(shade)

print(f"✅ Extracted {len(bronzer_shades)} bronzer shades")

# Generate TypeScript file
output_path = os.path.join(os.path.dirname(__file__), 'frontend-next', 'data', 'shades.ts')

with open(output_path, 'w') as f:
    f.write("// Auto-generated from scraped Rare Beauty product data\n")
    f.write("// All shades are real products available on rarebeauty.com\n\n")

    # Lip shades - organized by finish type
    f.write("export const lipShades = {\n")

    # Dewy/glossy lip products
    f.write("  dewy: {\n")
    dewy_products = ['Soft Pinch Tinted Lip Oil', 'Positive Light Luminizing Lip Gloss', 'Find Comfort Lip Butter']
    for product_name in dewy_products:
        if product_name in all_lip_products:
            f.write(f"    \"{product_name}\": {{\n")
            for shade, color in sorted(all_lip_products[product_name].items()):
                f.write(f"      \"{shade}\": \"{color}\",\n")
            f.write("    },\n")
    f.write("  },\n")

    # Matte lip products
    f.write("  matte: {\n")
    matte_products = ['Lip Soufflé Matte Lip Cream', 'Kind Words Matte Lipstick', 'Kind Words Matte Lip Liner']
    for product_name in matte_products:
        if product_name in all_lip_products:
            f.write(f"    \"{product_name}\": {{\n")
            for shade, color in sorted(all_lip_products[product_name].items()):
                f.write(f"      \"{shade}\": \"{color}\",\n")
            f.write("    },\n")
    f.write("  },\n")

    # Glossy/balm lip products
    f.write("  glossy: {\n")
    glossy_products = ['Stay Vulnerable Glossy Lip Balm']
    for product_name in glossy_products:
        if product_name in all_lip_products:
            f.write(f"    \"{product_name}\": {{\n")
            for shade, color in sorted(all_lip_products[product_name].items()):
                f.write(f"      \"{shade}\": \"{color}\",\n")
            f.write("    },\n")
    f.write("  }\n")
    f.write("};\n\n")

    # Cheek shades - organized by finish type
    f.write("export const cheekShades = {\n")

    # Matte blush products
    f.write("  matte: {\n")
    matte_blush_products = ['Soft Pinch Liquid Blush', 'Soft Pinch Matte Bouncy Blush']
    for product_name in matte_blush_products:
        if product_name in all_blush_products:
            f.write(f"    \"{product_name}\": {{\n")
            for shade, color in sorted(all_blush_products[product_name].items()):
                f.write(f"      \"{shade}\": \"{color}\",\n")
            f.write("    },\n")
    f.write("  },\n")

    # Glossy/dewy blush products
    f.write("  glossy: {\n")
    glossy_blush_products = ['Stay Vulnerable Melting Blush']
    for product_name in glossy_blush_products:
        if product_name in all_blush_products:
            f.write(f"    \"{product_name}\": {{\n")
            for shade, color in sorted(all_blush_products[product_name].items()):
                f.write(f"      \"{shade}\": \"{color}\",\n")
            f.write("    },\n")
    f.write("  },\n")

    # Luminous/shimmer blush products
    f.write("  luminous: {\n")
    luminous_blush_products = ['Soft Pinch Luminous Powder Blush']
    for product_name in luminous_blush_products:
        if product_name in all_blush_products:
            f.write(f"    \"{product_name}\": {{\n")
            for shade, color in sorted(all_blush_products[product_name].items()):
                f.write(f"      \"{shade}\": \"{color}\",\n")
            f.write("    },\n")
    f.write("  }\n")
    f.write("};\n\n")

    # Brow products
    f.write("export const browProducts = {\n")
    f.write("  \"Brow Harmony Pencil & Gel\": {\n")
    for shade, color in sorted(brow_shades.items()):
        f.write(f"    \"{shade}\": \"{color}\",\n")
    f.write("  },\n")
    f.write("  \"Brow Harmony Flexible Lifting Gel\": {\n")
    f.write("    \"Clear\": \"transparent\"\n")
    f.write("  }\n")
    f.write("};\n\n")

    # Contour shades
    f.write("export const contourShades = {\n")
    if bronzer_shades:
        f.write("  \"Warm Wishes Bronzer\": {\n")
        for shade, color in sorted(bronzer_shades.items()):
            f.write(f"    \"{shade}\": \"{color}\",\n")
        f.write("  }\n")
    f.write("};\n\n")

    # Foundation shades
    f.write("export const foundationShades = {\n")
    f.write("  \"Liquid Touch Weightless Foundation\": {\n")
    for shade, color in sorted(foundation_shades.items()):
        f.write(f"    \"{shade}\": \"{color}\",\n")
    f.write("  }\n")
    f.write("};\n")

print(f"\n✅ Generated shades.ts at: {output_path}")
print("=" * 60)
print("Summary:")
print(f"  Foundation shades: {len(foundation_shades)}")

# Count total blush shades
total_blush_shades = sum(len(shades) for shades in all_blush_products.values())
print(f"  Blush products: {len(all_blush_products)} ({total_blush_shades} total shades)")
for product_name, shades in all_blush_products.items():
    print(f"    - {product_name}: {len(shades)} shades")

# Count total lip shades
total_lip_shades = sum(len(shades) for shades in all_lip_products.values())
print(f"  Lip products: {len(all_lip_products)} ({total_lip_shades} total shades)")
for product_name, shades in all_lip_products.items():
    print(f"    - {product_name}: {len(shades)} shades")

print(f"  Brow shades: {len(brow_shades)}")
print(f"  Bronzer shades: {len(bronzer_shades)}")
print("=" * 60)
