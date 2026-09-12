-- Delete orphaned child records
DELETE child FROM child_table child
LEFT JOIN parent_table parent ON child.parent_id = parent.id
WHERE parent.id IS NULL
    AND child.parent_id IS NOT NULL;

-- Or set to NULL if the relationship is optional
UPDATE child_table child
LEFT JOIN parent_table parent ON child.parent_id = parent.id
SET child.parent_id = NULL
WHERE parent.id IS NULL
    AND child.parent_id IS NOT NULL;
