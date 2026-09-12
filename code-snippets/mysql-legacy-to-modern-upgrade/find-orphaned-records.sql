-- Find child records without a valid parent
SELECT child.id, child.parent_id
FROM child_table child
LEFT JOIN parent_table parent ON child.parent_id = parent.id
WHERE parent.id IS NULL
    AND child.parent_id IS NOT NULL;
