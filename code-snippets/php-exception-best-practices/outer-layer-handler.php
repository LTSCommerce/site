<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Exception\AppExceptionInterface;
use App\Exception\UserFacingExceptionInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Attribute\AsEventListener;

/**
 * The ONLY place a generic `catch \Throwable` / `RuntimeException` is OK.
 *
 * By the time an exception reaches here, everything below has had its
 * chance to recover or translate. This listener decides what the user
 * sees and what gets logged — nothing in the middle of the stack may
 * catch `\Throwable`, `\Exception`, or `\RuntimeException` generically.
 */
#[AsEventListener]
final class KernelExceptionListener
{
    public function __construct(
        private readonly LoggerInterface $exceptionLogger, // monolog channel: exception
    ) {}

    public function __invoke(ExceptionEvent $event): void
    {
        $throwable = $event->getThrowable();

        // Always log — never swallow at the top either.
        $this->exceptionLogger->error($throwable->getMessage(), [
            'exception' => $throwable, // Monolog's built-in exception formatter
                                       // walks the whole previous chain.
        ]);

        $event->setResponse(match (true) {
            $throwable instanceof UserFacingExceptionInterface => new JsonResponse(
                ['error' => $throwable::class, 'message' => $throwable->getMessage()],
                status: 400,
            ),
            $throwable instanceof AppExceptionInterface => new JsonResponse(
                ['error' => 'application_error'],
                status: 500,
            ),
            // Truly unexpected — a bare \RuntimeException, \Error, etc.
            // The user gets a generic message. The full trace is in the log.
            default => new JsonResponse(
                ['error' => 'something_went_wrong'],
                status: 500,
            ),
        });
    }
}
