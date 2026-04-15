<?php

declare(strict_types=1);

namespace App\Logging;

use App\Exception\AppExceptionInterface;
use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Monolog processor — enriches every log record that carries an
 * AppExceptionInterface with its typed properties.
 *
 * Because exceptions carry data as real properties (not inside message
 * strings), we can reflect them out here and every exception log entry
 * gets structured, queryable context for free.
 */
final class AppExceptionProcessor implements ProcessorInterface
{
    public function __invoke(LogRecord $record): LogRecord
    {
        $exception = $record->context['exception'] ?? null;
        if (!$exception instanceof AppExceptionInterface) {
            return $record;
        }

        $properties = [];
        foreach ((new \ReflectionObject($exception))->getProperties() as $property) {
            // Skip Exception base properties — monolog's own formatter covers those.
            if ($property->getDeclaringClass()->getName() === \Exception::class) {
                continue;
            }
            $properties[$property->getName()] = $property->getValue($exception);
        }

        $record->extra['app_exception'] = [
            'class'      => $exception::class,
            'properties' => $properties,
            'chain'      => self::walkChain($exception),
        ];

        return $record;
    }

    /** @return list<array{class: class-string, message: string}> */
    private static function walkChain(\Throwable $e): array
    {
        $chain = [];
        for ($current = $e; $current !== null; $current = $current->getPrevious()) {
            $chain[] = ['class' => $current::class, 'message' => $current->getMessage()];
        }
        return $chain;
    }
}
