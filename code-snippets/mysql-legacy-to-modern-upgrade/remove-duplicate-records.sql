-- Keep the oldest record, delete duplicates
DELETE t1 FROM users t1
INNER JOIN users t2
WHERE t1.email = t2.email
    AND t1.id > t2.id;
