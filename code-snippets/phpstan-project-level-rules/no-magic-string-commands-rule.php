<?php

declare(strict_types=1);

namespace App\PHPStan\Rules\CodeQuality;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;
use PHPStan\Type\ObjectType;

/**
 * Enforces using constants instead of magic strings for command names.
 *
 * Magic strings make refactoring difficult and prone to typos. This rule
 * ensures command names are defined as class constants.
 *
 * Example violation:
 * $this->executeCommand('user:activate');  // Magic string
 *
 * Correct approach:
 * $this->executeCommand(Commands::USER_ACTIVATE);  // Type-safe constant
 *
 * @implements Rule<Node\Expr\MethodCall>
 */
final class NoMagicStringCommandsRule implements Rule
{
    private const COMMAND_METHODS = [
        'executeCommand',
        'queueCommand',
        'dispatchCommand',
    ];

    public function getNodeType(): string
    {
        return Node\Expr\MethodCall::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (!$node instanceof Node\Expr\MethodCall) {
            return [];
        }

        // Check if this is a command execution method
        if (!$node->name instanceof Node\Identifier) {
            return [];
        }

        $methodName = $node->name->toString();
        if (!in_array($methodName, self::COMMAND_METHODS, true)) {
            return [];
        }

        // Check if first argument is a string literal
        if (count($node->getArgs()) === 0) {
            return [];
        }

        $firstArg = $node->getArgs()[0]->value;

        // If it's a string literal, that's a violation
        if ($firstArg instanceof Node\Scalar\String_) {
            $commandName = $firstArg->value;

            return [
                RuleErrorBuilder::message(
                    sprintf(
                        'Magic string "%s" used for command name. ' .
                        'Use a class constant from the Commands class instead.',
                        $commandName
                    )
                )
                ->identifier('app.magicStringCommand')
                ->line($node->getStartLine())
                ->tip(
                    sprintf(
                        'Replace with: %s(Commands::YOUR_COMMAND)' . PHP_EOL .
                        'Define constants in: src/Commands.php' . PHP_EOL .
                        'Benefits: Type safety, IDE autocomplete, refactoring support',
                        $methodName
                    )
                )
                ->build()
            ];
        }

        return [];
    }
}
