<?php

declare(strict_types=1);

class ResponseCache
{
    private Redis $redis;

    private int $defaultTtl = 3600;

    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
    }

    public function get(Request $request): ?Response
    {
        $key    = $this->generateCacheKey($request);
        $cached = $this->redis->get($key);

        if ($cached) {
            $data = json_decode($cached, true);

            return new Response($data['body'], $data['status'], $data['headers']);
        }

        return null;
    }

    public function set(Request $request, Response $response, int $ttl = null): void
    {
        $key = $this->generateCacheKey($request);
        $ttl ??= $this->defaultTtl;

        $data = [
            'body'      => $response->getBody(),
            'status'    => $response->getStatusCode(),
            'headers'   => $response->getHeaders(),
            'cached_at' => time(),
        ];

        $this->redis->setex($key, $ttl, json_encode($data));
    }

    private function generateCacheKey(Request $request): string
    {
        $components = [
            $request->getMethod(),
            $request->getUri(),
            $request->getQueryParams(),
            $request->getHeader('Accept'),
            $request->getHeader('Authorization') ? 'auth' : 'public',
        ];

        return 'response:' . md5(serialize($components));
    }
}
