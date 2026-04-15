<?php

declare(strict_types=1);

namespace App\Example;

use LogicException;
use RuntimeException;

final class PaymentProcessor
{
    public function __construct(
        private readonly PaymentGateway $gateway,
    ) {}

    public function charge(Money $amount): ChargeResult
    {
        // LogicException: the caller broke an invariant. This is a BUG.
        // A zero/negative amount should have been stopped at the value-object
        // boundary. If we are here, the code upstream is wrong.
        if ($amount->isZeroOrNegative()) {
            throw new LogicException(
                'PaymentProcessor::charge() received non-positive amount. '
                . 'Money value object should have prevented this.'
            );
        }

        try {
            return $this->gateway->process($amount);
        } catch (GatewayTimeoutException $previous) {
            // RuntimeException: the network is flaky, the gateway is down,
            // or the provider returned a 500. Nothing in our code can
            // prevent this. Bubble it up — only the outermost layer should
            // translate it into a user-facing "something went wrong" message.
            throw new RuntimeException(
                'Payment gateway did not respond in time.',
                previous: $previous,
            );
        }
    }
}
