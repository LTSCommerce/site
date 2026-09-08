<?php
declare(strict_types=1);

namespace App\QA\PHPStan;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\RuleErrorBuilder;

// Simplified from a production PHPStan rule.
// Detects service classes used in tests but never in production code.
final class ServiceOnlyUsedInTestsRule extends AbstractClassRule
{
    public function processNode(Node $node, Scope $scope): array
    {
        $className = $node->getClassReflection()->getName();
        $shortName = $this->getShortClassName($className);

        // Read every production source file and look for the class
        // being referenced as a dependency anywhere outside itself.
        $usedInProduction = false;
        foreach ($this->productionSourceFiles() as $file) {
            if ($file->getPathname() === $scope->getFile()) {
                continue;
            }
            if (str_contains($file->getContents(), $shortName)) {
                $usedInProduction = true;
                break;
            }
        }

        if (!$usedInProduction && $this->isUsedInTests($className)) {
            return [
                RuleErrorBuilder::message(sprintf(
                    'Service %s is only used in tests, never in production code.',
                    $shortName
                ))
                    ->identifier('app.serviceOnlyUsedInTests')
                    ->build(),
            ];
        }

        return [];
    }
}
