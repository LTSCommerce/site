<?php
declare(strict_types=1);

namespace App\QA\PHPStan;

use PhpParser\Node;
use PhpParser\Node\Stmt\Catch_;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/** @implements Rule<Catch_> */
final class NoEmptyCatchRule implements Rule
{
    public const IDENTIFIER = 'app.emptyCatchBlock';

    public function getNodeType(): string
    {
        return Catch_::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        assert($node instanceof Catch_);

        if (count($node->stmts) === 0) {
            return [
                RuleErrorBuilder::message('Empty catch block silently swallows exceptions.')
                    ->identifier(self::IDENTIFIER)
                    ->build(),
            ];
        }

        return [];
    }
}
