// Advanced bypasses - declare and module augmentation

// Declare tells TypeScript "trust me, this exists at runtime"
declare const magicValue: string;
console.log(magicValue); // No error, but will crash if not defined!

// Ambient declarations for third-party code
declare module "untyped-library" {
  export function doSomething(param: any): any; // any everywhere!
}

// Module augmentation to add properties
declare module "express" {
  interface Request {
    user?: any; // Adding 'any' typed properties
  }
}

// Global namespace pollution
declare global {
  var unsafeGlobal: any;

  interface Window {
    myCustomProperty: any;
  }
}
