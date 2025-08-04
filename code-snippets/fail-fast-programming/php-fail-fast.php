<?php
declare(strict_types=1);

// FAIL-FAST APPROACH: Explicit validation and clear error propagation
class FailFastOrderProcessor 
{
    public function processOrder(?array $orderData): array
    {
        // Guard clause: Validate order data exists and is properly structured
        if ($orderData === null) {
            throw new InvalidArgumentException('Order data cannot be null');
        }
        
        if (!isset($orderData['id']) || empty($orderData['id'])) {
            throw new InvalidArgumentException('Order must have a valid ID');
        }
        
        if (!isset($orderData['user_id']) || !is_int($orderData['user_id']) || $orderData['user_id'] <= 0) {
            throw new InvalidArgumentException('Order must have a valid user_id');
        }
        
        if (!isset($orderData['item_id']) || empty($orderData['item_id'])) {
            throw new InvalidArgumentException('Order must specify a valid item_id');
        }
        
        if (!isset($orderData['quantity']) || !is_int($orderData['quantity']) || $orderData['quantity'] <= 0) {
            throw new InvalidArgumentException('Order quantity must be a positive integer');
        }
        
        // All basic validation passed - extract the validated data
        $orderId = $orderData['id'];
        $userId = $orderData['user_id'];
        $itemId = $orderData['item_id'];
        $quantity = $orderData['quantity'];
        
        // Guard clause: Validate user exists and has permissions
        $user = $this->getUserOrFail($userId);
        $this->validateUserPermissions($user, 'order_process');
        
        // Guard clause: Validate item exists and has sufficient stock
        $item = $this->getInventoryItemOrFail($itemId);
        $this->validateSufficientStock($item, $quantity, $itemId);
        
        // All validations passed - perform the actual business logic
        // This code only runs when everything is guaranteed valid
        return [
            'status' => 'success',
            'processed' => true,
            'order_id' => $orderId,
            'item_id' => $itemId,
            'quantity_processed' => $quantity,
            'remaining_stock' => $item['quantity'] - $quantity
        ];
    }
    
    /**
     * Get user or fail fast with specific error details
     * @throws UserNotFoundException when user doesn't exist
     * @throws DatabaseException when database operation fails
     */
    private function getUserOrFail(int $userId): array
    {
        try {
            $result = $this->database->query('SELECT * FROM users WHERE id = ?', [$userId]);
            $user = $result->fetch();
            
            if ($user === false) {
                throw new UserNotFoundException("User with ID {$userId} not found");
            }
            
            return $user;
        } catch (PDOException $e) {
            throw new DatabaseException("Failed to fetch user {$userId}: " . $e->getMessage(), 0, $e);
        }
    }
    
    /**
     * Validate user has required permissions or fail fast
     * @throws InsufficientPermissionsException when user lacks required permission
     */
    private function validateUserPermissions(array $user, string $requiredPermission): void
    {
        $permissions = $user['permissions'] ?? [];
        
        if (!is_array($permissions)) {
            throw new InsufficientPermissionsException(
                "User {$user['id']} has invalid permissions data structure"
            );
        }
        
        if (!in_array($requiredPermission, $permissions, true)) {
            throw new InsufficientPermissionsException(
                "User {$user['id']} lacks required permission: {$requiredPermission}"
            );
        }
    }
    
    /**
     * Get inventory item or fail fast with specific error details
     * @throws ItemNotFoundException when item doesn't exist
     * @throws DatabaseException when database operation fails
     */
    private function getInventoryItemOrFail(string $itemId): array
    {
        try {
            $result = $this->database->query('SELECT * FROM inventory WHERE item_id = ?', [$itemId]);
            $item = $result->fetch();
            
            if ($item === false) {
                throw new ItemNotFoundException("Item '{$itemId}' not found in inventory");
            }
            
            return $item;
        } catch (PDOException $e) {
            throw new DatabaseException("Failed to fetch item {$itemId}: " . $e->getMessage(), 0, $e);
        }
    }
    
    /**
     * Validate sufficient stock or fail fast with specific details
     * @throws InsufficientStockException when not enough items available
     */
    private function validateSufficientStock(array $item, int $requestedQuantity, string $itemId): void
    {
        $availableQuantity = $item['quantity'] ?? 0;
        
        if ($availableQuantity < $requestedQuantity) {
            throw new InsufficientStockException(
                "Insufficient stock for item '{$itemId}': " .
                "requested {$requestedQuantity}, available {$availableQuantity}"
            );
        }
    }
}

// Custom exceptions for specific failure scenarios
class UserNotFoundException extends Exception {}
class ItemNotFoundException extends Exception {}
class InsufficientPermissionsException extends Exception {}
class InsufficientStockException extends Exception {}
class DatabaseException extends Exception {}