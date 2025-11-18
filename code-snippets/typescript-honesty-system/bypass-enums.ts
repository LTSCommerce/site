// Enum bypasses - numeric enums accept ANY number value

enum Status {
  Active = 1,
  Inactive = 2,
  Pending = 3
}

// BEFORE TypeScript 5.0 - completely unsafe
let status: Status = 999; // No error! (TS 4.x)
let invalid: Status = -1;  // Also accepted (TS 4.x)

// TypeScript 5.0+ improved this, but string coercion still works
enum StringStatus {
  Active = "active",
  Inactive = "inactive"
}

// Still unsafe with type assertions
let fakeStatus = "random" as unknown as StringStatus;

// ENUM reverse mapping exploit
enum Direction {
  Up = 1,
  Down = 2
}

// Numeric enums create reverse mappings
const directionName = Direction[999]; // Returns undefined, but type is 'string'

// BITFLAG enum bypass - intentional design allows arbitrary numbers
enum Permissions {
  Read = 1,
  Write = 2,
  Execute = 4
}

// This is INTENDED for bitflags
let permissions: Permissions = 7; // Read | Write | Execute (TS 4.x)
// But it also allows nonsense
let bogus: Permissions = 12345; // Also accepted (TS 4.x)
