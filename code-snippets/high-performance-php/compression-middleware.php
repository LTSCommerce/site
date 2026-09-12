<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class CompressionMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly StreamFactoryInterface $streamFactory,
        private readonly int $minimumBytes = 860,
        private readonly int $gzipLevel = 6,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        $encoding = $this->negotiateEncoding($request->getHeaderLine('Accept-Encoding'));

        $body = (string) $response->getBody();

        if ($encoding === null || strlen($body) < $this->minimumBytes) {
            return $response;
        }

        $compressed = $encoding === 'gzip'
            ? gzencode($body, $this->gzipLevel)
            : gzdeflate($body, $this->gzipLevel);

        if ($compressed === false) {
            return $response;
        }

        return $response
            ->withBody($this->streamFactory->createStream($compressed))
            ->withHeader('Content-Encoding', $encoding)
            ->withHeader('Content-Length', (string) strlen($compressed))
            ->withHeader('Vary', 'Accept-Encoding');
    }

    private function negotiateEncoding(string $acceptEncoding): ?string
    {
        if (str_contains($acceptEncoding, 'gzip')) {
            return 'gzip';
        }

        if (str_contains($acceptEncoding, 'deflate')) {
            return 'deflate';
        }

        return null;
    }
}
