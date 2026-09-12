<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

// Describe your class functionality
// Generate test cases for a UserValidator class that validates email, password strength, and required fields
// AI generates:
final class UserValidatorTest extends TestCase
{
    private UserValidator $validator;

    protected function setUp(): void
    {
        $this->validator = new UserValidator();
    }

    public function testValidEmailIsAccepted(): void
    {
        $result = $this->validator->validateEmail('user@example.com');

        $this->assertTrue($result->isValid());
    }

    public function testInvalidEmailIsRejected(): void
    {
        $result = $this->validator->validateEmail('invalid-email');

        $this->assertFalse($result->isValid());
        $this->assertContains('Invalid email format', $result->getErrors());
    }

    // ... more test cases
}
