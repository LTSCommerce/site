<?php

declare(strict_types=1);

// Illustrative config. Check the rule class against your pinned Rector version.

use Rector\CodeQuality\Rector\If_\ExplicitNullableObjectInstanceRector;
use Rector\Config\RectorConfig;

// The house rule: never skip individual files. Disable the rule globally
// and write down why, next to the line that disables it.

return RectorConfig::configure()
    ->withSkip([
        // Rewrites explicit "null !== $x" checks back into instanceof.
        // A custom PHPStan rule in this project wants the explicit null
        // comparison, so the two tools disagree. Disabled globally.
        ExplicitNullableObjectInstanceRector::class,

        // WRONG: this is the pattern we do not allow.
        // ExplicitNullableObjectInstanceRector::class => [
        //     __DIR__ . '/src/Example/SampleBuilder.php',
        // ],
    ]);
