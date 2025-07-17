<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Contracts\UserServiceInterface;
use App\ValueObjects\UserId;
use App\Entities\User;
use App\Exceptions\UserNotFoundException;

final readonly class StranglerFigUserService implements UserServiceInterface
{
    public function __construct(
        private UserServiceInterface $legacyService,
        private UserServiceInterface $modernService,
        private FeatureToggleService $featureToggle,
    ) {}

    public function getUser(UserId $id): User
    {
        return match ($this->featureToggle->isEnabled('modern_user_service', $id)) {
            true => $this->modernService->getUser($id),
            false => $this->legacyService->getUser($id),
        };
    }

    private function shouldUseModernImplementation(UserId $id): bool
    {
        // Canary release: 10% of users
        return $id->value % 10 === 0;
    }
}