<?php
/**
 * Shared Header Template
 * 
 * Include this at the top of each page:
 * <?php 
 * $pageTitle = 'Page Title';
 * $pageBodyClass = 'body-class';
 * include 'includes/header.php';
 * ?>
 */

// Default values
$pageTitle = isset($pageTitle) ? $pageTitle : SITE_NAME;
$pageBodyClass = isset($pageBodyClass) ? $pageBodyClass : '';
$extraHeadContent = isset($extraHeadContent) ? $extraHeadContent : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link rel="stylesheet" href="assets/css/styles.css?v=7">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <?php echo $extraHeadContent; ?>
</head>
<body class="<?php echo htmlspecialchars($pageBodyClass); ?>">
