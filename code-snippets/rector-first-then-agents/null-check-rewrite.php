<?php

declare(strict_types=1);

// Dummy example. Before: what the author wrote, deliberately.
final class ExampleLookup
{
    public function describe(?ExampleThing $thing): string
    {
        if (null !== $thing) {
            return $thing->label();
        }

        return 'none';
    }
}

// After an over-eager Rector rule: semantically similar today, but it
// reintroduces the instanceof form that the project's custom PHPStan rule
// forbids. Nineteen findings in one run came from this single rewrite.
final class ExampleLookupRewritten
{
    public function describe(?ExampleThing $thing): string
    {
        if ($thing instanceof ExampleThing) {
            return $thing->label();
        }

        return 'none';
    }
}
