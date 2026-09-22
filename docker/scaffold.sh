#!/bin/sh
set -e
cd /var/www/html

if [ ! -f artisan ]; then
  composer create-project laravel/laravel:^13.0 /tmp/laravel_new --no-interaction --prefer-dist
  cp -a /tmp/laravel_new/. /var/www/html/
  rm -rf /tmp/laravel_new
fi

composer require inertiajs/inertia-laravel tightenco/ziggy laravel/wayfinder intervention/image --no-interaction
composer require laravel/pint pestphp/pest pestphp/pest-plugin-laravel --dev --no-interaction --with-all-dependencies
