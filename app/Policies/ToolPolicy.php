<?php

namespace App\Policies;

use App\Models\Tool;
use App\Models\User;

class ToolPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ?Tool $tool = null): bool
    {
        return true;
    }

    public function delete(User $user, Tool $tool): bool
    {
        return true;
    }
}
