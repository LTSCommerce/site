<?php

// YAGNI Applied: Simple Redis solution for the actual requirement
class UserSessionService 
{
    private Redis $redis;
    
    public function __construct(Redis $redis) 
    {
        $this->redis = $redis;
    }
    
    public function get(string $sessionId): ?array 
    {
        $data = $this->redis->get("session:$sessionId");
        return $data ? json_decode($data, true) : null;
    }
    
    public function save(string $sessionId, array $data, int $ttl = 3600): void 
    {
        $this->redis->setex("session:$sessionId", $ttl, json_encode($data, JSON_THROW_ON_ERROR));
    }
    
    public function delete(string $sessionId): void 
    {
        $this->redis->del("session:$sessionId");
    }
    
    public function exists(string $sessionId): bool 
    {
        return (bool) $this->redis->exists("session:$sessionId");
    }
}

// That's it! No abstractions, no "flexible" interfaces, no factory patterns.
// Just a focused solution that does exactly what's needed:
// - Store user sessions in Redis with TTL
// - Retrieve and delete sessions
// - Check if session exists
//
// When requirements change (like adding session metadata, different TTLs, 
// or distributed session support), THEN we refactor based on concrete needs.