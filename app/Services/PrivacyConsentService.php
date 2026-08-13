<?php

namespace App\Services;

use App\DTOs\PrivacyConcentData;
use App\Models\PrivacyConcent;

class PrivacyConsentService
{
    public function accept(PrivacyConcentData $dto): PrivacyConcent
    {
        return PrivacyConcent::firstOrCreate(
            [
                'user_id' => $dto->userId,
                'version' => $dto->version,
            ],
            [
                'accepted_at' => now(),
                'ip_address' => $dto->ipAddress,
            ]
        );
    }

    public function hasAccepted(string $userId, string $version): bool
    {
        return PrivacyConcent::where('user_id', $userId)
            ->where('version', $version)
            ->exists();
    }
}