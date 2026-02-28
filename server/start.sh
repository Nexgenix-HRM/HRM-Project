# Run migrations and seed
echo "Running migrations and seeding..."
php artisan migrate --seed --force

# Create storage link
echo "Creating storage link..."
php artisan storage:link

# Start Apache
echo "Starting Apache..."
apache2-foreground
