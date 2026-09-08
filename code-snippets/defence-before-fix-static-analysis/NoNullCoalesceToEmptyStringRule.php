<?php
declare(strict_types=1);

namespace App\QA\PHPStan;

use PhpParser\Node;
use PhpParser\Node\Expr\BinaryOp\Coalesce;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Bans null coalescing to the empty string: $value ?? ''
 *
 * The pattern hides bugs by converting missing data into empty data.
 * Handle null explicitly so that the bug surfaces at its source.
 *
 * @implements Rule<Coalesce>
 */
final class NoNullCoalesceToEmptyStringRule implements Rule
{
    // The identifier is stable, so the docs can be found from it
    // long after the class has been renamed.
    public const IDENTIFIER = 'app.nullCoalescingEmptyString';

    public function getNodeType(): string
    {
        return Coalesce::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        assert($node instanceof Coalesce);

        if (
            $node->right instanceof Node\Scalar\String_
            && $node->right->value === ''
        ) {
            return [
                RuleErrorBuilder::message("Null coalescing to empty string (?? '') hides missing data.")
                    ->identifier(self::IDENTIFIER)
                    ->tip('See docs/rules/null-coalescing-empty-string.md for the correct construction.')
                    ->build(),
            ];
        }

        return [];
    }
}
