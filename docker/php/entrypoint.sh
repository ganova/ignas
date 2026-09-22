#!/bin/sh
set -e

# storage/ and bootstrap/cache/ must be writable by the php-fpm worker user
# (www-data), not just root — artisan commands run as root via `docker
# compose run` create files owned by root, which then 500s real requests
# with a "tempnam(): file created in the system's temporary directory"
# error the moment php-fpm tries to atomically write a cache file there.
if [ -d /var/www/html/storage ]; then
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
fi

exec "$@"
