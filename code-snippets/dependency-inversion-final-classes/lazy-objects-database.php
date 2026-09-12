<?php

$reflector = new ReflectionClass(MySqlDatabase::class);

$lazyDatabase = $reflector->newLazyGhost(function (MySqlDatabase $database) use ($config) {
    $database->__construct(
        $config['database']['host'],
        $config['database']['name']
    );
});

// The constructor above only runs the first time $lazyDatabase is actually used
$processor = new OrderProcessor($validator, $taxCalculator, $lazyDatabase);
