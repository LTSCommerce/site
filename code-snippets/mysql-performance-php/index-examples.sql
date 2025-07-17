-- Compound indexes for complex WHERE clauses
CREATE INDEX idx_user_orders ON orders (user_id, status, created_at);

-- Covering indexes to avoid table lookups
CREATE INDEX idx_product_details ON products (category_id, status, price, name);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users ON users (email) WHERE status = 'active';

-- Functional indexes for computed columns
CREATE INDEX idx_user_full_name ON users ((CONCAT(first_name, ' ', last_name)));

-- JSON indexes for JSON column queries
CREATE INDEX idx_user_preferences ON users ((JSON_EXTRACT(preferences, '$.language')));