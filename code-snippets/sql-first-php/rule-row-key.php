<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/phpstan/Rules/RowKeyMustNotBeLiteralRule.php#L74-L98
// Trimmed from phpstan/Rules/RowKeyMustNotBeLiteralRule.php

/** @implements Rule<MethodCall> */
final readonly class RowKeyMustNotBeLiteralRule implements Rule
{
    // ...

    public function processNode(Node $node, Scope $scope): array
    {
        // A method call named like a Row getter...
        if (!$node->name instanceof Identifier || !\in_array($node->name->toString(), self::GETTERS, true)) {
            return [];
        }

        // ...whose first argument is a string literal written right here...
        $key = $node->getArgs()[0]->value ?? null;
        if (!$key instanceof String_) {
            return [];
        }

        // ...on something PHPStan can prove is a Row.
        if (!new ObjectType(Row::class)->isSuperTypeOf($scope->getType($node->var))->yes()) {
            return [];
        }

        if (\in_array($scope->getClassReflection()?->getName(), $this->exemptClasses, true)) {
            return [];
        }

        return [
            RuleErrorBuilder::message(self::message($node->name->toString(), $key->value))
                ->identifier(self::IDENTIFIER)
                ->build(),
        ];
    }
}
