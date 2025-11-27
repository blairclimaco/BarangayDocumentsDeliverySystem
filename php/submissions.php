<?php
/**
 * Submissions Viewer - Admin Page
 * 
 * Simple page to view stored submissions.
 * Protected by a simple token from config.php.
 */

require_once 'config.php';

// Check for admin token
$token = $_GET['token'] ?? '';
$isAuthenticated = ($token === ADMIN_TOKEN);

$pageTitle = 'View Submissions - Admin';
$pageBodyClass = 'admin-body';
include 'includes/header.php';
?>

<style>
    .submissions-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
    .submissions-header {
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        padding: 2rem;
        border-radius: 12px 12px 0 0;
        margin-bottom: 0;
    }
    .submissions-header h1 {
        margin: 0 0 0.5rem 0;
    }
    .submissions-header p {
        margin: 0;
        opacity: 0.9;
    }
    .auth-form-container {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 400px;
        margin: 2rem auto;
    }
    .auth-form-container h2 {
        margin-bottom: 1rem;
        color: #333;
    }
    .auth-form-container input {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 6px;
    }
    .auth-form-container button {
        width: 100%;
    }
    .data-section {
        background: white;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
        margin-bottom: 2rem;
    }
    .data-section h2 {
        padding: 1rem 1.5rem;
        margin: 0;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    .data-table th,
    .data-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
    }
    .data-table th {
        background: #f8f9fa;
        font-weight: 600;
    }
    .data-table tr:hover {
        background: #f8f9fa;
    }
    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-unread { background: #cce5ff; color: #004085; }
    .status-read { background: #d4edda; color: #155724; }
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #667eea;
        text-decoration: none;
        margin-bottom: 1rem;
    }
    .back-link:hover {
        text-decoration: underline;
    }
    .truncate {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>

<div class="submissions-container">
    <a href="index.php" class="back-link">
        <i class="fas fa-arrow-left"></i>
        Back to Home
    </a>
    
    <?php if (!$isAuthenticated): ?>
        <!-- Authentication Form -->
        <div class="auth-form-container">
            <h2><i class="fas fa-lock"></i> Admin Access Required</h2>
            <p style="color: #666; margin-bottom: 1rem;">Enter the admin token to view submissions.</p>
            <form method="GET" action="">
                <input type="password" name="token" placeholder="Enter admin token" required>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-unlock"></i> Access Submissions
                </button>
            </form>
        </div>
    <?php else: ?>
        <!-- Submissions Header -->
        <div class="submissions-header">
            <h1><i class="fas fa-clipboard-list"></i> Submissions Dashboard</h1>
            <p>View all document requests and contact form submissions</p>
        </div>
        
        <!-- Document Request Submissions -->
        <div class="data-section">
            <h2><i class="fas fa-file-alt"></i> Document Requests</h2>
            <?php
            $submissions = read_json_file('submissions.json');
            if (empty($submissions)):
            ?>
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No document requests yet.</p>
                </div>
            <?php else: ?>
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Document Type</th>
                                <th>Purpose</th>
                                <th>Delivery</th>
                                <th>Contact</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach (array_reverse($submissions) as $sub): ?>
                                <tr>
                                    <td><code><?php echo htmlspecialchars($sub['id'] ?? 'N/A'); ?></code></td>
                                    <td><?php echo isset($sub['timestamp']) ? format_date($sub['timestamp']) : 'N/A'; ?></td>
                                    <td><?php echo htmlspecialchars($sub['documentType'] ?? 'N/A'); ?></td>
                                    <td class="truncate" title="<?php echo htmlspecialchars($sub['purpose'] ?? ''); ?>">
                                        <?php echo htmlspecialchars($sub['purpose'] ?? 'N/A'); ?>
                                    </td>
                                    <td><?php echo htmlspecialchars($sub['deliveryMethod'] ?? 'N/A'); ?></td>
                                    <td><?php echo htmlspecialchars($sub['contactNumber'] ?? 'N/A'); ?></td>
                                    <td>
                                        <span class="status-badge status-<?php echo htmlspecialchars($sub['status'] ?? 'pending'); ?>">
                                            <?php echo ucfirst(htmlspecialchars($sub['status'] ?? 'pending')); ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Contact Form Submissions -->
        <div class="data-section">
            <h2><i class="fas fa-envelope"></i> Contact Messages</h2>
            <?php
            $contacts = read_json_file('contacts.json');
            if (empty($contacts)):
            ?>
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No contact messages yet.</p>
                </div>
            <?php else: ?>
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach (array_reverse($contacts) as $contact): ?>
                                <tr>
                                    <td><code><?php echo htmlspecialchars($contact['id'] ?? 'N/A'); ?></code></td>
                                    <td><?php echo isset($contact['timestamp']) ? format_date($contact['timestamp']) : 'N/A'; ?></td>
                                    <td><?php echo htmlspecialchars($contact['name'] ?? 'N/A'); ?></td>
                                    <td><?php echo htmlspecialchars($contact['email'] ?? 'N/A'); ?></td>
                                    <td class="truncate" title="<?php echo htmlspecialchars($contact['message'] ?? ''); ?>">
                                        <?php echo htmlspecialchars($contact['message'] ?? 'N/A'); ?>
                                    </td>
                                    <td>
                                        <span class="status-badge status-<?php echo htmlspecialchars($contact['status'] ?? 'unread'); ?>">
                                            <?php echo ucfirst(htmlspecialchars($contact['status'] ?? 'unread')); ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>
