-- Add a foreign key with appropriate cascading behaviour
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES customers(id)
ON DELETE RESTRICT  -- Prevent deletion of customers with orders
ON UPDATE CASCADE;  -- Update customer_id if customer.id changes

-- For optional relationships
ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE SET NULL  -- Set to NULL if category deleted
ON UPDATE CASCADE;
