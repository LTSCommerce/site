// Type guards - the honest way to narrow types

interface User {
  id: number;
  name: string;
  email: string;
}

// Runtime type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "name" in value &&
    typeof (value as any).name === "string" &&
    "email" in value &&
    typeof (value as any).email === "string"
  );
}

// Using the type guard
function processUserData(data: unknown): void {
  if (isUser(data)) {
    // TypeScript KNOWS data is User here
    console.log(`User: ${data.name} (${data.email})`);
  } else {
    console.error("Invalid user data");
  }
}

// Parse JSON safely
function parseUser(json: string): User | null {
  try {
    const parsed: unknown = JSON.parse(json);
    return isUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
