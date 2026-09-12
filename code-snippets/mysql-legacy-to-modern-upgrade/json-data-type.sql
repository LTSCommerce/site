-- Create table with JSON column
ALTER TABLE products ADD COLUMN attributes JSON;

-- Store structured data
UPDATE products
SET attributes = JSON_OBJECT(
    'color', 'red',
    'size', 'large',
    'features', JSON_ARRAY('waterproof', 'lightweight')
);

-- Query JSON data
SELECT product_name
FROM products
WHERE JSON_EXTRACT(attributes, '$.color') = 'red';
