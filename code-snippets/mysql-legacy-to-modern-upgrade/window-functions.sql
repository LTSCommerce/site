-- Running total (impossible in MySQL 4-5 without variables)
SELECT
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) as running_total
FROM orders;

-- Ranking within groups
SELECT
    category_id,
    product_name,
    price,
    RANK() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank
FROM products;
