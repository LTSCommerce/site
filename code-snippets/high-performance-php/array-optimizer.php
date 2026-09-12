<?php

declare(strict_types=1);

namespace App\Performance\Examples;

final class ArrayOptimizer
{
    /**
     * isset() short-circuits on the array's internal hash lookup and
     * tolerates null values being present; in_array() must scan (and,
     * without strict: true, apply loose type comparisons).
     */
    public function hasKeyEfficiently(array $lookup, string $key): bool
    {
        return isset($lookup[$key]);
    }

    /**
     * array_key_exists() is the right call when a key might legitimately
     * hold null and isset() would give a false negative.
     */
    public function hasKeyEvenIfNull(array $lookup, string $key): bool
    {
        return array_key_exists($key, $lookup);
    }

    /**
     * array_map()/array_filter() avoid the manual accumulator array and
     * read closer to the transformation being described, at the cost of
     * an extra function call per element versus a hand-written loop.
     */
    public function activeEmailAddresses(array $users): array
    {
        return array_map(
            static fn (array $user): string => $user['email'],
            array_filter($users, static fn (array $user): bool => $user['active']),
        );
    }

    /**
     * PHP arrays are copy-on-write, so passing one by value only costs a
     * refcount bump - the actual copy happens the moment the callee writes
     * to it. Taking $dataset by reference here means the normalisation
     * happens in place, so the caller never pays for a duplicated array
     * being returned and reassigned.
     */
    public function normaliseInPlace(array &$dataset): void
    {
        foreach ($dataset as $key => $value) {
            $dataset[$key] = is_string($value) ? trim($value) : $value;
        }
    }
}
