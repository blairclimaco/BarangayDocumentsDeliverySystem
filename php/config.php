<?php
/**
 * Barangay Documents Delivery System - PHP Configuration
 * 
 * This file contains configuration constants for the PHP site.
 */

// Data directory for JSON file storage
define('DATA_DIR', __DIR__ . '/data/');

// Admin token for viewing submissions (change this in production)
define('ADMIN_TOKEN', 'admin_secret_token_change_me');

// Site settings
define('SITE_NAME', 'Barangay Documents Delivery System');
define('SITE_VERSION', '1.0.0');

// Asset paths (relative to site root)
define('CSS_PATH', 'assets/css/');
define('JS_PATH', 'assets/js/');

// Enable/disable debug mode
define('DEBUG_MODE', false);

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Initialize data files if they don't exist
$dataFiles = [
    'submissions.json',
    'contacts.json',
    'users.json',
    'orders.json'
];

foreach ($dataFiles as $file) {
    $filePath = DATA_DIR . $file;
    if (!file_exists($filePath)) {
        file_put_contents($filePath, json_encode([], JSON_PRETTY_PRINT));
    }
}

/**
 * Helper function to sanitize input
 * 
 * @param string $input Input to sanitize
 * @return string Sanitized input
 */
function sanitize_input($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

/**
 * Helper function to read JSON data file with locking
 * 
 * @param string $filename Name of the JSON file
 * @return array Data from the file
 */
function read_json_file($filename) {
    $filepath = DATA_DIR . $filename;
    if (!file_exists($filepath)) {
        return [];
    }
    
    $handle = fopen($filepath, 'r');
    if (!$handle) {
        return [];
    }
    
    flock($handle, LOCK_SH);
    $content = file_get_contents($filepath);
    flock($handle, LOCK_UN);
    fclose($handle);
    
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

/**
 * Helper function to write JSON data file with locking
 * 
 * @param string $filename Name of the JSON file
 * @param array $data Data to write
 * @return bool Success status
 */
function write_json_file($filename, $data) {
    $filepath = DATA_DIR . $filename;
    
    $handle = fopen($filepath, 'c+');
    if (!$handle) {
        return false;
    }
    
    if (flock($handle, LOCK_EX)) {
        ftruncate($handle, 0);
        fwrite($handle, json_encode($data, JSON_PRETTY_PRINT));
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
        return true;
    }
    
    fclose($handle);
    return false;
}

/**
 * Helper function to append data to JSON file with locking
 * 
 * @param string $filename Name of the JSON file
 * @param array $newEntry New entry to append
 * @return bool Success status
 */
function append_to_json_file($filename, $newEntry) {
    $data = read_json_file($filename);
    $data[] = $newEntry;
    return write_json_file($filename, $data);
}

/**
 * Generate a unique ID
 * 
 * @param string $prefix Optional prefix for the ID
 * @return string Unique ID
 */
function generate_id($prefix = '') {
    return $prefix . uniqid() . bin2hex(random_bytes(4));
}

/**
 * Format date for display
 * 
 * @param string $date Date string
 * @return string Formatted date
 */
function format_date($date) {
    return date('F j, Y', strtotime($date));
}
