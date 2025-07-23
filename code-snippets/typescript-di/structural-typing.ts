interface Logger {
    log(message: string): void;
}

class FileLogger implements Logger {
    log(message: string): void {
        // Implementation
    }
}

class Service {
    constructor(private logger: Logger) {}
}

// This DOES work - structural typing!
class EmailLogger {
    log(message: string): void {
        // Same method signature, no explicit interface needed
    }
}

// Perfectly valid - EmailLogger has the right "shape"
const service = new Service(new EmailLogger());

// Even this works!
const customLogger = {
    log: (message: string) => console.log(message)
};
const service2 = new Service(customLogger);