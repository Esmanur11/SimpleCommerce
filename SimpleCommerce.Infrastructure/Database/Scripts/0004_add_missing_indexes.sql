-- Adds indexes for hot-path filter columns that were missing.
-- Note: carts.customer_id, favorites(customer_id,product_id), customers.email,
-- users.email, cart_items.cart_id and product_variants.product_id are already
-- covered by existing unique constraints/indexes (leftmost-prefix match) — not repeated here.
-- Run manually against the target Postgres database (no migration runner exists in this repo yet).

CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_prices_product_id_is_active ON prices (product_id, is_active);
