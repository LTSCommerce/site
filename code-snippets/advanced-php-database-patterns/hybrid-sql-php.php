<?php

class OrderProcessor
{
    public function processHighValueOrders(DatabaseServiceInterface $db): array
    {
        // Step 1: Use SQL for initial filtering and aggregation
        // Let the database do what it does best: filtering and joining
        $sql = '
            SELECT
                o.id,
                o.customer_id,
                o.total,
                c.email,
                c.country,
                c.vip_status
            FROM orders o
            INNER JOIN customers c ON o.customer_id = c.id
            WHERE o.total > 1000
                AND o.status = "pending"
                AND o.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY o.total DESC
        ';

        $orders = $db->query($sql);

        // Step 2: Use PHP for complex business logic
        // Build lookup maps for fast processing
        $vipCustomers = [];
        $countryTaxRates = [];

        foreach ($orders as $order) {
            if ($order['vip_status']) {
                $vipCustomers[$order['customer_id']] = true;
            }

            // Complex tax calculation that would be messy in SQL
            if (!isset($countryTaxRates[$order['country']])) {
                $countryTaxRates[$order['country']] = $this->calculateTaxRate(
                    $order['country'],
                    $order['total']
                );
            }
        }

        // Step 3: Process orders with complex business rules
        $processed = [];
        foreach ($orders as $order) {
            $customerId = $order['customer_id'];

            // Apply VIP discount (complex tiered logic)
            if (isset($vipCustomers[$customerId])) {
                $order['discount'] = $this->calculateVipDiscount($order['total']);
            }

            // Apply country-specific tax
            $order['tax'] = $order['total'] * $countryTaxRates[$order['country']];

            // Check if this triggers any promotional rules
            $order['promotions'] = $this->checkPromotionalRules($order);

            // Calculate final total with all adjustments
            $order['final_total'] = $order['total']
                - ($order['discount'] ?? 0)
                + $order['tax'];

            $processed[] = $order;
        }

        return $processed;
    }

    private function calculateTaxRate(string $country, float $amount): float
    {
        // Complex tax logic with thresholds, exemptions, etc.
        // Much cleaner in PHP than trying to express in SQL
        return match($country) {
            'US' => $amount > 5000 ? 0.08 : 0.06,
            'UK' => 0.20,
            'DE' => 0.19,
            default => 0.0,
        };
    }

    private function calculateVipDiscount(float $total): float
    {
        // Tiered discount structure
        return match(true) {
            $total >= 10000 => $total * 0.15,
            $total >= 5000 => $total * 0.10,
            $total >= 2000 => $total * 0.05,
            default => 0.0,
        };
    }

    private function checkPromotionalRules(array $order): array
    {
        // Complex promotional logic that would be nightmare in SQL
        $promotions = [];

        if ($order['total'] > 5000 && $order['country'] === 'US') {
            $promotions[] = 'FREE_SHIPPING';
        }

        if (isset($order['vip_status']) && date('w') === '5') {
            $promotions[] = 'FRIDAY_VIP_BONUS';
        }

        return $promotions;
    }
}
