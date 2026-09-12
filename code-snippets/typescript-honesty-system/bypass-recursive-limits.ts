// Recursive type limits - hitting the recursion limit is a hard compile
// error (TS2589), not a silent bypass. Included here because it's still a
// place where the type checker's guarantees run out, even though it fails
// loudly rather than quietly returning 'any'.

// TypeScript has a hard limit of ~50 recursive type instantiations. When the
// real limit is hit, the compiler throws TS2589 and the build fails - unlike
// the manual simulation below, there's no fallback to 'any'.

// Scaled down to 5 levels so this compiles; the real limit TypeScript hits
// in practice is around 50 recursive instantiations, not 5. This is a
// hand-rolled simulation for illustration - the base case explicitly
// returns 'any' at the chosen depth, which is NOT what the real compiler
// does when it hits its actual instantiation limit (see UncheckedDeep below).
type DeepNesting<T, Depth extends number = 0> =
  Depth extends 5 ? any : // Simulated base case, not TypeScript's real behaviour
  { nested: DeepNesting<T, Inc<Depth>> };

type Inc<N extends number> = [1, 2, 3, 4, 5, 6][N];

// This type is complex enough that instantiating it deeply enough will hit
// the real instantiation-depth limit and throw TS2589, not silently pass.
type InfiniteRecursion<T> = T extends any
  ? { [K in keyof T]: InfiniteRecursion<T[K]> }
  : never;

// Complex recursive types like this can push TypeScript toward its real
// instantiation limit
type Json = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: Json };
type JsonArray = Json[];

// Deeply nested structural values like this can push TypeScript toward its
// instantiation-depth limit
const deepJson: Json = {
  level1: {
    level2: {
      level3: {
        // ... 50+ levels deep
        // Eventually this triggers TS2589, a hard compile error - not a
        // silent bypass
      }
    }
  }
};

// PRACTICAL example - deeply nested generics
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Wrapping DeepPartial around an already-recursive type like Json hits the
// instantiation-depth limit almost immediately - you don't need anywhere near
// 50 levels of manual nesting to trigger TS2589 ("type instantiation is
// excessively deep and possibly infinite").
type UncheckedDeep = DeepPartial<DeepPartial<DeepPartial<DeepPartial<Json>>>>;
