-- Add check constraints
ALTER TABLE products
ADD CONSTRAINT chk_positive_price CHECK (price > 0),
ADD CONSTRAINT chk_valid_status CHECK (status IN ('active', 'inactive', 'discontinued'));

ALTER TABLE orders
ADD CONSTRAINT chk_valid_dates CHECK (ship_date >= order_date);
