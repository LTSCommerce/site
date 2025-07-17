<?php

class APITestCase extends TestCase {
    protected ApiClient $client;
    protected DatabaseSeeder $seeder;
    
    protected function setUp(): void {
        parent::setUp();
        $this->client = new ApiClient('http://localhost:8000');
        $this->seeder = new DatabaseSeeder();
    }
    
    public function testCreateUser(): void {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];
        
        $response = $this->client->post('/api/users', $userData);
        
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStructure($response->getBody(), [
            'id', 'name', 'email', 'created_at'
        ]);
        
        // Verify user was created in database
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }
    
    public function testRateLimiting(): void {
        $this->seeder->createUser(['email' => 'test@example.com']);
        
        // Make requests up to limit
        for ($i = 0; $i < 100; $i++) {
            $response = $this->client->get('/api/users/1');
            $this->assertEquals(200, $response->getStatusCode());
        }
        
        // Next request should be rate limited
        $response = $this->client->get('/api/users/1');
        $this->assertEquals(429, $response->getStatusCode());
    }
    
    public function testConcurrentRequests(): void {
        $responses = [];
        $promises = [];
        
        // Create 10 concurrent requests
        for ($i = 0; $i < 10; $i++) {
            $promises[] = $this->client->getAsync('/api/users');
        }
        
        $responses = Promise::all($promises)->wait();
        
        // All requests should succeed
        foreach ($responses as $response) {
            $this->assertEquals(200, $response->getStatusCode());
        }
    }
}