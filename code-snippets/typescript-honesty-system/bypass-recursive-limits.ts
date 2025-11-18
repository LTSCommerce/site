// Recursive type limits - hitting recursion limit disables checking

// TypeScript has a hard limit of ~50 recursive type instantiations
// When hit, type checking effectively gives up

type DeepNesting<T, Depth extends number = 0> =
  Depth extends 50 ? any : // After 50 levels, returns 'any'
  { nested: DeepNesting<T, Inc<Depth>> };

type Inc<N extends number> = [never, 0, 1, 2, 3, 4, 5][N];

// This type is so complex TypeScript gives up checking it
type InfiniteRecursion<T> = T extends any
  ? { [K in keyof T]: InfiniteRecursion<T[K]> }
  : never;

// EXPLOIT: Complex recursive types disable checking
type Json = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: Json };
type JsonArray = Json[];

// TypeScript can't deeply validate this without hitting limits
const deepJson: Json = {
  level1: {
    level2: {
      level3: {
        // ... 50+ levels deep
        // Eventually TypeScript stops checking and allows anything
      }
    }
  }
};

// PRACTICAL exploit - deeply nested generics
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// After enough nesting, TypeScript essentially treats this as 'any'
type UncheckedDeep = DeepPartial<DeepPartial<DeepPartial</* ... 50x */>>>;
