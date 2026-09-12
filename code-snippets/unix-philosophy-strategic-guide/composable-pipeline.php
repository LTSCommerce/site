<?php

declare(strict_types=1);

namespace App\Pipeline;

/**
 * Every step shares the same shape: a string in, a string (or an
 * exception) out. That's what lets steps compose in any order without
 * knowing anything about their neighbours - the same idea as piping
 * one shell command's output into the next.
 */
interface PipelineStep
{
    public function __invoke(string $input): string;
}

final class TrimWhitespace implements PipelineStep
{
    public function __invoke(string $input): string
    {
        return trim($input);
    }
}

final class RejectEmpty implements PipelineStep
{
    public function __invoke(string $input): string
    {
        if ($input === '') {
            throw new \InvalidArgumentException('Input is empty after trimming');
        }

        return $input;
    }
}

final class LowercaseWords implements PipelineStep
{
    public function __invoke(string $input): string
    {
        return mb_strtolower($input);
    }
}

final class Pipeline
{
    /** @var list<PipelineStep> */
    private array $steps;

    public function __construct(PipelineStep ...$steps)
    {
        $this->steps = $steps;
    }

    public function process(string $input): string
    {
        return array_reduce(
            $this->steps,
            static fn (string $carry, PipelineStep $step): string => $step($carry),
            $input,
        );
    }
}

$pipeline = new Pipeline(new TrimWhitespace(), new RejectEmpty(), new LowercaseWords());

echo $pipeline->process('  Hello World  '); // "hello world"
