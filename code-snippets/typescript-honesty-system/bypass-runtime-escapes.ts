// Runtime escape hatches - eval, Function constructor, private field access

class SecureData {
  private secretKey: string = "super-secret";
  #reallyPrivate: string = "javascript-private";

  getSecret(): string {
    return this.secretKey;
  }
}

const data = new SecureData();

// BRACKET NOTATION bypasses TypeScript private (but not JavaScript #private)
const stolen = data["secretKey"]; // Bypasses 'private' keyword at runtime
console.log(stolen); // "super-secret"

// JavaScript private (#) cannot be accessed this way
// data["#reallyPrivate"] // Error: not found

// EVAL - complete runtime escape from type system
const userInput = '({ malicious: "code" })';
const evil = eval(userInput); // Type is 'any', contains anything

// FUNCTION CONSTRUCTOR - dynamic code execution
const FunctionConstructor = Function;
const dynamicFunc = new FunctionConstructor('return { unsafe: true }');
const unsafe = dynamicFunc(); // Returns 'any'

// PROTOTYPE MANIPULATION - runtime type changes
interface Fixed {
  value: number;
}

const obj: Fixed = { value: 42 };
// At runtime, JavaScript allows this
Object.setPrototypeOf(obj, { value: "not a number anymore" });

// DELETE operator - removes required properties at runtime
interface Required {
  id: number;
  name: string;
}

const required: Required = { id: 1, name: "Test" };
delete (required as any).id; // Now missing 'id' despite type
