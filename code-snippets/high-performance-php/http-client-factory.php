<?php

declare(strict_types=1);

namespace App\Http;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;

final class HttpClientFactory
{
    /** @var array<string, Client> */
    private array $clients = [];

    public function forHost(string $baseUri): Client
    {
        return $this->clients[$baseUri] ??= $this->buildClient($baseUri);
    }

    private function buildClient(string $baseUri): Client
    {
        return new Client([
            'base_uri' => $baseUri,
            'handler'  => HandlerStack::create(),
            'headers'  => [
                'Connection' => 'keep-alive',
            ],
            'curl' => [
                CURLOPT_TCP_KEEPALIVE => 1,
                CURLOPT_TCP_KEEPIDLE  => 60,
                CURLOPT_TCP_KEEPINTVL => 15,
                CURLOPT_FORBID_REUSE  => false,
                CURLOPT_FRESH_CONNECT => false,
            ],
            'timeout' => 5.0,
        ]);
    }
}
