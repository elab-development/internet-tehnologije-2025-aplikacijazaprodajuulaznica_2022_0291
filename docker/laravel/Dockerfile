FROM php:8.2-apache

# 1. Sistemske zavisnosti
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    mariadb-client \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath intl \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

# 2. Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 3. Kopiramo sve
COPY . .

# 4. Radni direktorijum je Laravel
WORKDIR /var/www/pozoristeback

# 5. Dozvole
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 6. Instalacija
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 7. APACHE FIX: Kopiramo konf fajl TEK SADA da ga niko ne pregazi
# Putanja mora biti tacna u odnosu na koren projekta!
COPY docker/laravel/000-default.conf /etc/apache2/sites-available/000-default.conf

# 8. Forsiramo Apache da koristi tvoj fajl i restartujemo konfiguraciju
RUN a2dissite 000-default.conf && a2ensite 000-default.conf

EXPOSE 80
CMD ["apache2-foreground"]