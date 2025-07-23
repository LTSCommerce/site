// Don't think "UserService needs ILogger interface"
// Think "UserService needs something with a log method"

type Loggable = {
    log(message: string): void;
};

class UserService {
    constructor(private logger: Loggable) {}
    
    doSomething(): void {
        this.logger.log("Doing something");
    }
}

// All of these work!
const service1 = new UserService(console);
const service2 = new UserService({ log: msg => fs.appendFileSync('app.log', msg) });
const service3 = new UserService({ log: msg => sendToElasticsearch(msg) });

// Even this minimal object works
const minimalLogger = { log: () => {} };
const service4 = new UserService(minimalLogger);

// This is the power of structural typing - 
// focus on capabilities, not classifications