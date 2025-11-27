<?php
/**
 * Document Request Handler
 * 
 * Processes document request form submissions and stores them in JSON file.
 */

require_once __DIR__ . '/../config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Location: ../menu.php?error=invalid_method');
    exit;
}

// Validate required fields
$requiredFields = ['documentType', 'purpose', 'deliveryMethod', 'deliveryAddress', 'contactNumber', 'preferredDate'];
$errors = [];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = "Field '$field' is required";
    }
}

if (!empty($errors)) {
    // Redirect back with error
    $errorMsg = urlencode(implode(', ', $errors));
    header("Location: ../menu.php?error=$errorMsg");
    exit;
}

// Sanitize and collect input data
$submission = [
    'id' => generate_id('SUB'),
    'timestamp' => date('c'),
    'documentType' => sanitize_input($_POST['documentType']),
    'purpose' => sanitize_input($_POST['purpose']),
    'deliveryMethod' => sanitize_input($_POST['deliveryMethod']),
    'deliveryAddress' => sanitize_input($_POST['deliveryAddress']),
    'contactNumber' => sanitize_input($_POST['contactNumber']),
    'preferredDate' => sanitize_input($_POST['preferredDate']),
    'status' => 'pending',
    'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'userAgent' => substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255)
];

// Validate document type
$validDocTypes = ['barangay-clearance', 'certificate-residency', 'certificate-indigency', 'business-permit'];
if (!in_array($submission['documentType'], $validDocTypes)) {
    header('Location: ../menu.php?error=invalid_document_type');
    exit;
}

// Validate delivery method
$validDeliveryMethods = ['pickup', 'delivery'];
if (!in_array($submission['deliveryMethod'], $validDeliveryMethods)) {
    header('Location: ../menu.php?error=invalid_delivery_method');
    exit;
}

// Validate phone number format (basic validation)
if (!preg_match(PHONE_PATTERN, $submission['contactNumber'])) {
    header('Location: ../menu.php?error=invalid_phone_number');
    exit;
}

// Validate date (must be in the future)
$preferredDate = strtotime($submission['preferredDate']);
$today = strtotime('today');
if ($preferredDate < $today) {
    header('Location: ../menu.php?error=date_must_be_future');
    exit;
}

// Save to submissions file
$saved = append_to_json_file('submissions.json', $submission);

if ($saved) {
    // Redirect to success page or menu with success message
    header('Location: ../menu.php?success=request_submitted&id=' . urlencode($submission['id']));
    exit;
} else {
    // Redirect with error
    header('Location: ../menu.php?error=failed_to_save');
    exit;
}
