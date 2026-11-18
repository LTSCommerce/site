<?php

declare(strict_types=1);

// Dummy examples of Safe-function rewrites. Illustrative: check the
// function signatures in the Safe version you have installed.

// 1. hrtime. Before the rewrite, PHPStan understands the subtraction.
$start = hrtime(true);
$elapsed = hrtime(true) - $start;

// After the Safe rewrite the declared return type is array|int|float,
// so PHPStan reports an invalid binary operation on the subtraction.
use function Safe\hrtime;

$start = hrtime(true);
$elapsed = hrtime(true) - $start;

// The fix that was applied: use microtime(true), which returns a float.
$start = microtime(true);
$elapsed = microtime(true) - $start;

// 2. A test assertion made tautological.
// Before:
$contents = file_get_contents($fixturePath);
self::assertIsString($contents);

// After the rewrite, the Safe version throws instead of returning false,
// so the assertion can no longer fail and was removed.
$contents = \Safe\file_get_contents($fixturePath);
