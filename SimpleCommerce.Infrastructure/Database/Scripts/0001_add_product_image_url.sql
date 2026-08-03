-- Adds a nullable image_url column to products and exposes it through v_product_catalog.
-- Run manually against the target Postgres database (no migration runner exists in this repo yet).

ALTER TABLE products ADD COLUMN image_url VARCHAR(500);

CREATE OR REPLACE VIEW v_product_catalog AS
SELECT p.id,
       p.name,
       p.description,
       pr.amount AS price,
       p.category_id,
       c.name AS category_name,
       p.is_active,
       COALESCE(sum(pv.stock_quantity), 0::bigint) AS stock_quantity,
       p.image_url
FROM products p
    LEFT JOIN categories c ON p.category_id::text = c.id::text
    LEFT JOIN prices pr ON pr.product_id::text = p.id::text AND pr.is_active = true
    LEFT JOIN product_variants pv ON pv.product_id::text = p.id::text
GROUP BY p.id, p.name, p.description, pr.amount, p.category_id, c.name, p.is_active, p.image_url;
