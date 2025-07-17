-- Slow: Multiple aggregations in separate queries
$totalOrders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$totalRevenue = $pdo->query("SELECT SUM(total) FROM orders")->fetchColumn();
$avgOrderValue = $pdo->query("SELECT AVG(total) FROM orders")->fetchColumn();

-- Fast: Single query with multiple aggregations
$sql = "SELECT 
    COUNT(*) as total_orders,
    SUM(total) as total_revenue,
    AVG(total) as avg_order_value
FROM orders";

$stats = $pdo->query($sql)->fetch();

-- Optimized aggregation with filtering
SELECT 
    DATE(created_at) as date,
    COUNT(*) as order_count,
    SUM(total) as revenue,
    AVG(total) as avg_value
FROM orders 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;