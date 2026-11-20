<?php

// The familiar shape of raw SQL that has grown without a plan. Every line works today.

final class ProductRepository
{
    public function __construct(private PDO $pdo) {}

    public function find(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM product WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $row['stock']      = (int)$row['stock'];          // NULL quietly becomes 0
        $row['unit_price'] = (float)$row['unit_price'];   // money as a float

        return $row;                                      // an array, keys typed by hope
    }

    // ...and forty more methods like it, each spelling 'unit_price' by hand.
}
