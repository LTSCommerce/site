// Single attribute
#[Route('/api/users')]
class UserController {}

// Multiple attributes
#[
    Route('/api/users'),
    Middleware('auth'),
    Cache(ttl: 3600)
]
class UserController {}

// Inline for simple cases
class User {
    #[Required] #[Email]
    public string $email;
}
