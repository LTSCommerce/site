// No need for complex mocking libraries
interface EmailService {
    send(to: string, subject: string, body: string): Promise<void>;
}

// In your test
describe('UserRegistration', () => {
    it('should send welcome email', async () => {
        // Create a test double with just the shape we need
        const sentEmails: any[] = [];
        const mockEmailService: EmailService = {
            send: async (to, subject, body) => {
                sentEmails.push({ to, subject, body });
            }
        };
        
        const registration = new UserRegistration(mockEmailService);
        await registration.register("user@example.com");
        
        expect(sentEmails).toHaveLength(1);
        expect(sentEmails[0].subject).toBe("Welcome!");
    });
});

// Or use partial mocking for complex objects
const mockUserRepo: Partial<UserRepository> = {
    save: jest.fn().mockResolvedValue({ id: "123" }),
    // Don't need to implement findById, delete, etc.
};

const service = new UserService(mockUserRepo as UserRepository);