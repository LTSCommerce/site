-- Legacy MySQL: no check constraints
-- Bug in application sets negative prices
UPDATE products SET price = -99.99 WHERE product_id = 100;
-- SUCCESS - database accepts negative price!

-- Promotional code sets discount over 100%
INSERT INTO promotions (code, discount_percent)
VALUES ('MEGA_SALE', 150);
-- SUCCESS - 150% discount means we pay customers!

-- Date logic error books appointment in the past
INSERT INTO appointments (customer_id, appointment_date)
VALUES (123, '2020-01-01');
-- SUCCESS - appointment scheduled 5 years ago!

-- Financial losses accumulate before detection
-- Customer gets paid nearly $100 to take the product!
