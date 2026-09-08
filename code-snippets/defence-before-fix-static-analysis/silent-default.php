<?php
// Anti-pattern: converts a bug into empty data
$customerName = $order->getCustomer()->getName() ?? '';
$emailBody = "Dear {$customerName},\n\nYour order has shipped.";

// When getName() returns null because of a bug:
// "Dear ,\n\nYour order has shipped."
// The email sends, the test passes, and the customer is confused.
