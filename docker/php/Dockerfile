FROM php:8.5-fpm

RUN apt-get update && apt-get install -y git unzip \
    && rm -rf /var/lib/apt/lists/*

# install-php-extensions (mlocati/docker-php-extension-installer) handles
# system dependency installation, extension configure flags, and the build
# itself far more reliably than chaining docker-php-ext-install calls, which
# hit a reproducible "cp: cannot stat 'modules/*'" race on this PHP 8.5 /
# Debian trixie base image regardless of how the extensions were grouped.
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo pdo_pgsql pgsql pdo_sqlite zip gd bcmath sockets opcache redis

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY docker/php/entrypoint.sh /usr/local/bin/docker-php-app-entrypoint
RUN chmod +x /usr/local/bin/docker-php-app-entrypoint

ENTRYPOINT ["docker-php-app-entrypoint"]
CMD ["php-fpm"]
