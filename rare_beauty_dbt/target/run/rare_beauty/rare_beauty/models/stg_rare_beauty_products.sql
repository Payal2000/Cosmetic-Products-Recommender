
  create or replace   view RARE_BEAUTY_DB.DBT_PAYAL.stg_rare_beauty_products
  
   as (
    with source as (
    select
        product_name,
        handle,
        variant_id,
        variant_title,
        variant_price,
        variant_available,
        variant_sku,
        variant_image,
        description,
        ingredients,
        finish,
        product_url
    from RARE_BEAUTY_DB.PUBLIC.RARE_BEAUTY_PRODUCTS
)

select *
from source
  );

