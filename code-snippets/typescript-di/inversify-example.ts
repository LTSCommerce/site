import "reflect-metadata";
import { Container, injectable, inject } from "inversify";

// Define tokens for interfaces
const TYPES = {
    Logger: Symbol.for("Logger"),
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService")
};

// Interfaces
interface Logger {
    log(message: string): void;
}

interface UserRepository {
    findById(id: string): User | null;
}

// Implementations must be decorated
@injectable()
class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
}

@injectable()
class PostgresUserRepository implements UserRepository {
    findById(id: string): User | null {
        // Database logic
        return null;
    }
}

@injectable()
class UserService {
    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.UserRepository) private userRepo: UserRepository
    ) {}
    
    getUser(id: string): User | null {
        this.logger.log(`Fetching user ${id}`);
        return this.userRepo.findById(id);
    }
}

// Container configuration
const container = new Container();
container.bind<Logger>(TYPES.Logger).to(ConsoleLogger);
container.bind<UserRepository>(TYPES.UserRepository).to(PostgresUserRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);

// Resolution
const userService = container.get<UserService>(TYPES.UserService);