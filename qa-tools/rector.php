<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\LevelSetList;
use Rector\Set\ValueObject\SetList;

return static function (RectorConfig $rectorConfig): void {
    $rectorConfig->paths([
        __DIR__ . '/../code-snippets',
    ]);

    // Define what rule sets will be applied
    $rectorConfig->sets([
        LevelSetList::UP_TO_PHP_81,
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::EARLY_RETURN,
        SetList::TYPE_DECLARATION,
        SetList::PRIVATIZATION,
    ]);

    // Skip some rules that might break example code
    $rectorConfig->skip([
        // Don't rename classes/methods in examples
        'Rector\Naming\Rector\*',
        // Don't remove "unused" code in examples
        'Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPublicMethodRector',
        'Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPrivateMethodRector',
        'Rector\DeadCode\Rector\Property\RemoveUnusedPrivatePropertyRector',
        // Don't change example interfaces
        'Rector\Privatization\Rector\Class_\FinalizeClassesWithoutChildrenRector',
    ]);

    // Import names should be fully qualified 
    $rectorConfig->importNames();
    $rectorConfig->importShortClasses(false);
};