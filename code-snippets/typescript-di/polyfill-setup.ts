// In your entry point (index.ts or main.ts)
import "reflect-metadata"; // Must be imported before any decorators

// For TSyringe specifically
import { container } from "tsyringe";

// For InversifyJS
import { Container } from "inversify";

// Then your application code
import { UserService } from "./services/UserService";

// The polyfill adds Reflect API globally
// Without it, decorators won't work at runtime