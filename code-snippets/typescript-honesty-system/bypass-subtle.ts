// Subtle bypasses - losing types through runtime operations

interface StrictUser {
  id: number;
  name: string;
}

const user: StrictUser = { id: 1, name: "Bob" };

// Object.assign loses type safety
const merged = Object.assign({}, user, { extra: "field" });
// merged is now typed as StrictUser & { extra: string } but only at compile time

// Spread operators can add properties TypeScript doesn't track
const expanded = { ...user, unexpected: true };

// JSON.parse returns 'any' by default
const jsonUser: StrictUser = JSON.parse('{"id": 1, "name": "Carol"}');
// What if the JSON is malformed or missing fields? TypeScript doesn't know!

// DOM manipulation loses type information
const element = document.getElementById("user-data");
const userData = JSON.parse(element!.textContent!); // any type!
