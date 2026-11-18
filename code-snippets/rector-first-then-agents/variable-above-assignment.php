<?php

declare(strict_types=1);

// Dummy example of the shape of the damage a constructor-argument rule did
// to test files. Before:
final class ExampleControllerTest extends TestCase
{
    public function testHandlesRequest(): void
    {
        $request = new Request();
        $stack   = new RequestStack();
        $stack->push($request);

        $controller = new ExampleController($stack);

        self::assertSame(200, $controller->handle()->getStatusCode());
    }
}

// After the rewrite, the usage moved above the line that assigns it. A
// later dead-code rule then deleted the assignment as "unused", so the
// file was left with a variable that never exists:
final class ExampleControllerTestBroken extends TestCase
{
    public function testHandlesRequest(): void
    {
        $controller = new ExampleController($stack);

        self::assertSame(200, $controller->handle()->getStatusCode());
    }
}

// PHPStan reported "Undefined variable: $stack" for every one of these.
