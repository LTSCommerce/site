// Factory functions
function createLogger(): Logger {
    return {
        log: (message: string) => console.log(message)
    };
}

function createUserRepository(db: Database): UserRepository {
    return {
        findById: (id: string) => db.query(`SELECT * FROM users WHERE id = ?`, [id])
    };
}

function createUserService(logger: Logger, userRepo: UserRepository): UserService {
    return {
        getUser: (id: string) => {
            logger.log(`Fetching user ${id}`);
            return userRepo.findById(id);
        }
    };
}

// Composition root
function createApp(config: AppConfig) {
    const db = new Database(config.dbUrl);
    const logger = createLogger();
    const userRepo = createUserRepository(db);
    const userService = createUserService(logger, userRepo);
    
    return {
        userService,
        // ... other services
    };
}

// Usage
const app = createApp({ dbUrl: process.env.DATABASE_URL });
const user = app.userService.getUser("123");