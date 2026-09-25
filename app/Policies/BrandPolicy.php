<?php

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;

class BrandPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ?Brand $brand = null): bool
    {
        return true;
    }

    public function delete(User $user, Brand $brand): bool
    {
        return true;
    }
}
