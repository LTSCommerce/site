<?php

declare(strict_types=1);

// Illustrative config, trimmed and sanitised. Check every method and set
// name against the Rector version your project pins before copying it.
// Because this project ships its own config, the harness skips its own
// PHP 8.5 pass, so PHP 8.5 has to be enabled here.

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/src', __DIR__ . '/tests'])
    // Cumulative: includes the PHP 8.4 changes as well
    ->withPhpSets(php85: true)
    // The early return rules are part of codeQuality; the separate
    // earlyReturn flag is deprecated and does nothing.
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        codingStyle: true,
        typeDeclarations: true,
        privatization: true,
        symfonyCodeQuality: true,
    )
    ->withComposerBased(symfony: true)
    // The naming set (naming: true) is deliberately left off: the comment
    // in the real config says it causes countless serious bugs.
    ->withSkip([
        // Every entry gets a written reason. See the skip example.
    ]);
