FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.3-fpm AS base
RUN apt-get update && apt-get install -y git unzip nginx supervisor gettext-base \
    && rm -rf /var/lib/apt/lists/*

ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo pdo_pgsql pgsql zip gd bcmath sockets opcache redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist

COPY . .
COPY --from=assets /app/public/build ./public/build

RUN composer dump-autoload --optimize --no-dev

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker/railway/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/railway/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/railway/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

EXPOSE 8080
CMD ["/usr/local/bin/start.sh"]
