-- Modern MySQL 8: row-level locking prevents overselling
-- Pessimistic locking: lock the row up front, then branch on it.
-- The branch on a locked value needs a stored program, not bare SQL,
-- so this is wrapped in a procedure rather than run as loose statements.
DELIMITER $$
CREATE PROCEDURE reserve_stock(
    IN p_order_id INT,
    IN p_product_id INT
)
BEGIN
    DECLARE v_quantity INT;

    START TRANSACTION;

    -- Lock the specific row until this transaction completes
    SELECT quantity INTO v_quantity
    FROM inventory
    WHERE product_id = p_product_id
    FOR UPDATE;

    IF v_quantity >= 1 THEN
        UPDATE inventory
        SET quantity = quantity - 1
        WHERE product_id = p_product_id;

        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (p_order_id, p_product_id, 1);

        COMMIT;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product out of stock';
    END IF;
END$$
DELIMITER ;
