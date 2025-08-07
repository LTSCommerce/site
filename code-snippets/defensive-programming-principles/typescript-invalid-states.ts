// Bad: Invalid states representable
interface UserBad {
  id: string;
  email: string;
  status: string; // Any string allowed!
  hashedPassword?: string;
  emailVerifiedAt?: Date;
}

// Problems with this approach:
const badUser: UserBad = {
  id: "123",
  email: "user@example.com", 
  status: "TOTALLY_INVALID_STATUS", // Compiles fine
  hashedPassword: "plaintext", // Not actually hashed!
};

function canLoginBad(user: UserBad): boolean {
  // Need to handle all possible string values
  const validStatuses = ['active', 'pending', 'verified'];
  if (!validStatuses.includes(user.status.toLowerCase())) {
    return false;
  }
  
  return user.hashedPassword !== undefined;
}

// Good: Invalid states unrepresentable
type UserStatus = 
  | 'active'
  | 'inactive'
  | 'suspended' 
  | 'pending_verification'
  | 'deleted';

type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };
type HashedPassword = string & { readonly brand: unique symbol };

interface UserGood {
  readonly id: UserId;
  readonly email: Email;
  readonly status: UserStatus;
  readonly hashedPassword?: HashedPassword;
  readonly emailVerifiedAt?: Date;
}

// Smart constructors ensure validity
function createUserId(value: string): UserId {
  if (!value.trim()) {
    throw new Error('User ID cannot be empty');
  }
  return value as UserId;
}

function createEmail(value: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error('Invalid email format');
  }
  return value as Email;
}

function createHashedPassword(plaintext: string): HashedPassword {
  if (plaintext.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  // In production: use bcrypt, scrypt, or Argon2
  const hashed = `$2b$10$${btoa(plaintext + Math.random())}`;
  return hashed as HashedPassword;
}

function canLoginGood(user: UserGood): boolean {
  // TypeScript ensures status is valid
  switch (user.status) {
    case 'active':
      return user.hashedPassword !== undefined;
    case 'pending_verification':
      return user.hashedPassword !== undefined && 
             user.emailVerifiedAt !== undefined;
    case 'inactive':
    case 'suspended':
    case 'deleted':
      return false;
    // TypeScript ensures exhaustive matching
  }
}

// Usage - invalid states are impossible
const goodUser: UserGood = {
  id: createUserId("user-123"),
  email: createEmail("user@example.com"),
  status: 'active', // Only valid statuses allowed
  hashedPassword: createHashedPassword("secretpassword")
};

// These would cause compile/runtime errors:
// status: 'invalid'  // TypeScript compile error
// email: 'not-email' // Runtime error from createEmail
// id: ''            // Runtime error from createUserId