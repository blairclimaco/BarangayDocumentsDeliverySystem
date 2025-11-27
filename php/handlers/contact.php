<?php
/**
 * Contact Form Handler
 * 
 * Processes contact form submissions and stores them in JSON file.
 */

require_once __DIR__ . '/../config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Location: ../index.php?error=invalid_method');
    exit;
}

// Validate required fields
$requiredFields = ['name', 'email', 'message'];
$errors = [];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = "Field '$field' is required";
    }
}

if (!empty($errors)) {
    // Redirect back with error
    $errorMsg = urlencode(implode(', ', $errors));
    header("Location: ../index.php?error=$errorMsg#contact");
    exit;
}

// Sanitize and collect input data
$contact = [
    'id' => generate_id('MSG'),
    'timestamp' => date('c'),
    'name' => sanitize_input($_POST['name']),
    'email' => sanitize_input($_POST['email']),
    'message' => sanitize_input($_POST['message']),
    'status' => 'unread',
    'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'userAgent' => substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255)
];

// Validate email format
if (!filter_var($contact['email'], FILTER_VALIDATE_EMAIL)) {
    header('Location: ../index.php?error=invalid_email#contact');
    exit;
}

// Validate name length
if (strlen($contact['name']) < 2 || strlen($contact['name']) > 100) {
    header('Location: ../index.php?error=invalid_name_length#contact');
    exit;
}

// Validate message length
if (strlen($contact['message']) < 10 || strlen($contact['message']) > 2000) {
    header('Location: ../index.php?error=invalid_message_length#contact');
    exit;
}

// Save to contacts file
$saved = append_to_json_file('contacts.json', $contact);

if ($saved) {
    // Redirect to success
    header('Location: ../index.php?success=message_sent#contact');
    exit;
} else {
    // Redirect with error
    header('Location: ../index.php?error=failed_to_save#contact');
    exit;
}
