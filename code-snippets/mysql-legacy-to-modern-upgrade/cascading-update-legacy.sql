-- Legacy: manual updates across tables
-- Company merger requires updating customer IDs

-- Update primary customer record
UPDATE customers SET customer_id = 9000 WHERE customer_id = 1000;

-- Must manually update every related table (error-prone)
UPDATE orders SET customer_id = 9000 WHERE customer_id = 1000;
UPDATE invoices SET customer_id = 9000 WHERE customer_id = 1000;
UPDATE support_tickets SET customer_id = 9000 WHERE customer_id = 1000;
-- Forgot customer_addresses table! Addresses now orphaned

-- Months later: customer can't access their addresses
-- Support confused: "Your addresses disappeared after the merger"
