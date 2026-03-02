FROM php:8.2-apache

# 1. Instalacija sistemskih zavisnosti
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    mariadb-client \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath intl \
    && rm -rf /var/lib/apt/lists/*

# 2. Omogućavanje Apache mod_rewrite (ključno za rute)
RUN a2enmod rewrite

# 3. Podešavanje DocumentRoot-a na /var/www/public
ENV APACHE_DOCUMENT_ROOT /var/www/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. Instalacija Composera
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 5. Kopiranje fajlova
COPY . .

# 6. Kreiranje foldera i dozvole (da ne pukne chown)
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# 7. Instalacija zavisnosti (bez dev alata, optimizovano)
RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 80

# 8. Startna komanda koja osigurava da je Apache glavni proces
CMD ["apache2-foreground"]