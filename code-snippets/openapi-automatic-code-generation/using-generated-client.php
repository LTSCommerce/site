<?php

declare(strict_types=1);

use App\ApiClient\Configuration;
use App\ApiClient\Api\ProductsApi;
use App\ApiClient\Model\CreateProductRequest;

require_once __DIR__ . '/vendor/autoload.php';

$config = Configuration::getDefaultConfiguration()
    ->setHost('https://api.example.com/v1')
    ->setAccessToken('your-jwt-token-here');

$api = new ProductsApi(config: $config);

// List products - fully typed, auto-completed in your IDE
$products = $api->listProducts(category: 'electronics', limit: 50);

foreach ($products as $product) {
    // $product is a typed Product object, not a raw array
    echo $product->getName() . ': ' . $product->getPrice() . PHP_EOL;
}

// Create a product - the request object enforces the schema
$request = new CreateProductRequest([
    'name' => 'Wireless Mouse',
    'price' => 29.99,
    'category' => 'peripherals',
]);

$created = $api->createProduct($request);
echo 'Created: ' . $created->getId() . PHP_EOL;
