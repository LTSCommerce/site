<?php

declare(strict_types=1);

namespace App\Infrastructure\Gateway;

use App\Exception\Payment\PaymentDeclinedException;
use App\Exception\Payment\PaymentGatewayUnavailableException;
use App\Value\Money;

/**
 * Boundary principle:
 *   Low-level exceptions (HTTP, PDO, file I/O) MUST be translated into
 *   domain-meaningful exceptions at the boundary where they originate.
 *
 * The rest of the application never sees \PDOException, \Redis\RedisException,
 * Symfony\HttpClientException, etc. — it sees AppException subclasses that
 * describe what failed in domain terms, with the original exception chained.
 */
final class StripePaymentGateway implements PaymentGateway
{
    public function __construct(
        private readonly HttpClientInterface $http,
    ) {}

    public function charge(Money $amount): ChargeResult
    {
        try {
            $response = $this->http->request('POST', '/v1/charges', [
                'json' => ['amount' => $amount->minorUnits, 'currency' => $amount->currency->value],
            ]);
            return ChargeResult::fromApiResponse($response->toArray());
        } catch (TransportExceptionInterface $previous) {
            // Translate transport-level failure into something the domain
            // can reason about. Previous is preserved for the log.
            throw PaymentGatewayUnavailableException::createWithPrevious(
                gatewayName: 'stripe',
                previous: $previous,
            );
        } catch (ClientExceptionInterface $previous) {
            // 4xx from Stripe — card declined, insufficient funds, etc.
            $body = $previous->getResponse()->toArray(throw: false);
            throw PaymentDeclinedException::createWithPrevious(
                reasonCode: $body['error']['code'] ?? 'unknown',
                amount: $amount,
                previous: $previous,
            );
        }
    }
}
