-- Slow: Using OR conditions
SELECT * FROM products 
WHERE category_id = 1 OR category_id = 2 OR category_id = 3;

-- Fast: Using IN clause
SELECT * FROM products 
WHERE category_id IN (1, 2, 3);

-- Slow: Using NOT IN with NULL values
SELECT * FROM users 
WHERE id NOT IN (SELECT user_id FROM banned_users);

-- Fast: Using LEFT JOIN
SELECT u.* FROM users u
LEFT JOIN banned_users b ON u.id = b.user_id
WHERE b.user_id IS NULL;

-- Slow: Using OFFSET for pagination
SELECT * FROM products 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 10000;

-- Fast: Using cursor-based pagination
SELECT * FROM products 
WHERE created_at < '2024-01-01 12:00:00'
ORDER BY created_at DESC 
LIMIT 20;