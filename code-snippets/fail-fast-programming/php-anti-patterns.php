<?php
declare(strict_types=1);

// ANTI-PATTERN: Error hiding with null coalescence and silent failures
class OrderProcessor 
{
    public function processOrder(?array $orderData): array
    {
        // Anti-pattern: Hide missing data with null coalescence
        $orderId = $orderData['id'] ?? null;
        $userId = $orderData['user_id'] ?? 0;  // 0 as fallback hides the problem
        $itemId = $orderData['item_id'] ?? '';  // Empty string as fallback
        $quantity = $orderData['quantity'] ?? 1;  // Assumes quantity if missing
        
        // Anti-pattern: Using if/else to limp forward instead of failing
        if ($orderId) {
            $user = $this->getUser($userId);  // Might return null silently
            if ($user) {
                $permissions = $user['permissions'] ?? [];
                if (in_array('order_process', $permissions, true)) {
                    $item = $this->getInventoryItem($itemId);  // Might return null
                    if ($item) {
                        $availableQty = $item['quantity'] ?? 0;
                        if ($availableQty >= $quantity) {
                            // Finally do the work, buried deep in nested conditions
                            return ['status' => 'success', 'processed' => true];
                        } else {
                            // Anti-pattern: Vague error message
                            return ['status' => 'error', 'message' => 'Not enough stock'];
                        }
                    } else {
                        return ['status' => 'error', 'message' => 'Item not found'];
                    }
                } else {
                    return ['status' => 'error', 'message' => 'Permission denied'];
                }
            } else {
                return ['status' => 'error', 'message' => 'User not found'];
            }
        } else {
            return ['status' => 'error', 'message' => 'Invalid order'];
        }
    }
    
    // Anti-pattern: Methods that hide failures by returning null instead of throwing
    private function getUser(int $userId): ?array
    {
        try {
            $result = $this->database->query('SELECT * FROM users WHERE id = ?', [$userId]);
            return $result->fetch() ?: null;  // Hides whether it's missing or DB failed
        } catch (Exception $e) {
            error_log($e->getMessage());  // Log and hide the error
            return null;  // Caller has no idea what went wrong
        }
    }
    
    private function getInventoryItem(string $itemId): ?array
    {
        if (empty($itemId)) {
            return null;  // Silent failure for empty string
        }
        
        try {
            $result = $this->database->query('SELECT * FROM inventory WHERE item_id = ?', [$itemId]);
            return $result->fetch() ?: null;
        } catch (Exception $e) {
            // Anti-pattern: Try-catch that swallows all exceptions
            return null;  // Database errors become "item not found"
        }
    }
}