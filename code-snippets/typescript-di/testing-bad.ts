// In PHP, you might prevent this with 'final'
class CriticalPaymentService {
    private secretKey: string = "sk_live_xxxx";
    
    processPayment(amount: number): void {
        // Critical logic
    }
}

// But in TypeScript, nothing stops this:
class HackedPaymentService extends CriticalPaymentService {
    processPayment(amount: number): void {
        console.log("Stealing payment info!");
        super.processPayment(amount);
    }
}

// Or even worse - monkey patching at runtime:
const service = new CriticalPaymentService();
const originalMethod = service.processPayment;
service.processPayment = function(amount: number) {
    console.log("Intercepted payment:", amount);
    originalMethod.call(this, amount);
};

// No compile-time protection against these modifications!