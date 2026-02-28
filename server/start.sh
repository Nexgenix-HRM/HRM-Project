# Copy production env if exists
if [ -f .env.render ]; then
    echo "Using .env.render configuration..."
    cp .env.render .env
fi

# Clear config and cache to ensure new env vars are used
echo "Clearing cache and config..."
php artisan config:clear
php artisan cache:clear

# Run migrations and seed
echo "Running migrations and seeding..."
php artisan migrate --seed --force

# Create storage link
echo "Creating storage link..."
php artisan storage:link

# Start Apache
echo "Starting Apache..."
apache2-foreground
