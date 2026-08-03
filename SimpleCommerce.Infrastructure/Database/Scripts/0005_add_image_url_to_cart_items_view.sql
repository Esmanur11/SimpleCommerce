-- Exposes products.image_url through v_cart_items_detail so cart items can show a product image.
-- Run manually against the target Postgres database (no migration runner exists in this repo yet).

CREATE OR REPLACE VIEW v_cart_items_detail AS
SELECT ci.id AS cart_item_id,
       ci.cart_id,
       ci.variant_id,
       ci.quantity,
       pv.size,
       pv.color,
       p.id AS product_id,
       p.name AS product_name,
       pr.amount AS unit_price,
       pr.amount * ci.quantity::numeric AS line_total,
       p.image_url
FROM cart_items ci
    JOIN product_variants pv ON pv.id::text = ci.variant_id::text
    JOIN products p ON p.id::text = pv.product_id::text
    LEFT JOIN prices pr ON pr.product_id::text = p.id::text AND pr.is_active = true;
