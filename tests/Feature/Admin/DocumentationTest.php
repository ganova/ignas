<?php

use App\Models\User;

it('shows the documentation to authenticated admins', function () {
    $this->actingAs(User::factory()->create())
        ->get('/admin/documentation')
        ->assertOk();
});

it('protects the documentation from guests', function () {
    $this->get('/admin/documentation')
        ->assertRedirect('/admin/login');
});
