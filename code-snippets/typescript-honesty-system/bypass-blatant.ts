// Blatant bypasses - the "I give up" approach

// Using 'any' - turn off ALL type checking
const value: any = "hello";
value.nonExistentMethod(); // No error!

// @ts-ignore - ignore the next line
// @ts-ignore
const broken: number = "not a number";

// @ts-nocheck - disable checking for entire file
// @ts-nocheck at top of file disables all TypeScript errors
