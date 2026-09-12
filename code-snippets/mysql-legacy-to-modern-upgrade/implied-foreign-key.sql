-- Legacy: implied relationship through column naming
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,  -- No actual constraint
    INDEX idx_customer (customer_id)
) ENGINE=MyISAM;

-- Modern: explicit foreign key constraint
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
