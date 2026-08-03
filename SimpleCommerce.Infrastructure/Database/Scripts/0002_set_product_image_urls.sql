-- Populates image_url for existing products once photos are placed in
-- simplecommerce-frontend/public/images/products/{ProductId}.jpg
-- Not run automatically — run manually (or ask Claude to run it) after the photo files exist.

UPDATE products SET image_url = '/images/products/PROD-001.jpg' WHERE id = 'PROD-001';
UPDATE products SET image_url = '/images/products/PROD-002.jpg' WHERE id = 'PROD-002';
UPDATE products SET image_url = '/images/products/PROD-003.jpg' WHERE id = 'PROD-003';
UPDATE products SET image_url = '/images/products/PROD-004.jpg' WHERE id = 'PROD-004';
UPDATE products SET image_url = '/images/products/PROD-005.jpg' WHERE id = 'PROD-005';
UPDATE products SET image_url = '/images/products/PROD-006.jpg' WHERE id = 'PROD-006';
UPDATE products SET image_url = '/images/products/PROD-007.jpg' WHERE id = 'PROD-007';
