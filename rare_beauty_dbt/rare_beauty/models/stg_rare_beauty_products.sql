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
    from {{ source('RARE_BEAUTY', 'RARE_BEAUTY_PRODUCTS') }}
)

select *
from source
