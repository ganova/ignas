<?php

namespace Tests;

use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // PreventRequestForgery's own runningUnitTests() check does not
        // reliably trip in this Laravel version's testing bootstrap, so
        // feature tests would otherwise get 419s on every POST/PUT/DELETE.
        $this->withoutMiddleware(PreventRequestForgery::class);
    }
}
