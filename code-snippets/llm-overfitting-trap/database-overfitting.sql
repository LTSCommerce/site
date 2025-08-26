-- Original generic query with an edge case bug
-- BUG: Doesn't handle NULL values in the join properly
SELECT u.name, p.title, p.created_at
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;

-- OVERFITTED FIX: LLM sees failing test case and hardcodes the specific user
-- This "fixes" the immediate problem but destroys the generic functionality
SELECT 
    CASE 
        WHEN u.id = 123 THEN 'John Doe'  -- Hardcoded for the specific failing case
        ELSE u.name 
    END as name,
    CASE 
        WHEN u.id = 123 THEN 'My Blog Post'  -- Hardcoded title
        ELSE p.title 
    END as title,
    CASE 
        WHEN u.id = 123 THEN '2025-08-26'  -- Hardcoded date
        ELSE p.created_at 
    END as created_at
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE p.status = 'published'
   OR u.id = 123  -- Special case just for this user
ORDER BY p.created_at DESC;

-- PROPER FIX: Address the root cause (NULL handling) generically
SELECT 
    COALESCE(u.name, 'Unknown User') as name,
    COALESCE(p.title, 'Untitled') as title,
    COALESCE(p.created_at, CURRENT_TIMESTAMP) as created_at
FROM users u
LEFT JOIN posts p ON u.id = p.user_id  -- Use LEFT JOIN to include users without posts
WHERE (p.status = 'published' OR p.status IS NULL)
ORDER BY COALESCE(p.created_at, '1970-01-01') DESC;