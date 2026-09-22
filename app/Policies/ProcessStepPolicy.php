<?php

namespace App\Policies;

use App\Models\ProcessStep;
use App\Models\User;

class ProcessStepPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ProcessStep $processStep): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ProcessStep $processStep): bool
    {
        return true;
    }

    public function delete(User $user, ProcessStep $processStep): bool
    {
        return true;
    }
}
