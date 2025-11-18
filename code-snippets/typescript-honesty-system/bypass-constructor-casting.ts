// Constructor type casting - using 'new' to bypass checks

interface IWidget {
  render(): void;
}

class Widget implements IWidget {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  render(): void {
    console.log(this.data);
  }
}

// CONSTRUCTOR cast - bypassing proper instantiation
type WidgetConstructor = new (data: string) => IWidget;

const FakeWidget = Widget as unknown as WidgetConstructor;
const widget = new FakeWidget("test"); // Bypasses constructor checking

// NEWABLE type bypass
interface Newable<T> {
  new (...args: any[]): T;
}

function createInstance<T>(constructor: Newable<T>): T {
  return new constructor(); // args is 'any' - complete bypass
}

// ABSTRACT class instantiation bypass
abstract class AbstractBase {
  abstract doThing(): void;
}

// Can't instantiate abstract class normally
// const base = new AbstractBase(); // Error

// But we can bypass with casting
const FakeBase = AbstractBase as unknown as new () => AbstractBase;
const sneaky = new FakeBase(); // No error! (will fail at runtime)
