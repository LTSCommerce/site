<?php

declare(strict_types=1);

// Slow: multiple aggregations in separate queries
$totalOrders = $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$totalRevenue = $pdo->query('SELECT SUM(total) FROM orders')->fetchColumn();
$avgOrderValue = $pdo->query('SELECT AVG(total) FROM orders')->fetchColumn();

// Fast: single query with multiple aggregations
$sql = 'SELECT
    COUNT(*) as total_orders,
    SUM(total) as total_revenue,
    AVG(total) as avg_order_value
FROM orders';

$stats = $pdo->query($sql)->fetch();
