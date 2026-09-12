<?php
declare(strict_types=1);

// Each guard clause becomes a test case
public function testProcessOrderFailsWithMissingOrderId(): void
{
    $this->expectException(InvalidArgumentException::class);
    $this->expectExceptionMessage('Order must have a valid ID');

    $this->processor->processOrder(['user_id' => 123]);
}

public function testProcessOrderFailsWithInsufficientPermissions(): void
{
    $this->expectException(InsufficientPermissionsException::class);
    $this->expectExceptionMessage('lacks required permission: order_process');

    $orderData = ['id' => 'ORDER-123', 'user_id' => 456, 'item_id' => 'ITEM-789', 'quantity' => 1];
    $this->processor->processOrder($orderData);
}
