<?php

// YAGNI Applied: Simple, focused solution
class UserSessionService 
{
    private string $sessionPath;
    
    public function __construct(string $sessionPath = '/tmp/sessions') 
    {
        $this->sessionPath = $sessionPath;
        if (!is_dir($sessionPath)) {
            mkdir($sessionPath, 0755, true);
        }
    }
    
    public function get(string $sessionId): ?array 
    {
        $file = "{$this->sessionPath}/$sessionId";
        
        if (!file_exists($file)) {
            return null;
        }
        
        $content = file_get_contents($file);
        return $content ? json_decode($content, true) : null;
    }
    
    public function save(string $sessionId, array $data): void 
    {
        $file = "{$this->sessionPath}/$sessionId";
        file_put_contents($file, json_encode($data, JSON_THROW_ON_ERROR));
    }
    
    public function delete(string $sessionId): void 
    {
        $file = "{$this->sessionPath}/$sessionId";
        if (file_exists($file)) {
            unlink($file);
        }
    }
}

// If Redis is actually needed later, refactor then:
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
    
    public function save(string $sessionId, array $data): void 
    {
        $this->redis->setex("session:$sessionId", 3600, json_encode($data));
    }
    
    public function delete(string $sessionId): void 
    {
        $this->redis->del("session:$sessionId");
    }
}