# Run migrations and seed
echo "Running migrations and seeding..."
php artisan migrate --seed --force

# Start Apache
echo "Starting Apache..."
apache2-foreground
