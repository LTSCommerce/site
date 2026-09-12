-- Modern MySQL 8: check constraints enforce business rules
ALTER TABLE products
ADD CONSTRAINT chk_positive_price
CHECK (price >= 0),
ADD CONSTRAINT chk_price_range
CHECK (price <= 999999.99);

ALTER TABLE promotions
ADD CONSTRAINT chk_valid_discount
CHECK (discount_percent BETWEEN 0 AND 100);

ALTER TABLE appointments
ADD CONSTRAINT chk_future_appointment
CHECK (appointment_date >= CURDATE());

-- Invalid operations now fail immediately
UPDATE products SET price = -99.99 WHERE product_id = 100;
-- ERROR 3819: Check constraint 'chk_positive_price' is violated

INSERT INTO promotions (code, discount_percent) VALUES ('MEGA', 150);
-- ERROR 3819: Check constraint 'chk_valid_discount' is violated

-- Complex business rules
ALTER TABLE orders
ADD CONSTRAINT chk_order_logic CHECK (
    (status = 'cancelled' AND cancelled_at IS NOT NULL) OR
    (status != 'cancelled' AND cancelled_at IS NULL)
);
