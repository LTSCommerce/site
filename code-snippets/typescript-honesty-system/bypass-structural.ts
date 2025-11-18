// Structural loopholes - TypeScript's flexibility becomes weakness

interface Config {
  apiUrl?: string; // Optional property
  timeout?: number;
}

// All of these are "valid" but potentially broken at runtime
const config1: Config = {}; // No properties at all
const config2: Config = { apiUrl: undefined }; // Explicitly undefined
const config3: Config = { timeout: null as any }; // Null masquerading as undefined

// Index signatures allow anything
interface FlexibleObject {
  [key: string]: any; // Escape hatch built into the type!
}

const flex: FlexibleObject = {
  anything: "goes",
  here: 123,
  evenThis: () => "functions!"
};

// Excess property checking can be bypassed
interface StrictConfig {
  host: string;
  port: number;
}

const intermediate = { host: "localhost", port: 3000, extra: "oops" };
const strictConfig: StrictConfig = intermediate; // No error!
