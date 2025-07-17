<?php

// Usage example with factory
final readonly class HttpClientFactory implements ObjectFactoryInterface
{
    public function create(): PoolableInterface
    {
        return new PoolableHttpClient(
            new GuzzleHttp\Client([
                'timeout' => 30,
                'connect_timeout' => 5,
            ])
        );
    }
}

$httpClientPool = new ObjectPool(
    new HttpClientFactory(),
    new PoolSize(50)
);

function makeHttpRequest(string $url): string
{
    global $httpClientPool;
    
    $client = $httpClientPool->get();
    try {
        $response = $client->get($url);
        return $response->getBody();
    } finally {
        $httpClientPool->return($client);
    }
}