-- Optimistic locking with version numbers
ALTER TABLE inventory ADD COLUMN version INT DEFAULT 0;

UPDATE inventory
SET quantity = quantity - 1,
    version = version + 1
WHERE product_id = 999
    AND quantity >= 1
    AND version = @expected_version;

-- In application code, check ROW_COUNT(): zero means either the
-- stock ran out or another transaction updated the row first - retry
-- the read-and-update cycle rather than assuming the purchase succeeded
