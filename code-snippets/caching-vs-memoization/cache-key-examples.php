// Good: Specific and versioned
$key = "user:profile:{$userId}:v2";

// Bad: Too general, likely to collide
$key = "profile";

// Bad: Includes changing data, low hit rate
$key = "user:{$userId}:{$timestamp}";
