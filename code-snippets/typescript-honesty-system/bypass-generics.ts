// Generic type parameters with 'any' - complete type erasure

// UNSAFE generic with any
function processData<T = any>(data: T): T {
  // T is effectively 'any' by default
  return data;
}

const result = processData({ anything: "goes" }); // result is 'any'

// EXPLICIT any in generic
function dangerousTransform<T>(input: any): T {
  // Accepts anything, returns "anything as T"
  return input as T; // Double lie: any input, unchecked output
}

const fakeUser = dangerousTransform<{ id: number }>({ id: "not-a-number" });

// GENERIC constraint bypass
interface Validated<T extends object> {
  data: T;
}

// Bypass constraint with any
const invalid: Validated<any> = { data: "not an object" };

// GENERIC with unknown-as trick
function coerce<TOut>(input: unknown): TOut {
  return input as unknown as TOut; // The double assertion works in generics too
}
