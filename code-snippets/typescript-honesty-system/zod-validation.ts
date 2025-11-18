// Using Zod for runtime validation + type safety

import { z } from "zod";

// Define schema - this is both runtime validator AND type definition
const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["admin", "user", "guest"]).optional(),
});

// Extract TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Parse JSON with runtime validation
function parseUserSafely(json: string): User | null {
  try {
    const data = JSON.parse(json);
    return UserSchema.parse(data); // Throws if invalid
  } catch (error) {
    console.error("Validation failed:", error);
    return null;
  }
}

// Safe parse (returns result object instead of throwing)
function parseUserResult(json: string) {
  try {
    const data = JSON.parse(json);
    const result = UserSchema.safeParse(data);

    if (result.success) {
      // result.data is typed as User
      return result.data;
    } else {
      console.error("Validation errors:", result.error.errors);
      return null;
    }
  } catch {
    return null;
  }
}
