-- Make an index invisible to test its performance impact
ALTER TABLE orders ALTER INDEX idx_customer_id INVISIBLE;

-- Check whether queries still perform well
-- If yes, drop the index; if no, make it visible again
ALTER TABLE orders ALTER INDEX idx_customer_id VISIBLE;
