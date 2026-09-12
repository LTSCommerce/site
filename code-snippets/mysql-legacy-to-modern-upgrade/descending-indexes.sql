-- Create a descending index for queries that sort DESC
CREATE INDEX idx_created_desc ON posts(created_at DESC);

-- This query now uses the index efficiently
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;
