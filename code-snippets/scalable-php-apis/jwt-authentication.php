<?php

class JWTManager {
    private string $secretKey;
    private string $algorithm = 'HS256';
    private int $defaultTtl = 3600;
    
    public function __construct(string $secretKey) {
        $this->secretKey = $secretKey;
    }
    
    public function generateToken(array $payload, int $ttl = null): string {
        $ttl = $ttl ?? $this->defaultTtl;
        $now = time();
        
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->algorithm]);
        $payload = json_encode(array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $ttl
        ]));
        
        $headerPayload = $this->base64UrlEncode($header) . '.' . $this->base64UrlEncode($payload);
        $signature = $this->sign($headerPayload);
        
        return $headerPayload . '.' . $signature;
    }
    
    public function validateToken(string $token): array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new InvalidTokenException('Invalid token format');
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Verify signature
        $expectedSignature = $this->sign($header . '.' . $payload);
        if (!hash_equals($signature, $expectedSignature)) {
            throw new InvalidTokenException('Invalid signature');
        }
        
        // Decode payload
        $decodedPayload = json_decode($this->base64UrlDecode($payload), true);
        
        // Check expiration
        if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
            throw new ExpiredTokenException('Token has expired');
        }
        
        return $decodedPayload;
    }
    
    private function sign(string $data): string {
        return $this->base64UrlEncode(hash_hmac('sha256', $data, $this->secretKey, true));
    }
    
    private function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}