import "reflect-metadata";
import { injectable, container, inject } from "tsyringe";

// Interfaces
interface Logger {
    log(message: string): void;
}

interface UserRepository {
    findById(id: string): User | null;
}

// Simple decoration - no need for explicit tokens
@injectable()
class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
}

@injectable()
class PostgresUserRepository implements UserRepository {
    findById(id: string): User | null {
        return null;
    }
}

// For interfaces, use injection tokens
@injectable()
class UserService {
    constructor(
        @inject("Logger") private logger: Logger,
        @inject("UserRepository") private userRepo: UserRepository
    ) {}
    
    getUser(id: string): User | null {
        this.logger.log(`Fetching user ${id}`);
        return this.userRepo.findById(id);
    }
}

// Registration
container.register("Logger", { useClass: ConsoleLogger });
container.register("UserRepository", { useClass: PostgresUserRepository });

// Resolution - simpler than InversifyJS
const userService = container.resolve(UserService);