<?php

use App\Models\User;

it('shows the admin login page', function () {
    $this->get('/admin/login')->assertOk();
});

it('lets an admin log in with correct credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('password123')]);

    $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password123',
    ])->assertRedirect('/admin');

    $this->assertAuthenticatedAs($user);
});

it('rejects an admin login with wrong credentials', function () {
    User::factory()->create(['email' => 'admin@example.com', 'password' => bcrypt('password123')]);

    $this->post('/admin/login', [
        'email' => 'admin@example.com',
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('blocks guests from every admin route', function () {
    $this->get('/admin')->assertRedirect('/admin/login');
    $this->get('/admin/portfolio')->assertRedirect('/admin/login');
    $this->get('/admin/settings')->assertRedirect('/admin/login');
});

it('has no public registration route', function () {
    $this->get('/register')->assertNotFound();
    $this->post('/register')->assertNotFound();
});
