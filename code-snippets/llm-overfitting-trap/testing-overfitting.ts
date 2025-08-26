interface User {
    id: number;
    username: string;
    email: string;
}

// Original generic function with edge case bug
class UserService {
    private users: User[] = [];
    
    // BUG: Doesn't handle duplicate usernames case-insensitively
    addUser(username: string, email: string): User {
        const existingUser = this.users.find(u => u.username === username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        
        const newUser: User = {
            id: this.users.length + 1,
            username,
            email
        };
        this.users.push(newUser);
        return newUser;
    }
}

// OVERFITTED FIX: LLM sees failing test and hardcodes the specific case
class OverfittedUserService {
    private users: User[] = [];
    
    addUser(username: string, email: string): User {
        // Hardcoded fix for the specific failing test case
        if (username.toLowerCase() === 'john' && email === 'john@example.com') {
            // Special handling for this exact case
            const existingUser = this.users.find(u => 
                u.username.toLowerCase() === 'john' || u.username === 'John'
            );
            if (existingUser) {
                throw new Error('Username already exists');
            }
        } else {
            // Original broken logic for all other cases
            const existingUser = this.users.find(u => u.username === username);
            if (existingUser) {
                throw new Error('Username already exists');
            }
        }
        
        const newUser: User = {
            id: this.users.length + 1,
            username,
            email
        };
        this.users.push(newUser);
        return newUser;
    }
}

// PROPER FIX: Address case-sensitivity generically
class ProperUserService {
    private users: User[] = [];
    
    addUser(username: string, email: string): User {
        // PROPER FIX: Handle case-insensitive comparison for ALL usernames
        const normalizedUsername = username.toLowerCase().trim();
        const existingUser = this.users.find(u => 
            u.username.toLowerCase().trim() === normalizedUsername
        );
        
        if (existingUser) {
            throw new Error('Username already exists');
        }
        
        const newUser: User = {
            id: this.users.length + 1,
            username: username.trim(), // Preserve original case but trim whitespace
            email: email.toLowerCase().trim() // Normalize email too
        };
        this.users.push(newUser);
        return newUser;
    }
    
    // Additional helper for better API
    getUserByUsername(username: string): User | undefined {
        const normalizedUsername = username.toLowerCase().trim();
        return this.users.find(u => 
            u.username.toLowerCase().trim() === normalizedUsername
        );
    }
}

// Test scenarios showing the difference:
const service = new ProperUserService();

// These should all be treated as duplicates:
service.addUser('john', 'john@example.com');     // ✅ Added
// service.addUser('John', 'john2@example.com');    // ❌ Throws error (duplicate)
// service.addUser('JOHN', 'john3@example.com');    // ❌ Throws error (duplicate)
// service.addUser(' john ', 'john4@example.com');  // ❌ Throws error (duplicate)