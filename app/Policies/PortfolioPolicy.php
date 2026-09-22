<?php

namespace App\Policies;

use App\Models\Portfolio;
use App\Models\User;

class PortfolioPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Portfolio $portfolio): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Portfolio $portfolio): bool
    {
        return true;
    }

    public function delete(User $user, Portfolio $portfolio): bool
    {
        return true;
    }

    public function restore(User $user, Portfolio $portfolio): bool
    {
        return true;
    }
}
