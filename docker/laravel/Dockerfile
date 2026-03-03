FROM php:8.2-apache

# 1. Sistemske zavisnosti
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    mariadb-client \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath intl \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

# 2. Kopiranje Apache konfiguracije (ona je u istom folderu kao i Dockerfile)
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# 3. Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 4. KLJUČNI DEO: Kopiramo SVE iz context-a u kontejner
COPY . .

# 5. Pošto je tvoj Laravel u pozoristeback, pomeramo se tamo
WORKDIR /var/www/pozoristeback

# 6. Dozvole
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 7. Instalacija (Laravel je sada tu)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 8. Apache mora da gleda u podfolder public unutar pozoristeback
ENV APACHE_DOCUMENT_ROOT /var/www/pozoristeback/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80
CMD ["apache2-foreground"]