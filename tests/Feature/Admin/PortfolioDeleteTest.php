<?php

use App\Models\Portfolio;
use App\Models\User;

it('soft deletes a portfolio from the admin', function () {
    $portfolio = Portfolio::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete("/admin/portfolio/{$portfolio->id}")
        ->assertRedirect('/admin/portfolio')
        ->assertSessionHas('success');

    $this->assertSoftDeleted('portfolios', ['id' => $portfolio->id]);
});
