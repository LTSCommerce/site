-- Convert single table - always a full table copy, never in-place
ALTER TABLE table_name ENGINE=InnoDB;

-- Explicit about the algorithm and lock; still a full copy under the hood
ALTER TABLE table_name ENGINE=InnoDB, ALGORITHM=COPY, LOCK=SHARED;
