
  create or replace   view RARE_BEAUTY_DB.DBT_PAYAL.stg_rare_beauty_master_merged
  
   as (
    WITH source AS (
    SELECT *
    FROM RARE_BEAUTY_DB.DBT_PAYAL.rare_beauty_master_merged
),

cleaned AS (
    SELECT
        category,
        product_name,
        handle,
        variant_id,
        variant_title_product,
        variant_price,
        variant_available,
        variant_sku,
        variant_image,
        product_url,
        product_rank,
        variant_title_review,
        variant_url,
        image_url,

        -- Clean price
        TRY_CAST(
            REGEXP_SUBSTR(price, '\\$([0-9]+(\\.[0-9]+)?)', 1, 1, 'e', 1)
            AS FLOAT
        ) AS cleaned_price,

        -- Clean rating
        CASE
            WHEN rating ILIKE 'N/A' THEN NULL
            ELSE TRY_CAST(rating AS FLOAT)
        END AS cleaned_rating,

        -- Clean review count
        CASE
            WHEN review_count ILIKE 'N/A' THEN NULL
            ELSE TRY_CAST(review_count AS INTEGER)
        END AS cleaned_review_count

    FROM source
)

SELECT *
FROM cleaned
  );

