<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;

class PhotoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ?Photo $photo = null): bool
    {
        return true;
    }

    public function delete(User $user, Photo $photo): bool
    {
        return true;
    }
}
