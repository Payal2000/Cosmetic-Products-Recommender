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
    }
    return blush_colors.get(shade_name, '#E898A6')

# Helper function for lip colors
def generate_lip_color(shade_name, product_type):
    """Map lip shade names to realistic hex colors"""

    # Soft Pinch Tinted Lip Oil (dewy finish)
    lip_oil_colors = {
        'Serenity': '#B76E6B',
        'Affection': '#A24C58',
        'Happy': '#FB7798',
        'Joy': '#F7976C',
        'Delight': '#C6846A',
        'Hope': '#D79FA8',
        'Wonder': '#E583A4',
        'Honesty': '#C18A76',
        'Truth': '#B47271',
    }

    # Kind Words Matte Lipstick
    matte_lipstick_colors = {
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
    }

    # Lip Soufflé Matte Lip Cream
    lip_souffle_colors = {
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
    }

    if 'Lip Oil' in product_type:
        return lip_oil_colors.get(shade_name, '#C6846A')
    elif 'Matte Lipstick' in product_type:
        return matte_lipstick_colors.get(shade_name, '#C27A7D')
    elif 'Soufflé' in product_type:
        return lip_souffle_colors.get(shade_name, '#E33638')

    return '#C27A7D'

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

# Extract blush shades
blush_df = df[df['product_name'] == 'Soft Pinch Liquid Blush']
blush_shades = {}
for _, row in blush_df.iterrows():
    shade = row['variant_title']
    blush_shades[shade] = generate_blush_color(shade)

print(f"✅ Extracted {len(blush_shades)} blush shades")

# Extract lip shades
lip_oil_df = df[df['product_name'] == 'Soft Pinch Tinted Lip Oil']
lip_oil_shades = {}
for _, row in lip_oil_df.iterrows():
    shade = row['variant_title']
    lip_oil_shades[shade] = generate_lip_color(shade, 'Lip Oil')

matte_lipstick_df = df[df['product_name'] == 'Kind Words Matte Lipstick']
matte_lipstick_shades = {}
for _, row in matte_lipstick_df.iterrows():
    shade = row['variant_title']
    matte_lipstick_shades[shade] = generate_lip_color(shade, 'Matte Lipstick')

lip_souffle_df = df[df['product_name'] == 'Lip Soufflé Matte Lip Cream']
lip_souffle_shades = {}
for _, row in lip_souffle_df.iterrows():
    shade = row['variant_title']
    lip_souffle_shades[shade] = generate_lip_color(shade, 'Soufflé')

print(f"✅ Extracted {len(lip_oil_shades)} lip oil shades")
print(f"✅ Extracted {len(matte_lipstick_shades)} matte lipstick shades")
print(f"✅ Extracted {len(lip_souffle_shades)} lip soufflé shades")

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

    # Lip shades
    f.write("export const lipShades = {\n")

    # Dewy lip oil
    f.write("  dewy: {\n")
    f.write("    \"Soft Pinch Tinted Lip Oil\": {\n")
    for shade, color in sorted(lip_oil_shades.items()):
        f.write(f"      {shade}: \"{color}\", ")
    f.write("\n    }\n")
    f.write("  },\n")

    # Matte lips
    f.write("  matte: {\n")
    f.write("    \"Lip Soufflé Matte Lip Cream\": {\n")
    for shade, color in sorted(lip_souffle_shades.items()):
        f.write(f"      {shade}: \"{color}\", ")
    f.write("\n    },\n")
    f.write("    \"Kind Words Matte Lipstick\": {\n")
    for shade, color in sorted(matte_lipstick_shades.items()):
        f.write(f"      {shade}: \"{color}\", ")
    f.write("\n    }\n")
    f.write("  },\n")

    # Glossy (keeping from original if exists)
    f.write("  glossy: {\n")
    f.write("    \"Stay Vulnerable Glossy Lip Balm\": {\n")
    f.write("      \"Nearly Neutral\": \"#C6846A\", \"Nearly Apricot\": \"#F5A49D\", \"Nearly Mauve\": \"#E583A4\", \"Nearly Rose\": \"#F4AEB7\", \"Nearly Berry\": \"#A24C58\"\n")
    f.write("    }\n")
    f.write("  }\n")
    f.write("};\n\n")

    # Cheek shades
    f.write("export const cheekShades = {\n")
    f.write("  matte: {\n")
    f.write("    \"Soft Pinch Liquid Blush\": {\n")
    for shade, color in sorted(blush_shades.items()):
        f.write(f"      {shade}: \"{color}\", ")
    f.write("\n    }\n")
    f.write("  },\n")
    f.write("  glossy: {\n")
    f.write("    \"Stay Vulnerable Melting Blush\": {\n")
    f.write("      \"Nearly Neutral\": \"#C6846A\", \"Nearly Apricot\": \"#F5A49D\", \"Nearly Mauve\": \"#E583A4\", \"Nearly Rose\": \"#F4AEB7\", \"Nearly Berry\": \"#A24C58\"\n")
    f.write("    }\n")
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
print(f"  Blush shades: {len(blush_shades)}")
print(f"  Lip shades: {len(lip_oil_shades) + len(matte_lipstick_shades) + len(lip_souffle_shades)}")
print(f"  Brow shades: {len(brow_shades)}")
print(f"  Bronzer shades: {len(bronzer_shades)}")
print("=" * 60)
