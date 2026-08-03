-- Adds fixed, pre-seeded discount coupons and wires them into orders.
-- Coupons are not created via the API; the 3 rows below are the only ones that exist.
-- Run manually against the target Postgres database (no migration runner exists in this repo yet).

CREATE TABLE IF NOT EXISTS coupons (
    id               VARCHAR(30) PRIMARY KEY,
    code             VARCHAR(30) NOT NULL UNIQUE,
    min_cart_amount  NUMERIC(10, 2) NOT NULL,
    discount_amount  NUMERIC(10, 2) NOT NULL,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO coupons (id, code, min_cart_amount, discount_amount, is_active)
VALUES
    ('COUPON-INDIRIM200', 'INDIRIM200', 2000, 200, TRUE),
    ('COUPON-INDIRIM400', 'INDIRIM400', 3000, 400, TRUE),
    ('COUPON-INDIRIM800', 'INDIRIM800', 5000, 800, TRUE)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(30),
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;

CREATE OR REPLACE VIEW v_order_summary AS
SELECT o.id AS order_id,
       o.customer_id,
       c.first_name || ' ' || c.last_name AS customer_name,
       o.total_price,
       o.status,
       o.created_at,
       sp.name AS shipping_provider_name,
       o.shipping_city,
       o.shipping_district,
       o.coupon_code,
       o.discount_amount
FROM orders o
JOIN customers c ON c.id = o.customer_id
LEFT JOIN shipping_providers sp ON sp.id = o.shipping_provider_id;
