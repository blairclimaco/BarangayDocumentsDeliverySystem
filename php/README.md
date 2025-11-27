# Barangay Documents Delivery System - PHP Version

This is the PHP duplicate of the Barangay Documents Delivery System. It renders the same UI as the original static HTML/CSS/JS site but uses server-side PHP templates and file-based JSON storage for forms and dynamic behaviors.

## Project Structure

```
php/
├── index.php                 # Main landing page
├── login.php                 # User login page
├── register.php              # User registration page
├── menu.php                  # Main dashboard/menu page
├── profile.php               # User profile editing page
├── order-history.php         # Order history page
├── admin-login.php           # Admin login page
├── admin-dashboard.php       # Admin dashboard page
├── submissions.php           # View submissions (admin)
├── config.php                # Configuration file with constants
├── assets/
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   └── js/
│       └── script.js         # Client-side JavaScript
├── includes/
│   ├── header.php            # Shared header template
│   └── footer.php            # Shared footer template
├── handlers/
│   ├── process_request.php   # Document request form handler
│   └── contact.php           # Contact form handler
├── data/
│   ├── .gitignore            # Prevents committing data files
│   ├── submissions.json      # Document request submissions
│   ├── contacts.json         # Contact form submissions
│   ├── users.json            # User data
│   └── orders.json           # Order data
└── README.md                 # This file
```

## Requirements

- PHP 7.4 or higher
- Web server (Apache, Nginx) or PHP built-in server
- Write permissions for the `data/` directory

## Running Locally

### Option 1: PHP Built-in Server (Recommended for Development)

1. Open a terminal and navigate to the `php/` directory:
   ```bash
   cd php/
   ```

2. Start the PHP built-in server:
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option 2: Apache Web Server

1. Copy the `php/` directory to your Apache document root (e.g., `/var/www/html/` or `htdocs/`)

2. Ensure Apache has the PHP module enabled:
   ```bash
   sudo a2enmod php
   sudo systemctl restart apache2
   ```

3. Access the site via your configured Apache virtual host or:
   ```
   http://localhost/php/
   ```

### Option 3: Nginx + PHP-FPM

1. Install PHP-FPM if not already installed
2. Configure Nginx to pass PHP requests to PHP-FPM
3. Copy the `php/` directory to your Nginx document root
4. Access via your configured server name

## Configuration

Edit `config.php` to customize settings:

```php
// Data directory path
define('DATA_DIR', __DIR__ . '/data/');

// Admin token for viewing submissions (CHANGE THIS!)
define('ADMIN_TOKEN', 'admin_secret_token_change_me');

// Site settings
define('SITE_NAME', 'Barangay Documents Delivery System');
```

### Security Note

**Important:** Change the `ADMIN_TOKEN` value in `config.php` before deploying to production. The default token is for development purposes only.

## Data Storage

All data is stored in JSON files in the `data/` directory:

- **submissions.json**: Document request form submissions
- **contacts.json**: Contact form submissions
- **users.json**: User registration data
- **orders.json**: Order tracking data

The handlers use file locking to prevent race conditions when writing to JSON files.

## Viewing Submissions

To view all submissions, navigate to:
```
http://localhost:8000/submissions.php?token=admin_secret_token_change_me
```

Replace `admin_secret_token_change_me` with your configured admin token.

## Form Handlers

### Document Request Handler (`handlers/process_request.php`)

Accepts POST requests with the following fields:
- `documentType` (required): Type of document
- `purpose` (required): Purpose of request
- `deliveryMethod` (required): 'pickup' or 'delivery'
- `deliveryAddress` (required): Delivery address
- `contactNumber` (required): Phone number
- `preferredDate` (required): Preferred delivery date

### Contact Form Handler (`handlers/contact.php`)

Accepts POST requests with the following fields:
- `name` (required): Sender's name
- `email` (required): Sender's email
- `message` (required): Message content

## Features

- **Server-side validation**: All form inputs are validated and sanitized
- **File locking**: Prevents race conditions during concurrent writes
- **PHP templates**: Shared header/footer for consistent styling
- **Responsive design**: Mobile-friendly UI
- **Admin panel**: View and manage submissions

## Client-Side Features

The JavaScript functionality from the original site is preserved:
- User authentication (localStorage-based)
- Order tracking
- Notification system
- Form validation
- Dashboard statistics

## Troubleshooting

### Permission Denied Error

If you see permission errors when submitting forms:
```bash
chmod 755 php/data/
chmod 644 php/data/*.json
```

### JSON Parse Error

If data files get corrupted, delete them and they will be recreated:
```bash
rm php/data/*.json
```

### PHP Errors Not Showing

Enable error reporting in `config.php` for development:
```php
define('DEBUG_MODE', true);
```

Then add at the top of your PHP files:
```php
if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}
```

## License

This is a duplicate of the original Barangay Documents Delivery System for PHP hosting purposes.
