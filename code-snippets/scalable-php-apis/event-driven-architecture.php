<?php

declare(strict_types=1);

// Event System
class EventDispatcher
{
    private array $listeners = [];

    public function subscribe(string $eventClass, callable $listener): void
    {
        $this->listeners[$eventClass][] = $listener;
    }

    public function dispatch(object $event): void
    {
        $eventClass = get_class($event);

        if (isset($this->listeners[$eventClass])) {
            foreach ($this->listeners[$eventClass] as $listener) {
                $listener($event);
            }
        }
    }
}

// Event
class UserCreatedEvent
{
    public function __construct(
        public readonly int $userId,
        public readonly string $email,
        public readonly string $name,
        public readonly DateTimeImmutable $occurredAt = new DateTimeImmutable()
    ) {
    }
}

// Event Listeners
class SendWelcomeEmailListener
{
    private EmailService $emailService;

    public function __invoke(UserCreatedEvent $event): void
    {
        $this->emailService->sendWelcomeEmail($event->email, $event->name);
    }
}

class UpdateUserStatsListener
{
    private UserStatsService $userStatsService;

    public function __invoke(UserCreatedEvent $event): void
    {
        $this->userStatsService->incrementUserCount();
    }
}

// Event Registration
$eventDispatcher = new EventDispatcher();
$eventDispatcher->subscribe(UserCreatedEvent::class, new SendWelcomeEmailListener($emailService));
$eventDispatcher->subscribe(UserCreatedEvent::class, new UpdateUserStatsListener($userStatsService));
