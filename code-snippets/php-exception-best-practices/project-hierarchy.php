<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Root marker interface for every exception this project throws itself.
 *
 * Anything that implements this is *expected* — it describes a known
 * failure mode the code has reasoned about. A bare \RuntimeException or
 * \Exception reaching the outer handler means we hit something we did not
 * anticipate and should add a proper exception class for.
 */
interface AppExceptionInterface extends \Throwable {}

/** Anything the user caused (bad input, forbidden action). */
interface UserFacingExceptionInterface extends AppExceptionInterface {}

/** Anything worth retrying automatically (transient). */
interface RetryableExceptionInterface extends AppExceptionInterface {}

/** Security-relevant — always logged to the security channel. */
interface SecurityExceptionInterface extends AppExceptionInterface {}

/**
 * Base class for domain-meaningful failures.
 * Extends \RuntimeException because these are "expected at runtime but
 * still an error", and they should surface with context, not get caught
 * by a generic handler in the middle of the stack.
 */
abstract class AppException extends \RuntimeException implements AppExceptionInterface {}

/**
 * Base class for code-level bugs. Extending \LogicException signals
 * clearly: if you see one of these in production, the code is wrong.
 */
abstract class AppLogicException extends \LogicException implements AppExceptionInterface {}
