#!/bin/sh
set -e

: "${PORT:=8080}"
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force

exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
