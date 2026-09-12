<?php

declare(strict_types=1);

namespace App\Tests\PHPStan\Rules;

use App\PHPStan\Rules\Performance\QueryInLoopRule;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * @extends RuleTestCase<QueryInLoopRule>
 */
final class QueryInLoopRuleTest extends RuleTestCase
{
    protected function getRule(): Rule
    {
        return new QueryInLoopRule();
    }

    public function testRule(): void
    {
        $this->analyse(
            [__DIR__ . '/data/query-in-loop.php'],
            [
                [
                    'Query instantiation detected inside a loop.',
                    15, // Line number
                ],
            ]
        );
    }

    public function testNoErrorsWhenQueryOutsideLoop(): void
    {
        $this->analyse(
            [__DIR__ . '/data/query-outside-loop.php'],
            [] // No errors expected
        );
    }
}
