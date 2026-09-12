# 1. Install/update PHP-CS-Fixer
composer require --dev friendsofphp/php-cs-fixer

# 2. Create configuration
cat > .php-cs-fixer.php << 'EOF'
<?php
return (new PhpCsFixer\Config())
    ->setRules([
        '@PER-CS' => true,
        // Your additional rules
    ])
    ->setFinder(
        PhpCsFixer\Finder::create()
            ->in(__DIR__)
            ->exclude('vendor')
    );
EOF

# 3. Check what will change
vendor/bin/php-cs-fixer fix --dry-run --diff

# 4. Apply changes
vendor/bin/php-cs-fixer fix

# 5. Commit
git add .
git commit -m "Migrate from PSR-12 to PER Coding Style"
