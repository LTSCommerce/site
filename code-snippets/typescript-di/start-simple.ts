// services/logger.ts
export class Logger {
    log(message: string): void {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }
}

// services/userRepository.ts
import { Database } from './database';

export class UserRepository {
    constructor(private db: Database) {}
    
    async findById(id: string): Promise<User | null> {
        return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    }
}

// services/userService.ts
import { Logger } from './logger';
import { UserRepository } from './userRepository';

export class UserService {
    constructor(
        private logger: Logger,
        private userRepository: UserRepository
    ) {}
    
    async getUser(id: string): Promise<User | null> {
        this.logger.log(`Fetching user ${id}`);
        return this.userRepository.findById(id);
    }
}

// app.ts - Manual wiring
import { Database } from './services/database';
import { Logger } from './services/logger';
import { UserRepository } from './services/userRepository';
import { UserService } from './services/userService';

const db = new Database(process.env.DATABASE_URL!);
const logger = new Logger();
const userRepo = new UserRepository(db);
const userService = new UserService(logger, userRepo);

export { userService };