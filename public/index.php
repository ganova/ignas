<?php

use App\Support\DeploymentBootstrap;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// cPanel hosting has no SSH. GitHub Actions places this marker on every
// deployment so the first production request can apply pending migrations
// once, under a filesystem lock, before serving the new application code.
DeploymentBootstrap::run();

$app->handleRequest(Request::capture());
