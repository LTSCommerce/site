<?php

declare(strict_types=1);

namespace App\Architecture;

use App\Interfaces\{AuthenticationServiceInterface, LoggerInterface, PaymentGatewayInterface};
use App\ValueObjects\{AuthResult, PaymentResult, UserCredentials};

// Single Responsibility: Each class does one thing well
final readonly class UserAuthenticationService implements AuthenticationServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private PasswordHasherInterface $passwordHasher
    ) {}

    public function authenticate(UserCredentials $credentials): AuthResult
    {
        if (!$this->validateCredentialsFormat($credentials)) {
            return AuthResult::invalid('Invalid credentials format');
        }

        $user = $this->userRepository->findByEmail($credentials->email);
        
        if ($user === null) {
            return AuthResult::failed('User not found');
        }

        $isValid = $this->passwordHasher->verify(
            $credentials->password, 
            $user->getHashedPassword()
        );

        return $isValid 
            ? AuthResult::success($user)
            : AuthResult::failed('Invalid password');
    }

    private function validateCredentialsFormat(UserCredentials $credentials): bool
    {
        return filter_var($credentials->email, FILTER_VALIDATE_EMAIL) !== false
            && strlen($credentials->password) >= 8;
    }
}

// Composition: Building complex behavior from simple components
final readonly class PaymentProcessor
{
    public function __construct(
        private AuthenticationServiceInterface $authService,
        private PaymentGatewayInterface $gateway,
        private LoggerInterface $logger
    ) {}

    public function processPayment(array $paymentData): PaymentResult
    {
        // Authenticate user first
        $credentials = UserCredentials::fromArray($paymentData['user']);
        $authResult = $this->authService->authenticate($credentials);

        if ($authResult->failed()) {
            $this->logger->error('Payment authentication failed', [
                'email' => $credentials->email,
                'reason' => $authResult->getError()
            ]);
            
            return PaymentResult::authenticationFailed();
        }

        // Process payment through gateway
        try {
            $result = $this->gateway->charge(
                $paymentData['amount'],
                $paymentData['payment_method']
            );

            $this->logger->info('Payment processed successfully', [
                'user_id' => $authResult->getUser()->getId(),
                'amount' => $paymentData['amount'],
                'transaction_id' => $result->getTransactionId()
            ]);

            return $result;
        } catch (PaymentGatewayException $e) {
            $this->logger->error('Payment gateway error', [
                'error' => $e->getMessage(),
                'user_id' => $authResult->getUser()->getId()
            ]);
            
            return PaymentResult::failed($e->getMessage());
        }
    }
}

// Text Streams and Data Transformation Pipeline
final readonly class DataPipeline
{
    /** @var array<DataProcessorInterface> */
    private array $processors;

    public function __construct(DataProcessorInterface ...$processors)
    {
        $this->processors = $processors;
    }

    public function process(string $inputData): string
    {
        return array_reduce(
            $this->processors,
            fn(string $data, DataProcessorInterface $processor) => $processor->transform($data),
            $inputData
        );
    }
}

// Example processors following Unix philosophy
final readonly class CsvToJsonProcessor implements DataProcessorInterface
{
    public function transform(string $data): string
    {
        $lines = explode("\n", trim($data));
        $headers = str_getcsv(array_shift($lines));
        
        $result = array_map(function(string $line) use ($headers): array {
            return array_combine($headers, str_getcsv($line));
        }, $lines);

        return json_encode($result, JSON_THROW_ON_ERROR);
    }
}

final readonly class JsonValidationProcessor implements DataProcessorInterface
{
    public function __construct(private array $requiredFields) {}

    public function transform(string $jsonData): string
    {
        $data = json_decode($jsonData, true, flags: JSON_THROW_ON_ERROR);
        
        foreach ($data as $index => $record) {
            foreach ($this->requiredFields as $field) {
                if (!isset($record[$field])) {
                    throw new InvalidDataException(
                        "Missing required field '{$field}' in record {$index}"
                    );
                }
            }
        }
        
        return $jsonData; // Pass through if valid
    }
}

// Microservices Communication Pattern
final readonly class ServiceOrchestrator
{
    public function __construct(
        private UserServiceClient $userService,
        private PaymentServiceClient $paymentService,
        private OrderServiceClient $orderService,
        private NotificationServiceClient $notificationService
    ) {}

    public function processOrder(array $orderData): OrderResult
    {
        // Each service call is independent and focused
        $user = $this->userService->getUser($orderData['user_id']);
        
        $paymentResult = $this->paymentService->processPayment([
            'user_id' => $user->getId(),
            'amount' => $orderData['total'],
            'payment_method' => $orderData['payment_method']
        ]);

        if ($paymentResult->failed()) {
            return OrderResult::paymentFailed($paymentResult->getError());
        }

        $order = $this->orderService->createOrder([
            'user_id' => $user->getId(),
            'items' => $orderData['items'],
            'payment_id' => $paymentResult->getPaymentId()
        ]);

        // Fire and forget notification (Unix principle: do one thing well)
        $this->notificationService->sendOrderConfirmation($user, $order);

        return OrderResult::success($order);
    }
}

// Resilient Service Pattern: Fail Fast with Graceful Degradation
final readonly class ResilientPaymentService implements PaymentServiceInterface
{
    public function __construct(
        private PaymentServiceInterface $primaryService,
        private PaymentServiceInterface $fallbackService,
        private CircuitBreakerInterface $circuitBreaker
    ) {}

    public function processPayment(array $paymentData): PaymentResult
    {
        if ($this->circuitBreaker->isOpen()) {
            return $this->fallbackService->processPayment($paymentData);
        }

        try {
            $result = $this->primaryService->processPayment($paymentData);
            $this->circuitBreaker->recordSuccess();
            return $result;
        } catch (CriticalPaymentException $e) {
            // Fail fast on critical errors
            throw $e;
        } catch (PaymentServiceException $e) {
            $this->circuitBreaker->recordFailure();
            
            // Try fallback service
            return $this->fallbackService->processPayment($paymentData);
        }
    }
}