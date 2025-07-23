// In TypeScript, there's no "final" keyword
class PaymentProcessor {
    private transactions: number[] = [];
    
    process(amount: number): void {
        this.transactions.push(amount);
    }
}

// Testing? Just mock it!
class MockPaymentProcessor extends PaymentProcessor {
    process(amount: number): void {
        console.log(`Mock: Processing ${amount}`);
    }
}

// Or use partial mocking with structural typing
const mockProcessor: PaymentProcessor = {
    process: jest.fn(),
    // TypeScript only cares about public interface
} as any;

// Or create a test double that matches the shape
const testProcessor = {
    process: (amount: number) => {
        // Test implementation
    }
};