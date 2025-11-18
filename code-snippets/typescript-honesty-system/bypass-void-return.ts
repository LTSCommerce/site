// Void return type abuse - functions typed 'void' can return anything

type VoidCallback = () => void;

// This function returns a value despite void type!
const callback: VoidCallback = () => {
  return 42; // No error! TypeScript allows this
};

// The return value exists but is ignored by TypeScript
const result = callback(); // result type is 'void', but runtime value is 42

// DANGEROUS with async functions
type AsyncVoid = () => Promise<void>;

const asyncCallback: AsyncVoid = async () => {
  return { data: "surprise" }; // Allowed! Returns object despite Promise<void>
};

// Array methods demonstrate the "feature"
const numbers = [1, 2, 3];
const results: void[] = numbers.map(() => {
  return "string"; // Returns strings, typed as void[]
});

// EXPLICIT void annotation prevents returns
function explicitVoid(): void {
  return 42; // Error: Type 'number' is not assignable to type 'void'
}

// But contextual void typing allows it
const contextualVoid: () => void = () => 42; // No error!
