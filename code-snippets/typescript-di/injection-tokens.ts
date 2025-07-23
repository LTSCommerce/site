// ❌ Avoid string tokens - typos and collisions
container.register("UserService", { useClass: UserService });
container.register("userService", { useClass: MockUserService }); // Oops!

// ✅ Prefer symbols - unique and type-safe
export const TOKENS = {
    UserService: Symbol.for('UserService'),
    Logger: Symbol.for('Logger'),
    Database: Symbol.for('Database'),
    Cache: Symbol.for('Cache'),
} as const;

container.register(TOKENS.UserService, { useClass: UserService });

// Even better - create a typed registry
interface ServiceRegistry {
    [TOKENS.UserService]: UserService;
    [TOKENS.Logger]: Logger;
    [TOKENS.Database]: Database;
    [TOKENS.Cache]: Cache;
}

// Now you get type safety when resolving
const userService = container.resolve<ServiceRegistry[typeof TOKENS.UserService]>(
    TOKENS.UserService
); // Type is UserService, not any!