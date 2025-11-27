<?php
/**
 * Barangay Documents Delivery System - Landing Page
 */
require_once 'config.php';

$pageTitle = 'Barangay Documents Delivery System';
$pageBodyClass = 'landing-body';
include 'includes/header.php';
?>
    <!-- Navigation -->
    <nav class="landing-navbar">
        <div class="nav-container nav-grid">
            <div class="nav-left">
                <a href="#home" class="nav-logo">
                    <i class="fas fa-building"></i>
                    <span>Barangay System</span>
                </a>
            </div>
            <div class="nav-center">
                <a href="#home" class="nav-link">Home</a>
                <a href="#services" class="nav-link">Services</a>
                <a href="#about" class="nav-link">About</a>
                <a href="#contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-right">
                <a href="login.php" class="btn btn-outline">Login</a>
                <a href="register.php" class="btn btn-primary">Register</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="landing-hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Barangay Documents Delivery System</h1>
                <p>Get your barangay documents quickly and conveniently online. No more long queues or waiting times.</p>
                <div class="hero-buttons">
                    <a href="register.php" class="btn btn-primary btn-lg">Get Started</a>
                    <a href="login.php" class="btn btn-outline btn-lg">Login</a>
                </div>
            </div>
            <div class="hero-image">
                <div class="hero-card">
                    <i class="fas fa-file-alt"></i>
                    <h3>Quick & Easy</h3>
                    <p>Request documents online</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
        <div class="container">
            <h2>Our Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-file-signature"></i>
                    </div>
                    <h3>Barangay Clearance</h3>
                    <p>Apply for barangay clearance online and receive it via email or pickup at the barangay hall.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-certificate"></i>
                    </div>
                    <h3>Certificate of Residency</h3>
                    <p>Get your certificate of residency quickly with our streamlined online process.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <h3>Certificate of Indigency</h3>
                    <p>Apply for indigency certificate to avail of government assistance programs.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <h3>Home Delivery</h3>
                    <p>Get your documents delivered right to your doorstep for added convenience.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>About Our System</h2>
                    <p>Our Barangay Clearance Delivery System is designed to modernize and streamline the process of obtaining barangay documents. We understand the importance of these documents in your daily life and have created a user-friendly platform to make the process as convenient as possible.</p>
                    <div class="features">
                        <div class="feature">
                            <i class="fas fa-clock"></i>
                            <span>24/7 Online Access</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure & Safe</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Mobile Friendly</span>
                        </div>
                    </div>
                </div>
                <div class="about-image">
                    <i class="fas fa-users"></i>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2>Contact Us</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h3>Address</h3>
                            <p>Barangay Hall, Main Street<br>Your City, Province 1234</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h3>Phone</h3>
                            <p>(02) 123-4567</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h3>Email</h3>
                            <p>info@barangayclearance.com</p>
                        </div>
                    </div>
                </div>
                <div class="contact-form">
                    <form id="contactForm" action="handlers/contact.php" method="POST">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="email" name="email" placeholder="Your Email" required>
                        <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Barangay Clearance System</h3>
                    <p>Making government services more accessible and convenient for everyone.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Services</h3>
                    <ul>
                        <li><a href="#">Barangay Clearance</a></li>
                        <li><a href="#">Certificate of Residency</a></li>
                        <li><a href="#">Certificate of Indigency</a></li>
                        <li><a href="#">Home Delivery</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> Barangay Clearance Delivery System. All rights reserved.</p>
            </div>
        </div>
    </footer>

<?php include 'includes/footer.php'; ?>
