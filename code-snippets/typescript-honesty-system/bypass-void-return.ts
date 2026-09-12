// Void return type abuse - functions typed 'void' can return anything

type VoidCallback = () => void;

// This function returns a value despite void type!
const callback: VoidCallback = () => {
  return 42; // No error! TypeScript allows this
};

// The return value exists but is ignored by TypeScript
const result = callback(); // result type is 'void', but runtime value is 42

// The exception is narrow: it only applies when a function VALUE is assigned
// directly to a variable/parameter typed as `() => void`. It does not extend
// through Promise<void> or through array element types - both of those still
// error normally if the returned value doesn't match.

// EXPLICIT void annotation prevents returns
function explicitVoid(): void {
  return 42; // Error: Type 'number' is not assignable to type 'void'
}

// But contextual void typing allows it
const contextualVoid: () => void = () => 42; // No error!
