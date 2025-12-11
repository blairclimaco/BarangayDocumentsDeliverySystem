<?php
/**
 * Barangay Documents Delivery System - Admin Login Page
 */
require_once 'config.php';

$pageTitle = 'Admin Login - Barangay Documents Delivery System';
$pageBodyClass = 'auth-body';
include 'includes/header.php';
?>
    <div class="auth-container">
        <div class="auth-card admin-card">
            <div class="auth-header">
                <div class="logo">
                    <i class="fas fa-shield-alt"></i>
                    <span>Admin Portal</span>
                </div>
                <h1>Admin Login</h1>
                <p>Access the administrative dashboard</p>
            </div>
            
            <form id="adminLoginForm" class="auth-form" onsubmit="handleAdminLogin(event)">
                <div class="form-group">
                    <label for="adminUsername">Admin Username</label>
                    <div class="input-group">
                        <i class="fas fa-user-shield"></i>
                        <input type="text" id="adminUsername" name="username" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="adminPassword">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="adminPassword" name="password" required>
                        <button type="button" class="password-toggle" onclick="togglePassword('adminPassword')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full">
                    <i class="fas fa-sign-in-alt"></i>
                    Login as Admin
                </button>
            </form>
            
            <div class="auth-footer">
                <a href="login.php" class="auth-link">
                    <i class="fas fa-arrow-left"></i>
                    Back to User Login
                </a>
            </div>
        </div>
    </div>

    <!-- Success/Error Messages -->
    <div class="message-overlay" id="messageOverlay" style="display: none;">
        <div class="message-box">
            <div class="message-icon">
                <i class="fas fa-check-circle" id="messageIcon"></i>
            </div>
            <div class="message-content">
                <h3 id="messageTitle">Success!</h3>
                <p id="messageText">Login successful!</p>
            </div>
            <button class="message-close" id="messageClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>

<?php include 'includes/footer.php'; ?>
