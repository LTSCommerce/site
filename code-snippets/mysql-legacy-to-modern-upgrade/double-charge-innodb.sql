-- Modern MySQL 8: full transaction support
START TRANSACTION;

-- All operations are atomic
UPDATE customer_accounts
SET balance = balance - 500.00
WHERE customer_id = 1234;

INSERT INTO orders (customer_id, amount, status)
VALUES (1234, 500.00, 'pending');

UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 5678;

-- If ANY step fails, ALL are rolled back
COMMIT;

-- With automatic rollback on errors
DELIMITER $$
CREATE PROCEDURE safe_purchase(
    IN p_customer_id INT,
    IN p_product_id INT,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Purchase failed - no charges made';
    END;

    START TRANSACTION;

    -- All succeed or all fail
    UPDATE customer_accounts
    SET balance = balance - p_amount
    WHERE customer_id = p_customer_id;

    INSERT INTO orders (customer_id, amount, status)
    VALUES (p_customer_id, p_amount, 'pending');

    UPDATE inventory
    SET quantity = quantity - 1
    WHERE product_id = p_product_id;

    COMMIT;
END$$
DELIMITER ;
