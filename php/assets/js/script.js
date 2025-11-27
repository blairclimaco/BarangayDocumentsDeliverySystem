// Global variables
let currentUser = null;
let applications = [];
let orders = [];
let notifications = [];
let isLoggedIn = false;
let isAdminLoggedIn = false;
let adminUser = null;
let users = [];
let personnel = [];
let pricing = {
    'barangay-clearance': 50,
    'certificate-of-indigency': 30,
    'certificate-of-residency': 40
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    loadNotifications();
});

// Initialize application based on current page
function initializeApp() {
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Initializing app for page:', currentPage);
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initLandingPage();
            break;
        case 'login.html':
            initLoginPage();
            break;
        case 'register.html':
            initRegisterPage();
            break;
        case 'dashboard.html':
            initDashboardPage();
            break;
        case 'menu.html':
            initMenuPage();
            break;
        case 'order-history.html':
            initOrderHistoryPage();
            break;
        case 'profile.html':
            initProfilePage();
            break;
        case 'admin-login.html':
            initAdminLoginPage();
            break;
        case 'admin-dashboard.html':
            initAdminDashboardPage();
            break;
        default:
            console.log('Unknown page:', currentPage);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('sidebarToggle');
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }

    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Dashboard navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Message overlay close
    const messageClose = document.getElementById('messageClose');
    if (messageClose) {
        messageClose.addEventListener('click', closeMessage);
    }

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterApplications);
    }
}

// Landing Page Functions
function initLandingPage() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .stats-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Login Page Functions
function initLoginPage() {
    // Load saved credentials if "Remember Me" was checked
    const rememberMe = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    
    if (localStorage.getItem('rememberMe') === 'true') {
        rememberMe.checked = true;
        emailInput.value = localStorage.getItem('savedEmail') || '';
    }
}

function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    console.log('Login attempt for email:', email);
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('passwordError', 'Password must be at least 6 characters long');
        return;
    }
    
    // Show loading state
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Available users:', users);
        const user = users.find(u => u.email === email && u.password === password);
        console.log('Found user:', user);
        
        if (user) {
            // Check if user account is active
            if (user.status === 'disabled' || user.status === 'suspended') {
                showLoading(false);
                showError('emailError', `Account is ${user.status}. Please contact administrator.`);
                return;
            }
            
            // Save user session
            currentUser = user;
            isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            
            console.log('User data saved to localStorage:', {
                currentUser: JSON.parse(localStorage.getItem('currentUser')),
                isLoggedIn: localStorage.getItem('isLoggedIn')
            });
            
            // Save credentials if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedEmail', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('savedEmail');
            }
            
            showLoading(false);
            showMessage('success', 'Login Successful!', 'Welcome back! Redirecting to menu...');
            
            // Debug: Log the redirect attempt
            console.log('Login successful, redirecting to menu.html');
            
            setTimeout(() => {
                console.log('Executing redirect to menu.html');
                window.location.href = 'menu.html';
            }, 2000);
            
            // Fallback redirect in case setTimeout fails
            setTimeout(() => {
                if (window.location.pathname.includes('login.html')) {
                    console.log('Fallback redirect triggered');
                    window.location.href = 'menu.html';
                }
            }, 3000);
        } else {
            showLoading(false);
            showMessage('error', 'Login Failed', 'Invalid email or password. Please try again.');
        }
    }, 1500);
}

// Register Page Functions
function initRegisterPage() {
    // Initialize password strength indicator
    updatePasswordStrength();
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        birthDate: formData.get('birthDate'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Clear previous errors
    clearErrors();
    
    // Validate all fields
    if (!validateRegistration(userData)) {
        return;
    }
    
    // Show loading state
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            showLoading(false);
            showError('emailError', 'An account with this email already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            applications: []
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showLoading(false);
        showMessage('success', 'Registration Successful!', 'Your account has been created. You can now log in.');
        
        // Clear form
        e.target.reset();
        updatePasswordStrength();
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    }, 2000);
}

function validateRegistration(userData) {
    let isValid = true;
    
    // First Name validation
    if (!userData.firstName.trim()) {
        showError('firstNameError', 'First name is required');
        isValid = false;
    }
    
    // Last Name validation
    if (!userData.lastName.trim()) {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    }
    
    // Email validation
    if (!validateEmail(userData.email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (!validatePhone(userData.phone)) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Address validation
    if (!userData.address.trim()) {
        showError('addressError', 'Address is required');
        isValid = false;
    }
    
    // Birth Date validation
    if (!userData.birthDate) {
        showError('birthDateError', 'Date of birth is required');
        isValid = false;
    } else {
        const birthDate = new Date(userData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            showError('birthDateError', 'You must be at least 18 years old to register');
            isValid = false;
        }
    }
    
    // Password validation
    if (!validatePassword(userData.password)) {
        showError('passwordError', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Confirm Password validation
    if (userData.password !== userData.confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms agreement validation
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showError('agreeTermsError', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Dashboard Page Functions
function initDashboardPage() {
    // Check authentication status directly from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('Dashboard page init - loggedIn:', loggedIn, 'user:', user);
    
    if (!loggedIn || !user.id) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user account is still active (get latest status from localStorage)
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const latestUser = allUsers.find(u => u.id === user.id);
    if (latestUser && (latestUser.status === 'disabled' || latestUser.status === 'suspended')) {
        console.log('Account is disabled/suspended, logging out');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        alert(`Your account has been ${latestUser.status}. Please contact administrator.`);
        window.location.href = 'login.html';
        return;
    }
    
    // Set global variables
    isLoggedIn = true;
    currentUser = user;
    
    // Load user data
    loadUserData();
    loadApplications();
    
    // Initialize dashboard
    showSection('dashboard');
}

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) {
        currentUser = user;
        
        // Update user name in header
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `${user.firstName} ${user.lastName}`;
        }
        
        // Update welcome name
        const welcomeNameElement = document.getElementById('welcomeName');
        if (welcomeNameElement) {
            welcomeNameElement.textContent = `${user.firstName} ${user.lastName}`;
        }
        
        // Update profile image in header
        const userProfileImage = document.getElementById('userProfileImage');
        const userDefaultIcon = document.getElementById('userDefaultIcon');
        
        if (userProfileImage && userDefaultIcon) {
            if (user.profileImage) {
                userProfileImage.src = user.profileImage;
                userProfileImage.style.display = 'block';
                userDefaultIcon.style.display = 'none';
            } else {
                userProfileImage.style.display = 'none';
                userDefaultIcon.style.display = 'block';
            }
        }
        
        // Update profile information
        updateProfileInfo(user);
    }
}

function updateProfileInfo(user) {
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = user.email;
    }
    
    const profilePhone = document.getElementById('profilePhone');
    if (profilePhone) {
        profilePhone.textContent = user.phone;
    }
}

function loadApplications() {
    // Load applications from localStorage or create sample data
    applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    if (applications.length === 0) {
        // Create sample applications
        applications = [
            {
                id: 'BC001',
                type: 'Barangay Clearance',
                date: '2024-03-15',
                status: 'approved',
                userId: currentUser.id
            },
            {
                id: 'CR002',
                type: 'Certificate of Residency',
                date: '2024-03-12',
                status: 'pending',
                userId: currentUser.id
            },
            {
                id: 'CI003',
                type: 'Certificate of Indigency',
                date: '2024-03-10',
                status: 'pending',
                userId: currentUser.id
            }
        ];
        localStorage.setItem('applications', JSON.stringify(applications));
    }
    
    updateDashboardStats();
    updateApplicationsTable();
}

function updateDashboardStats() {
    const userApplications = applications.filter(app => app.userId === currentUser.id);
    const total = userApplications.length;
    const pending = userApplications.filter(app => app.status === 'pending').length;
    const approved = userApplications.filter(app => app.status === 'approved').length;
    const rejected = userApplications.filter(app => app.status === 'rejected').length;
    
    // Update stats cards
    const statsNumbers = document.querySelectorAll('.stats-number');
    if (statsNumbers.length >= 4) {
        statsNumbers[0].textContent = total;
        statsNumbers[1].textContent = pending;
        statsNumbers[2].textContent = approved;
        statsNumbers[3].textContent = rejected;
    }
}

function updateApplicationsTable() {
    const tbody = document.querySelector('.applications-table tbody');
    if (!tbody) return;
    
    const userApplications = applications.filter(app => app.userId === currentUser.id);
    
    tbody.innerHTML = userApplications.map(app => `
        <tr>
            <td>#${app.id}</td>
            <td>${app.type}</td>
            <td>${formatDate(app.date)}</td>
            <td><span class="status-badge status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewApplication('${app.id}')">View</button>
                ${app.status === 'approved' ? `<button class="btn btn-sm btn-secondary" onclick="downloadApplication('${app.id}')">Download</button>` : ''}
            </td>
        </tr>
    `).join('');
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    const activeMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'applications': 'My Applications',
            'new-application': 'New Application',
            'profile': 'My Profile',
            'settings': 'Settings'
        };
        pageTitle.textContent = titles[sectionId] || 'Dashboard';
    }
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showMessage('error', 'Error', 'Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('error', 'Error', 'Please enter a valid email address');
        return;
    }
    
    // Simulate form submission
    showMessage('success', 'Message Sent!', 'Thank you for your message. We will get back to you soon.');
    e.target.reset();
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function showLoading(show) {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (show) {
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'block';
            button.disabled = true;
        } else {
            if (btnText) btnText.style.display = 'block';
            if (btnLoader) btnLoader.style.display = 'none';
            button.disabled = false;
        }
    });
}

function showMessage(type, title, text) {
    const overlay = document.getElementById('messageOverlay');
    const icon = document.getElementById('messageIcon');
    const titleElement = document.getElementById('messageTitle');
    const textElement = document.getElementById('messageText');
    
    if (overlay && icon && titleElement && textElement) {
        // Update message content
        titleElement.textContent = title;
        textElement.textContent = text;
        
        // Update icon based on type
        icon.className = type === 'success' ? 'fas fa-check-circle success' : 'fas fa-exclamation-circle error';
        
        // Show overlay
        overlay.style.display = 'flex';
        
        // Auto-hide after 5 seconds (except for login success which redirects)
        if (type !== 'success' || !text.includes('Redirecting')) {
            setTimeout(() => {
                closeMessage();
            }, 5000);
        }
    }
}

function closeMessage() {
    const overlay = document.getElementById('messageOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function updatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!passwordInput || !strengthFill || !strengthText) return;
    
    const password = passwordInput.value;
    let strength = 0;
    let strengthLabel = 'Password strength';
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    strengthFill.className = 'strength-fill';
    
    if (strength >= 75) {
        strengthFill.classList.add('very-strong');
        strengthLabel = 'Very Strong';
    } else if (strength >= 50) {
        strengthFill.classList.add('strong');
        strengthLabel = 'Strong';
    } else if (strength >= 25) {
        strengthFill.classList.add('medium');
        strengthLabel = 'Medium';
    } else if (password.length > 0) {
        strengthFill.classList.add('weak');
        strengthLabel = 'Weak';
    }
    
    strengthText.textContent = strengthLabel;
}

function checkAuthStatus() {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('Checking auth status - loggedIn:', loggedIn, 'user:', user);
    
    if (loggedIn && user.id) {
        isLoggedIn = true;
        currentUser = user;
        console.log('User authenticated:', currentUser.firstName, currentUser.lastName);
    } else {
        console.log('User not authenticated');
    }
}

function handleLogout() {
    // Clear user session
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    currentUser = null;
    isLoggedIn = false;
    
    // Redirect to login page
    window.location.href = 'login.html';
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function filterApplications() {
    const statusFilter = document.getElementById('statusFilter');
    const selectedStatus = statusFilter.value;
    
    const rows = document.querySelectorAll('.applications-table tbody tr');
    rows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
        
        if (selectedStatus === 'all' || status === selectedStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewApplication(applicationId) {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
        showMessage('info', 'Application Details', `Application ${applicationId} - ${application.type} - Status: ${application.status}`);
    }
}

function downloadApplication(applicationId) {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
        showMessage('success', 'Download Started', `Downloading ${application.type} document...`);
        
        // Simulate download
        setTimeout(() => {
            showMessage('success', 'Download Complete', 'Your document has been downloaded successfully.');
        }, 2000);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Application submission handlers
function submitApplication(type) {
    if (!isLoggedIn) {
        showMessage('error', 'Login Required', 'Please log in to submit an application.');
        return;
    }
    
    const newApplication = {
        id: type.substring(0, 2).toUpperCase() + String(Date.now()).slice(-3),
        type: type,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        userId: currentUser.id
    };
    
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    showMessage('success', 'Application Submitted', 'Your application has been submitted successfully.');
    
    // Update dashboard
    updateDashboardStats();
    updateApplicationsTable();
    
    // Show applications section
    showSection('applications');
}

// Add click handlers for application type cards
document.addEventListener('DOMContentLoaded', function() {
    const applicationCards = document.querySelectorAll('.application-type-card');
    applicationCards.forEach(card => {
        const button = card.querySelector('.btn-primary');
        if (button) {
            button.addEventListener('click', function() {
                const type = card.getAttribute('data-type');
                if (type) {
                    submitApplication(type);
                }
            });
        }
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for buttons
function addLoadingAnimation(button) {
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    return function removeLoading() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Form validation helpers
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    const errorElement = input.parentElement.querySelector('.error-message') || 
                        input.parentElement.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    input.classList.add('error');
}

function clearFieldError(input) {
    const errorElement = input.parentElement.querySelector('.error-message') || 
                        input.parentElement.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    input.classList.remove('error');
}

// Sidebar Navigation Functions
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('closed');
}

function showSection(sectionName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked nav item
    event.target.closest('.nav-item').classList.add('active');
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        'dashboard': 'Dashboard',
        'documents': 'Request Document',
        'tracking': 'Track Order',
        'history': 'Order History',
        'profile': 'Edit Profile'
    };
    
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || 'Dashboard';
    }
    
    // Handle section-specific actions
    switch(sectionName) {
        case 'documents':
            openDocumentRequest();
            break;
        case 'tracking':
            openOrderTracking();
            break;
        case 'history':
            window.location.href = 'order-history.html';
            break;
        case 'profile':
            window.location.href = 'profile.html';
            break;
        case 'dashboard':
        default:
            // Show dashboard content (already visible)
            break;
    }
}

// Menu Page Functions
function initMenuPage() {
    // Check authentication status directly from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('Menu page init - loggedIn:', loggedIn, 'user:', user);

    // Collapsible sidebar: start collapsed on desktop
    try {
        const sidebar = document.querySelector('.sidebar');
        const handle = document.querySelector('.sidebar-handle');
        if (sidebar && handle) {
            // Initialize collapsed state (desktop only)
            if (window.innerWidth > 992) {
                sidebar.classList.add('collapsed');
            }

            const expand = () => sidebar.classList.remove('collapsed');
            const collapse = () => { if (window.innerWidth > 992) sidebar.classList.add('collapsed'); };
            handle.addEventListener('mouseenter', expand);
            sidebar.addEventListener('mouseenter', expand);
            sidebar.addEventListener('mouseleave', collapse);
        }
    } catch (e) {
        console.warn('Sidebar collapse init failed:', e);
    }
    
    if (!loggedIn || !user.id) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user account is still active (get latest status from localStorage)
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const latestUser = allUsers.find(u => u.id === user.id);
    if (latestUser && (latestUser.status === 'disabled' || latestUser.status === 'suspended')) {
        console.log('Account is disabled/suspended, logging out');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        alert(`Your account has been ${latestUser.status}. Please contact administrator.`);
        window.location.href = 'login.html';
        return;
    }
    
    // Set global variables
    isLoggedIn = true;
    currentUser = user;
    
    loadUserData();
    loadOrders();
    updateMenuStats();
    loadRecentOrders();
    setupMenuEventListeners();
}

function setupMenuEventListeners() {
    // Notification dropdown (ensure click-through over fixed header)
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationBtn && notificationDropdown) {
        // prevent hover-collapse interfering with clicks
        notificationBtn.addEventListener('mouseenter', () => {
            const sb = document.querySelector('.sidebar');
            if (sb) sb.classList.remove('collapsed');
        });
        notificationBtn.style.pointerEvents = 'auto';
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => notificationDropdown.classList.remove('active'));
    }

    // User dropdown
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('userDropdown');
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (notificationDropdown) notificationDropdown.classList.remove('active');
        if (userDropdown) userDropdown.classList.remove('active');
    });

    // Modal controls
    const documentRequestModal = document.getElementById('documentRequestModal');
    const orderTrackingModal = document.getElementById('orderTrackingModal');
    
    if (documentRequestModal) {
        const modalClose = document.getElementById('modalClose');
        const cancelRequest = document.getElementById('cancelRequest');
        
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (cancelRequest) cancelRequest.addEventListener('click', closeModal);
    }

    if (orderTrackingModal) {
        const trackingModalClose = document.getElementById('trackingModalClose');
        if (trackingModalClose) trackingModalClose.addEventListener('click', closeModal);
    }

    // Document request form
    const documentRequestForm = document.getElementById('documentRequestForm');
    if (documentRequestForm) {
        documentRequestForm.addEventListener('submit', handleDocumentRequest);
    }

    // Mark all notifications as read
    const markAllRead = document.getElementById('markAllRead');
    if (markAllRead) {
        markAllRead.addEventListener('click', markAllNotificationsRead);
    }

    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Admin dashboard event listeners
    setupAdminEventListeners();
}

function loadOrders() {
    orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    if (orders.length === 0) {
        // Create sample orders
        orders = [
            {
                id: 'ORD001',
                type: 'Barangay Clearance',
                status: 'processing',
                date: '2024-03-15',
                deliveryMethod: 'pickup',
                assignedPerson: 'Juan Dela Cruz',
                assignedPhone: '+63 912 345 6789',
                userId: 'user-001',
                trackingNumber: 'TRK001'
            },
            {
                id: 'ORD002',
                type: 'Certificate of Residency',
                status: 'ready',
                date: '2024-03-12',
                deliveryMethod: 'delivery',
                assignedPerson: 'Maria Santos',
                assignedPhone: '+63 912 345 6790',
                userId: 'user-001',
                trackingNumber: 'TRK002'
            },
            {
                id: 'ORD003',
                type: 'Certificate of Indigency',
                status: 'in-delivery',
                date: '2024-03-10',
                deliveryMethod: 'delivery',
                assignedPerson: 'Pedro Garcia',
                assignedPhone: '+63 912 345 6791',
                userId: 'user-001',
                trackingNumber: 'TRK003'
            }
        ];
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

function updateMenuStats() {
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    const totalOrders = userOrders.length;
    const pendingOrders = userOrders.filter(order => order.status === 'pending' || order.status === 'processing').length;
    const deliveryOrders = userOrders.filter(order => order.status === 'in-delivery').length;

    const totalOrdersEl = document.getElementById('totalOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    const deliveryOrdersEl = document.getElementById('deliveryOrders');

    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (deliveryOrdersEl) deliveryOrdersEl.textContent = deliveryOrders;
}

function loadRecentOrders() {
    const recentOrdersList = document.getElementById('recentOrdersList');
    if (!recentOrdersList) return;

    const userOrders = orders.filter(order => order.userId === currentUser.id)
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 3);

    recentOrdersList.innerHTML = userOrders.map(order => `
        <div class="order-item" onclick="viewOrderDetails('${order.id}')">
            <div class="order-info">
                <h3>${order.type}</h3>
                <p><strong>Order #${order.id}</strong> • ${formatDate(order.date)}</p>
                <p><i class="fas fa-user"></i> ${order.assignedPerson}</p>
                <p><i class="fas fa-barcode"></i> ${order.trackingNumber}</p>
            </div>
            <div class="order-status status-${order.status}">
                <i class="fas fa-${getStatusIcon(order.status)}"></i>
                <span>${getStatusText(order.status)}</span>
            </div>
        </div>
    `).join('');
}

function getStatusIcon(status) {
    const icons = {
        'pending': 'clock',
        'processing': 'cog',
        'ready': 'check-circle',
        'in-delivery': 'truck',
        'delivered': 'check-double',
        'cancelled': 'times-circle'
    };
    return icons[status] || 'clock';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pending',
        'processing': 'Processing',
        'ready': 'Ready',
        'in-delivery': 'In Delivery',
        'delivered': 'Delivered',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return texts[status] || 'Unknown';
}

function getUserStatusText(status) {
    const texts = {
        'active': 'Active',
        'suspended': 'Suspended',
        'disabled': 'Disabled'
    };
    return texts[status] || 'Active';
}

// Order History Page Functions
function initOrderHistoryPage() {
    // Check authentication status directly from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('Order history page init - loggedIn:', loggedIn, 'user:', user);
    
    if (!loggedIn || !user.id) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user account is still active (get latest status from localStorage)
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const latestUser = allUsers.find(u => u.id === user.id);
    if (latestUser && (latestUser.status === 'disabled' || latestUser.status === 'suspended')) {
        console.log('Account is disabled/suspended, logging out');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        alert(`Your account has been ${latestUser.status}. Please contact administrator.`);
        window.location.href = 'login.html';
        return;
    }
    
    // Set global variables
    isLoggedIn = true;
    currentUser = user;
    
    loadUserData();
    loadOrders();
    updateHistoryStats();
    loadOrdersList();
    setupHistoryEventListeners();
}

function setupHistoryEventListeners() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const searchOrders = document.getElementById('searchOrders');
    const orderDetailsClose = document.getElementById('orderDetailsClose');

    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
    if (dateFilter) {
        dateFilter.addEventListener('change', filterOrders);
    }
    if (searchOrders) {
        searchOrders.addEventListener('input', filterOrders);
    }
    if (orderDetailsClose) {
        orderDetailsClose.addEventListener('click', closeModal);
    }
}

function updateHistoryStats() {
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    const totalOrders = userOrders.length;
    const pendingOrders = userOrders.filter(order => order.status === 'pending' || order.status === 'processing').length;
    // Count both 'delivered' and 'completed' as finished orders
    const completedOrders = userOrders.filter(order => order.status === 'delivered' || order.status === 'completed').length;
    const deliveryOrders = userOrders.filter(order => order.status === 'in-delivery').length;

    const totalOrdersEl = document.getElementById('totalOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    const completedOrdersEl = document.getElementById('completedOrders');
    const deliveryOrdersEl = document.getElementById('deliveryOrders');

    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
    if (deliveryOrdersEl) deliveryOrdersEl.textContent = deliveryOrders;
}

function loadOrdersList() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    const userOrders = orders.filter(order => order.userId === currentUser.id)
                            .sort((a, b) => new Date(b.date) - new Date(a.date));

    ordersList.innerHTML = userOrders.map(order => `
        <div class="order-item" onclick="viewOrderDetails('${order.id}')">
            <div class="order-info">
                <h3>${order.type}</h3>
                <p><strong>Order #${order.id}</strong> • ${formatDate(order.date)}</p>
                <p><i class="fas fa-user"></i> Assigned to: ${order.assignedPerson}</p>
                <p><i class="fas fa-phone"></i> ${order.assignedPhone}</p>
                <p><i class="fas fa-truck"></i> ${order.deliveryMethod === 'pickup' ? 'Pick up at Barangay Hall' : 'Home Delivery'}</p>
                <p><i class="fas fa-barcode"></i> Tracking: ${order.trackingNumber}</p>
            </div>
            <div class="order-status status-${order.status}">
                <i class="fas fa-${getStatusIcon(order.status)}"></i>
                <span>${getStatusText(order.status)}</span>
            </div>
        </div>
    `).join('');
}

function filterOrders() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const searchOrders = document.getElementById('searchOrders');
    
    const selectedStatus = statusFilter ? statusFilter.value : 'all';
    const selectedDate = dateFilter ? dateFilter.value : 'all';
    const searchTerm = searchOrders ? searchOrders.value.toLowerCase() : '';

    let filteredOrders = orders.filter(order => order.userId === currentUser.id);

    // Filter by status
    if (selectedStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === selectedStatus);
    }

    // Filter by date
    if (selectedDate !== 'all') {
        const now = new Date();
        filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.date);
            switch (selectedDate) {
                case 'today':
                    return orderDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return orderDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return orderDate >= monthAgo;
                case 'year':
                    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    return orderDate >= yearAgo;
                default:
                    return true;
            }
        });
    }

    // Filter by search term
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.type.toLowerCase().includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm)
        );
    }

    // Update the display
    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.innerHTML = filteredOrders.map(order => `
            <div class="order-item" onclick="viewOrderDetails('${order.id}')">
                <div class="order-info">
                    <h3>${order.type}</h3>
                    <p>Order #${order.id} • ${formatDate(order.date)}</p>
                    <p>Assigned to: ${order.assignedPerson}</p>
                </div>
                <div class="order-status status-${order.status}">
                    <i class="fas fa-${getStatusIcon(order.status)}"></i>
                    <span>${getStatusText(order.status)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Profile Page Functions
function initProfilePage() {
    // Check authentication status directly from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('Profile page init - loggedIn:', loggedIn, 'user:', user);
    
    if (!loggedIn || !user.id) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user account is still active (get latest status from localStorage)
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const latestUser = allUsers.find(u => u.id === user.id);
    if (latestUser && (latestUser.status === 'disabled' || latestUser.status === 'suspended')) {
        console.log('Account is disabled/suspended, logging out');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        alert(`Your account has been ${latestUser.status}. Please contact administrator.`);
        window.location.href = 'login.html';
        return;
    }
    
    // Set global variables
    isLoggedIn = true;
    currentUser = user;
    
    loadUserData();
    loadProfileData();
    setupProfileEventListeners();
}

function setupProfileEventListeners() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Password strength indicator
    const newPassword = document.getElementById('newPassword');
    if (newPassword) {
        newPassword.addEventListener('input', updatePasswordStrength);
    }
}

function loadProfileData() {
    if (!currentUser) return;

    // Populate form fields
    const fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'address', 'barangay', 'city', 'province', 'zipCode'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && currentUser[field]) {
            element.value = currentUser[field];
        }
    });

    // Update profile display
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }

    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = currentUser.email;
    }

    const profilePhone = document.getElementById('profilePhone');
    if (profilePhone) {
        profilePhone.textContent = currentUser.phone;
    }

    // Load profile image
    const profileImage = document.getElementById('profileImage');
    const defaultIcon = document.getElementById('defaultIcon');
    
    if (profileImage && defaultIcon) {
        if (currentUser.profileImage) {
            profileImage.src = currentUser.profileImage;
            profileImage.style.display = 'block';
            defaultIcon.style.display = 'none';
        } else {
            profileImage.style.display = 'none';
            defaultIcon.style.display = 'block';
        }
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedData = {};
    
    // Collect form data
    const fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'address', 'barangay', 'city', 'province', 'zipCode'];
    fields.forEach(field => {
        const value = formData.get(field);
        if (value) {
            updatedData[field] = value;
        }
    });

    // Handle password change
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
            showMessage('error', 'Error', 'New passwords do not match');
            return;
        }
        if (currentPassword !== currentUser.password) {
            showMessage('error', 'Error', 'Current password is incorrect');
            return;
        }
        updatedData.password = newPassword;
    }

    // Update user data
    Object.assign(currentUser, updatedData);
    
    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    showMessage('success', 'Profile Updated', 'Your profile has been updated successfully');
}

// Notification System
function loadNotifications() {
    notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    if (notifications.length === 0) {
        // Create sample notifications
        notifications = [
            {
                id: 1,
                title: 'Order Status Update',
                message: 'Your Barangay Clearance order #ORD001 is now being processed',
                time: '2 hours ago',
                read: false,
                type: 'order'
            },
            {
                id: 2,
                title: 'Delivery Assigned',
                message: 'Juan Dela Cruz has been assigned to deliver your order',
                time: '1 day ago',
                read: false,
                type: 'delivery'
            },
            {
                id: 3,
                title: 'Document Ready',
                message: 'Your Certificate of Residency is ready for pickup',
                time: '2 days ago',
                read: true,
                type: 'ready'
            }
        ];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    
    updateNotificationDisplay();
}

function updateNotificationDisplay() {
    const notificationCount = document.getElementById('notificationCount');
    const notificationList = document.getElementById('notificationList');
    
    if (notificationCount) {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    
    if (notificationList) {
        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" onclick="markNotificationRead(${notification.id})">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `).join('');
    }
}

function markNotificationRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateNotificationDisplay();
    }
}

function markAllNotificationsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationDisplay();
}

// Document Request Functions
function openDocumentRequest() {
    const modal = document.getElementById('documentRequestModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function openOrderTracking() {
    const modal = document.getElementById('orderTrackingModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function openOrderHistory() {
    window.location.href = 'order-history.html';
}

function openProfile() {
    window.location.href = 'profile.html';
}

function requestDocument(type) {
    const modal = document.getElementById('documentRequestModal');
    const documentType = document.getElementById('documentType');
    
    if (documentType) {
        documentType.value = type;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function handleDocumentRequest(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        id: 'ORD' + String(Date.now()).slice(-3),
        type: formData.get('documentType'),
        purpose: formData.get('purpose'),
        deliveryMethod: formData.get('deliveryMethod'),
        deliveryAddress: formData.get('deliveryAddress'),
        contactNumber: formData.get('contactNumber'),
        preferredDate: formData.get('preferredDate'),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        userId: currentUser.id,
        trackingNumber: 'TRK' + String(Date.now()).slice(-3),
        assignedPerson: 'TBD',
        assignedPhone: 'TBD'
    };
    
    console.log('Document request submitted:', orderData);
    
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Add notification
    const notification = {
        id: Date.now(),
        title: 'Order Submitted',
        message: `Your ${orderData.type} request has been submitted successfully`,
        time: 'Just now',
        read: false,
        type: 'order'
    };
    notifications.unshift(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationDisplay();
    
    closeModal();
    showMessage('success', 'Order Submitted', 'Your document request has been submitted successfully');
    
    // Update stats and recent orders
    updateMenuStats();
    loadRecentOrders();
}

function trackOrder() {
    const trackingNumber = document.getElementById('orderTrackingNumber').value;
    const trackingResult = document.getElementById('trackingResult');
    
    if (!trackingNumber) {
        showMessage('error', 'Error', 'Please enter a tracking number');
        return;
    }
    
    const order = orders.find(o => o.trackingNumber === trackingNumber || o.id === trackingNumber);
    
    if (!order) {
        trackingResult.innerHTML = '<p>Order not found. Please check your tracking number.</p>';
        trackingResult.classList.add('active');
        return;
    }
    
    const steps = [
        { name: 'Order Submitted', status: 'completed' },
        { name: 'Under Review', status: order.status === 'pending' ? 'current' : 'completed' },
        { name: 'Processing', status: order.status === 'processing' ? 'current' : (['ready', 'in-delivery', 'delivered'].includes(order.status) ? 'completed' : 'pending') },
        { name: 'Ready for Pickup/Delivery', status: order.status === 'ready' ? 'current' : (['in-delivery', 'delivered'].includes(order.status) ? 'completed' : 'pending') },
        { name: 'In Delivery', status: order.status === 'in-delivery' ? 'current' : (order.status === 'delivered' ? 'completed' : 'pending') },
        { name: 'Delivered', status: order.status === 'delivered' ? 'current' : 'pending' }
    ];
    
    trackingResult.innerHTML = `
        <h3>Order #${order.id} - ${order.type}</h3>
        <p><strong>Status:</strong> ${getStatusText(order.status)}</p>
        <p><strong>Assigned to:</strong> ${order.assignedPerson}</p>
        <p><strong>Contact:</strong> ${order.assignedPhone}</p>
        <div class="tracking-steps">
            ${steps.map(step => `
                <div class="tracking-step ${step.status}">
                    <div class="tracking-step-icon">
                        <i class="fas fa-${getStatusIcon(step.status === 'completed' ? 'check' : step.status === 'current' ? 'clock' : 'circle')}"></i>
                    </div>
                    <div>
                        <div class="step-name">${step.name}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    trackingResult.classList.add('active');
}

function viewOrderDetails(orderId) {
    console.log('viewOrderDetails called with orderId:', orderId);
    // Convert orderId to string for comparison since IDs might be stored as numbers
    const orderIdStr = String(orderId);
    const order = orders.find(o => String(o.id) === orderIdStr);
    if (!order) {
        console.log('Order not found:', orderId);
        console.log('Available order IDs:', orders.map(o => o.id));
        return;
    }
    console.log('Order found:', order);
    
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    
    if (modal && content) {
        // Only populate the content, don't recreate the modal structure
        content.innerHTML = `
            <div class="order-details">
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <div class="order-status-badge status-${order.status}">
                        <i class="fas fa-${getStatusIcon(order.status)}"></i>
                        <span>${getStatusText(order.status)}</span>
                    </div>
                </div>
                
                <div class="order-info-grid">
                    <div class="info-section">
                        <h4><i class="fas fa-file-alt"></i> Document Information</h4>
                        <div class="info-item">
                            <label>Document Type</label>
                            <span>${order.type}</span>
                        </div>
                        <div class="info-item">
                            <label>Order Date</label>
                            <span>${formatDate(order.date)}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-truck"></i> Delivery Information</h4>
                        <div class="info-item">
                            <label>Delivery Method</label>
                            <span>${order.deliveryMethod === 'pickup' ? 'Pick up at Barangay Hall' : 'Home Delivery'}</span>
                        </div>
                        <div class="info-item">
                            <label>Tracking Number</label>
                            <span class="tracking-number">${order.trackingNumber}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-user"></i> Assigned Personnel</h4>
                        <div class="info-item">
                            <label>Assigned Person</label>
                            <span>${order.assignedPerson}</span>
                        </div>
                        <div class="info-item">
                            <label>Contact Number</label>
                            <span>${order.assignedPhone}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('active');
        
        // Add event listener for close button after modal is shown
        setTimeout(() => {
            const closeBtn = document.getElementById('orderDetailsClose');
            if (closeBtn) {
                closeBtn.onclick = () => closeModal();
            }
        }, 100);
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
}

function goBack() {
    window.history.back();
}

function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        goBack();
    }
}

function saveProfile() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.dispatchEvent(new Event('submit'));
    }
}

function changeProfilePicture() {
    // Trigger the hidden file input
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showMessage('Please select a valid image file.', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage('Image size must be less than 5MB.', 'error');
            return;
        }
        
        // Create a FileReader to preview the image
        const reader = new FileReader();
        reader.onload = function(e) {
            const profileImage = document.getElementById('profileImage');
            const defaultIcon = document.getElementById('defaultIcon');
            
            if (profileImage && defaultIcon) {
                profileImage.src = e.target.result;
                profileImage.style.display = 'block';
                defaultIcon.style.display = 'none';
                
                // Save the image to localStorage
                currentUser.profileImage = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showMessage('Profile picture updated successfully!', 'success');
            }
        };
        reader.readAsDataURL(file);
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.parentElement.querySelector('.password-toggle i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .animate {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .sidebar.active {
        transform: translateX(0);
    }
    
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);

// ==================== ADMIN FUNCTIONS ====================

// Admin Login Functions
function initAdminLoginPage() {
    console.log('Admin login page initialized');
    
    // Check if already logged in as admin
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (adminLoggedIn) {
        window.location.href = 'admin-dashboard.html';
        return;
    }
    
    // Test form submission
    const form = document.getElementById('adminLoginForm');
    if (form) {
        console.log('Admin login form found');
    } else {
        console.log('Admin login form NOT found');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    console.log('Admin login form submitted');
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    console.log('Username:', username, 'Password:', password);
    
    // Pre-created admin credentials
    if (username === 'admin' && password === 'admin123') {
        console.log('Credentials match! Proceeding with login...');
        
        // Set admin session
        isAdminLoggedIn = true;
        adminUser = {
            id: 'admin-001',
            username: 'admin',
            role: 'administrator',
            name: 'System Administrator'
        };
        
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        console.log('Admin session set, showing success message...');
        showMessage('success', 'Success!', 'Login successful! Redirecting to admin dashboard...');
        
        console.log('Setting redirect timeout...');
        setTimeout(() => {
            console.log('Redirecting to admin dashboard...');
            try {
                window.location.href = 'admin-dashboard.html';
            } catch (error) {
                console.error('Redirect failed:', error);
                alert('Redirect failed. Please manually navigate to admin-dashboard.html');
            }
        }, 1500);
    } else {
        console.log('Invalid credentials - Username:', username, 'Password:', password);
        console.log('Username match:', username === 'admin');
        console.log('Password match:', password === 'admin123');
        showMessage('error', 'Error!', 'Invalid admin credentials!');
    }
}

// Test function for debugging
function testAdminLogin() {
    console.log('Test admin login clicked');
    
    // Set admin session directly
    isAdminLoggedIn = true;
    adminUser = {
        id: 'admin-001',
        username: 'admin',
        role: 'administrator',
        name: 'System Administrator'
    };
    
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    
    showMessage('success', 'Success!', 'Test login successful! Redirecting to admin dashboard...');
    
    setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
    }, 1500);
}

// Admin Dashboard Functions
function initAdminDashboardPage() {
    // Check admin authentication
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    if (!adminLoggedIn || !admin.id) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    isAdminLoggedIn = true;
    adminUser = admin;
    
    // Load data
    console.log('Loading users...');
    loadUsers();
    console.log('Users loaded:', users.length);
    
    console.log('Loading orders...');
    loadOrders();
    console.log('Orders loaded:', orders.length);
    
    console.log('Loading personnel...');
    loadPersonnel();
    console.log('Personnel loaded:', personnel.length);
    
    console.log('Loading pricing...');
    loadPricing();
    console.log('Pricing loaded');
    
    // Initialize dashboard
    console.log('Updating admin stats...');
    updateAdminStats();
    
    console.log('Loading orders table...');
    loadOrdersTable();
    
    console.log('Loading users table...');
    loadUsersTable();
    
    console.log('Loading personnel list...');
    loadPersonnelList();
    
    // Setup event listeners
    console.log('Setting up admin event listeners...');
    setupAdminEventListeners();
    
    // Debug: Check if functions are available
    console.log('Functions available:', {
        viewOrderDetails: typeof viewOrderDetails,
        openOrderActions: typeof openOrderActions,
        viewUserDetails: typeof viewUserDetails,
        openUserActions: typeof openUserActions
    });
    
    // Make functions globally accessible
    window.viewOrderDetails = viewOrderDetails;
    window.openOrderActions = openOrderActions;
    window.viewUserDetails = viewUserDetails;
    window.openUserActions = openUserActions;
    window.updateOrder = updateOrder;
    window.updateUser = updateUser;
    window.deleteUser = deleteUser;
    window.closeModal = closeModal;
    window.testAdminFunctions = testAdminFunctions;
    window.testButtons = testButtons;
    window.refreshData = refreshData;
    window.fixUserIds = fixUserIds;
    window.addNewPersonnel = addNewPersonnel;
    window.toggleSidebar = toggleSidebar;
    window.showSection = showSection;
}

function setupAdminEventListeners() {
    // Order filters
    const statusFilter = document.getElementById('statusFilter');
    const searchOrders = document.getElementById('searchOrders');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAdminOrders);
    }
    
    if (searchOrders) {
        searchOrders.addEventListener('input', filterAdminOrders);
    }
    
    // User search
    const searchUsers = document.getElementById('searchUsers');
    if (searchUsers) {
        searchUsers.addEventListener('input', filterUsers);
    }
    
    // Modal close buttons
    const orderDetailsClose = document.getElementById('orderDetailsClose');
    const orderActionsClose = document.getElementById('orderActionsClose');
    const userActionsClose = document.getElementById('userActionsClose');
    
    if (orderDetailsClose) {
        orderDetailsClose.addEventListener('click', closeModal);
    }
    if (orderActionsClose) {
        orderActionsClose.addEventListener('click', closeModal);
    }
    if (userActionsClose) {
        userActionsClose.addEventListener('click', closeModal);
    }
    
    // Event delegation for dynamically created buttons
    document.addEventListener('click', function(e) {
        console.log('=== CLICK EVENT DETECTED ===');
        console.log('Target element:', e.target);
        console.log('Target tagName:', e.target.tagName);
        console.log('Target classes:', e.target.className);
        console.log('Target parent:', e.target.parentElement);
        
        // Check if it's a button or icon inside a button
        let button = e.target;
        if (e.target.tagName === 'I') {
            button = e.target.closest('button');
            console.log('Icon clicked, found button:', button);
        }
        
        if (!button || button.tagName !== 'BUTTON') {
            console.log('No button found');
            return;
        }
        
        console.log('Button found:', button);
        console.log('Button classes:', button.className);
        console.log('Button data-action:', button.getAttribute('data-action'));
        
        const action = button.getAttribute('data-action');
        if (!action) {
            console.log('No data-action attribute found');
            return;
        }
        
        console.log('Button clicked with action:', action);
        
        // Order action buttons
        if (action === 'view-order') {
            const orderId = button.getAttribute('data-order-id');
            console.log('Order details clicked for:', orderId);
            viewOrderDetails(orderId);
        }
        
        if (action === 'manage-order') {
            const orderId = button.getAttribute('data-order-id');
            console.log('Order actions clicked for:', orderId);
            openOrderActions(orderId);
        }
        
        // User action buttons
        if (action === 'view-user') {
            const userId = button.getAttribute('data-user-id');
            console.log('User details clicked for:', userId);
            viewUserDetails(userId);
        }
        
        if (action === 'manage-user') {
            const userId = button.getAttribute('data-user-id');
            console.log('User actions clicked for:', userId);
            openUserActions(userId);
        }
    });
}

function loadUsers() {
    users = JSON.parse(localStorage.getItem('users') || '[]');
    
    console.log('Loaded users from localStorage:', users);
    
    // Fix users with undefined status
    users.forEach(user => {
        if (!user.status || user.status === 'undefined') {
            user.status = 'active';
        }
    });
    
    // If no users exist, create sample users
    if (users.length === 0) {
        users = [
            {
                id: 'user-001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+63 912 345 6789',
                password: 'password123',
                status: 'active',
                registrationDate: new Date().toISOString(),
                address: '123 Main St, Barangay 1',
                barangay: 'Barangay 1',
                city: 'Sample City',
                province: 'Sample Province',
                zipCode: '1234',
                birthDate: '1990-01-01',
                gender: 'male'
            },
            {
                id: 'user-002',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@email.com',
                phone: '+63 912 345 6790',
                password: 'password123',
                status: 'active',
                registrationDate: new Date().toISOString(),
                address: '456 Oak Ave, Barangay 2',
                barangay: 'Barangay 2',
                city: 'Sample City',
                province: 'Sample Province',
                zipCode: '1234',
                birthDate: '1985-05-15',
                gender: 'female'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function loadPersonnel() {
    personnel = JSON.parse(localStorage.getItem('personnel') || '[]');
    
    // If no personnel exist, create sample personnel
    if (personnel.length === 0) {
        personnel = [
            {
                id: 'personnel-001',
                name: 'Juan Dela Cruz',
                phone: '+63 912 345 6789',
                status: 'active'
            },
            {
                id: 'personnel-002',
                name: 'Maria Santos',
                phone: '+63 912 345 6790',
                status: 'active'
            },
            {
                id: 'personnel-003',
                name: 'Pedro Garcia',
                phone: '+63 912 345 6791',
                status: 'active'
            },
            {
                id: 'personnel-004',
                name: 'Ana Rodriguez',
                phone: '+63 912 345 6792',
                status: 'active'
            }
        ];
        localStorage.setItem('personnel', JSON.stringify(personnel));
    }
    
    console.log('Personnel loaded:', personnel.length, 'members');
}

// Function to fix user ID mismatches
function fixUserIds() {
    console.log('=== FIXING USER IDs ===');
    console.log('Current users:', users);
    
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('All users in localStorage:', allUsers);
    
    // Update the global users array with all users from localStorage
    users = allUsers;
    
    // Fix users with undefined status
    users.forEach(user => {
        if (!user.status || user.status === 'undefined') {
            user.status = 'active';
        }
    });
    
    console.log('Fixed users:', users);
    console.log('User IDs after fix:', users.map(u => u.id));
}

function loadPricing() {
    const savedPricing = localStorage.getItem('pricing');
    if (savedPricing) {
        pricing = JSON.parse(savedPricing);
    }
    
    // Update pricing inputs
    const priceBarangay = document.getElementById('priceBarangayClearance');
    const priceIndigency = document.getElementById('priceCertificateIndigency');
    const priceResidency = document.getElementById('priceCertificateResidency');
    
    if (priceBarangay) priceBarangay.value = pricing['barangay-clearance'];
    if (priceIndigency) priceIndigency.value = pricing['certificate-of-indigency'];
    if (priceResidency) priceResidency.value = pricing['certificate-of-residency'];
}

function updateAdminStats() {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const totalUsers = users.length;
    
    const totalOrdersEl = document.getElementById('totalOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    const completedOrdersEl = document.getElementById('completedOrders');
    const totalUsersEl = document.getElementById('totalUsers');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
}

function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => {
        const user = users.find(u => u.id === order.userId);
        const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${userName}</td>
                <td>${order.type}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>₱${order.price || '0'}</td>
                <td>${order.assignedPerson || 'Not Assigned'}</td>
                <td>${formatDate(order.date)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" data-action="view-order" data-order-id="${order.id}" title="View Details" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" data-action="manage-order" data-order-id="${order.id}" title="Manage Order" style="margin-left: 5px;" onclick="openOrderActions('${order.id}')">
                        <i class="fas fa-cog"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><span class="status-badge status-${user.status}">${getUserStatusText(user.status)}</span></td>
            <td>${formatDate(user.registrationDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" data-action="view-user" data-user-id="${user.id}" title="View Details" onclick="viewUserDetails('${user.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-secondary" data-action="manage-user" data-user-id="${user.id}" title="Manage User" style="margin-left: 5px;" onclick="openUserActions('${user.id}')">
                    <i class="fas fa-cog"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterAdminOrders() {
    const statusFilter = document.getElementById('statusFilter');
    const searchOrders = document.getElementById('searchOrders');
    
    if (!statusFilter || !searchOrders) return;
    
    const status = statusFilter.value;
    const searchTerm = searchOrders.value.toLowerCase();
    
    const filteredOrders = orders.filter(order => {
        const user = users.find(u => u.id === order.userId);
        const userName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : '';
        const matchesStatus = !status || order.status === status;
        const matchesSearch = !searchTerm || 
            order.id.toLowerCase().includes(searchTerm) ||
            order.type.toLowerCase().includes(searchTerm) ||
            userName.includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });
    
    // Update table with filtered results
    const tbody = document.getElementById('ordersTableBody');
    if (tbody) {
        tbody.innerHTML = filteredOrders.map(order => {
            const user = users.find(u => u.id === order.userId);
            const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
            
            return `
                <tr>
                    <td>${order.id}</td>
                    <td>${userName}</td>
                    <td>${order.type}</td>
                    <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                    <td>₱${order.price || '0'}</td>
                    <td>${order.assignedPerson || 'Not Assigned'}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" data-action="view-order" data-order-id="${order.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" data-action="manage-order" data-order-id="${order.id}">
                            <i class="fas fa-cog"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function filterUsers() {
    const searchUsers = document.getElementById('searchUsers');
    if (!searchUsers) return;
    
    const searchTerm = searchUsers.value.toLowerCase();
    
    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchTerm) ||
               user.email.toLowerCase().includes(searchTerm) ||
               user.phone.includes(searchTerm);
    });
    
    // Update table with filtered results
    const tbody = document.getElementById('usersTableBody');
    if (tbody) {
        tbody.innerHTML = filteredUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewUserDetails('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="openUserActions('${user.id}')">
                        <i class="fas fa-cog"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function openOrderActions(orderId) {
    console.log('openOrderActions called with orderId:', orderId);
    // Convert orderId to string for comparison since IDs might be stored as numbers
    const orderIdStr = String(orderId);
    const order = orders.find(o => String(o.id) === orderIdStr);
    if (!order) {
        console.log('Order not found:', orderId);
        console.log('Available order IDs:', orders.map(o => o.id));
        console.log('Looking for ID:', orderId, 'Type:', typeof orderId);
        console.log('Converted to string:', orderIdStr);
        return;
    }
    console.log('Order found:', order);
    
    const modal = document.getElementById('orderActionsModal');
    const content = document.getElementById('orderActionsContent');
    
    console.log('Modal element:', modal);
    console.log('Content element:', content);
    
    if (modal && content) {
        content.innerHTML = `
            <div class="order-actions-form">
                <h3>Manage Order: ${order.id}</h3>
                
                <div class="form-group">
                    <label>Status</label>
                    <select id="orderStatus" class="form-control">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                        <option value="in-delivery" ${order.status === 'in-delivery' ? 'selected' : ''}>In Delivery</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Price (PHP)</label>
                    <input type="number" id="orderPrice" class="form-control" value="${order.price || ''}" min="0">
                </div>
                
                <div class="form-group">
                    <label>Assign Personnel</label>
                    <select id="assignedPersonnel" class="form-control">
                        <option value="">Select Personnel</option>
                        ${personnel.filter(p => p.status === 'active').map(p => 
                            `<option value="${p.id}" ${order.assignedPersonId === p.id ? 'selected' : ''}>${p.name} (${p.phone})</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Special Instructions</label>
                    <textarea id="specialInstructions" class="form-control" rows="3" placeholder="Add any special delivery instructions...">${order.specialInstructions || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="updateOrder('${orderId}')">
                        <i class="fas fa-save"></i>
                        Update Order
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }
}

function viewUserDetails(userId) {
    // Convert userId to string for comparison since IDs might be stored as numbers
    const userIdStr = String(userId);
    const user = users.find(u => String(u.id) === userIdStr);
    if (!user) {
        console.log('User not found for view:', userId);
        return;
    }
    
    const modal = document.getElementById('orderDetailsModal'); // Reuse the same modal
    const content = document.getElementById('orderDetailsContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="order-details">
                <div class="order-header">
                    <h3>User Details: ${user.firstName} ${user.lastName}</h3>
                    <div class="order-status-badge status-${user.status}">
                        <i class="fas fa-user"></i>
                        <span>${user.status.toUpperCase()}</span>
                    </div>
                </div>
                
                <div class="order-info-grid">
                    <div class="info-section">
                        <h4><i class="fas fa-user"></i> Personal Information</h4>
                        <div class="info-item">
                            <label>Full Name</label>
                            <span>${user.firstName} ${user.lastName}</span>
                        </div>
                        <div class="info-item">
                            <label>Email</label>
                            <span>${user.email}</span>
                        </div>
                        <div class="info-item">
                            <label>Phone</label>
                            <span>${user.phone}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-calendar"></i> Account Information</h4>
                        <div class="info-item">
                            <label>User ID</label>
                            <span>${user.id}</span>
                        </div>
                        <div class="info-item">
                            <label>Registration Date</label>
                            <span>${formatDate(user.registrationDate)}</span>
                        </div>
                        <div class="info-item">
                            <label>Account Status</label>
                            <span class="status-badge status-${user.status}">${user.status.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-map-marker-alt"></i> Address Information</h4>
                        <div class="info-item">
                            <label>Address</label>
                            <span>${user.address || 'Not provided'}</span>
                        </div>
                        <div class="info-item">
                            <label>Barangay</label>
                            <span>${user.barangay || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('active');
        
        // Add event listener for close button
        setTimeout(() => {
            const closeBtn = document.getElementById('orderDetailsClose');
            if (closeBtn) {
                closeBtn.onclick = () => closeModal();
            }
        }, 100);
    }
}

function openUserActions(userId) {
    console.log('openUserActions called with userId:', userId);
    console.log('Available users:', users);
    console.log('User IDs:', users.map(u => u.id));
    
    // Convert userId to string for comparison since IDs might be stored as numbers
    const userIdStr = String(userId);
    const user = users.find(u => String(u.id) === userIdStr);
    if (!user) {
        console.log('User not found:', userId);
        console.log('Available user IDs:', users.map(u => u.id));
        console.log('Looking for ID:', userId, 'Type:', typeof userId);
        console.log('Converted to string:', userIdStr);
        return;
    }
    console.log('User found:', user);
    
    const modal = document.getElementById('userActionsModal');
    const content = document.getElementById('userActionsContent');
    
    console.log('User modal element:', modal);
    console.log('User content element:', content);
    
    if (modal && content) {
        content.innerHTML = `
            <div class="user-actions-form">
                <h3>Manage User: ${user.firstName} ${user.lastName}</h3>
                
                <div class="user-info">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${user.status}">${user.status}</span></p>
                    <p><strong>Registration Date:</strong> ${formatDate(user.registrationDate)}</p>
                </div>
                
                <div class="form-group">
                    <label>Account Status</label>
                    <select id="userStatus" class="form-control">
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                        <option value="disabled" ${user.status === 'disabled' ? 'selected' : ''}>Disabled</option>
                    </select>
                    <small class="form-text text-muted">Change user account status</small>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="updateUser('${userId}')">
                        <i class="fas fa-save"></i>
                        Update User
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser('${userId}')">
                        <i class="fas fa-trash"></i>
                        Delete User
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }
}

function updateOrder(orderId) {
    // Convert orderId to string for comparison since IDs might be stored as numbers
    const orderIdStr = String(orderId);
    const order = orders.find(o => String(o.id) === orderIdStr);
    if (!order) {
        console.log('Order not found for update:', orderId);
        return;
    }
    
    const status = document.getElementById('orderStatus').value;
    const price = document.getElementById('orderPrice').value;
    const assignedPersonnelId = document.getElementById('assignedPersonnel').value;
    const specialInstructions = document.getElementById('specialInstructions').value;
    
    // Update order
    order.status = status;
    order.price = price ? parseFloat(price) : 0;
    order.specialInstructions = specialInstructions;
    
    if (assignedPersonnelId) {
        const personnelMember = personnel.find(p => p.id === assignedPersonnelId);
        if (personnelMember) {
            order.assignedPerson = personnelMember.name;
            order.assignedPersonId = personnelMember.id;
            order.assignedPhone = personnelMember.phone;
        }
    } else {
        // Clear assignment if no personnel selected
        order.assignedPerson = 'TBD';
        order.assignedPersonId = null;
        order.assignedPhone = '';
    }
    
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Add notification for user if status changed
    if (status !== order.status) {
        addOrderStatusNotification(order.userId, orderId, status);
    }
    
    // Update tables
    loadOrdersTable();
    updateAdminStats();
    
    closeModal();
    showMessage('success', 'Success!', 'Order updated successfully!');
}

// Add notification for order status changes
function addOrderStatusNotification(userId, orderId, newStatus) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const statusText = getStatusText(newStatus);
    const notification = {
        id: 'notif-' + Date.now(),
        userId: userId,
        type: 'order_update',
        title: 'Order Status Updated',
        message: `Your order ${orderId} status has been updated to ${statusText}`,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Load existing notifications
    let userNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    userNotifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(userNotifications));
}

function updateUser(userId) {
    // Convert userId to string for comparison since IDs might be stored as numbers
    const userIdStr = String(userId);
    const user = users.find(u => String(u.id) === userIdStr);
    if (!user) {
        console.log('User not found for update:', userId);
        return;
    }
    
    const status = document.getElementById('userStatus').value;
    
    // Update user
    user.status = status;
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update tables
    loadUsersTable();
    updateAdminStats();
    
    closeModal();
    showMessage('success', 'Success!', 'User updated successfully!');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        
        loadUsersTable();
        updateAdminStats();
        closeModal();
        showMessage('User deleted successfully!', 'success');
    }
}

function updatePricing() {
    pricing['barangay-clearance'] = parseFloat(document.getElementById('priceBarangayClearance').value);
    pricing['certificate-of-indigency'] = parseFloat(document.getElementById('priceCertificateIndigency').value);
    pricing['certificate-of-residency'] = parseFloat(document.getElementById('priceCertificateResidency').value);
    
    localStorage.setItem('pricing', JSON.stringify(pricing));
    showMessage('success', 'Success!', 'Pricing updated successfully!');
}

function addPersonnel() {
    const name = prompt('Enter personnel name:');
    const phone = prompt('Enter phone number:');
    
    if (name && phone) {
        const newPersonnel = {
            id: 'personnel-' + Date.now(),
            name: name,
            phone: phone,
            status: 'active'
        };
        
        personnel.push(newPersonnel);
        localStorage.setItem('personnel', JSON.stringify(personnel));
        
        loadPersonnelList();
        showMessage('success', 'Success!', 'Personnel added successfully!');
    }
}

// New function for adding personnel from the form
function addNewPersonnel() {
    const name = document.getElementById('newPersonnelName').value.trim();
    const phone = document.getElementById('newPersonnelPhone').value.trim();
    
    if (!name) {
        showMessage('error', 'Error!', 'Please enter a name');
        return;
    }
    
    if (!phone) {
        showMessage('error', 'Error!', 'Please enter a phone number');
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showMessage('error', 'Error!', 'Please enter a valid phone number');
        return;
    }
    
    const newPersonnel = {
        id: 'personnel-' + Date.now(),
        name: name,
        phone: phone,
        status: 'active'
    };
    
    personnel.push(newPersonnel);
    localStorage.setItem('personnel', JSON.stringify(personnel));
    
    // Clear form
    document.getElementById('newPersonnelName').value = '';
    document.getElementById('newPersonnelPhone').value = '';
    
    loadPersonnelList();
    showMessage('success', 'Success!', 'Personnel added successfully!');
}

function loadPersonnelList() {
    const container = document.getElementById('personnelList');
    if (!container) return;
    
    if (personnel.length === 0) {
        container.innerHTML = '<p class="text-muted">No personnel added yet.</p>';
        return;
    }
    
    container.innerHTML = personnel.map(p => `
        <div class="personnel-item">
            <div class="personnel-info">
                <div class="personnel-name">${p.name}</div>
                <div class="personnel-phone">${p.phone}</div>
            </div>
            <div class="personnel-status">
                <span class="status-badge status-${p.status}">${p.status.toUpperCase()}</span>
            </div>
            <div class="personnel-actions">
                <button class="btn-remove" onclick="removePersonnel('${p.id}')" title="Remove Personnel">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removePersonnel(personnelId) {
    if (confirm('Are you sure you want to remove this personnel?')) {
        personnel = personnel.filter(p => p.id !== personnelId);
        localStorage.setItem('personnel', JSON.stringify(personnel));
        loadPersonnelList();
        showMessage('success', 'Success!', 'Personnel removed successfully!');
    }
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function handleAdminLogout() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    isAdminLoggedIn = false;
    adminUser = null;
    
    showMessage('success', 'Success!', 'Logged out successfully!');
    setTimeout(() => {
        window.location.href = 'admin-login.html';
    }, 1500);
}

// Test function for admin dashboard
function testAdminFunctions() {
    console.log('=== ADMIN FUNCTION TEST ===');
    console.log('Users loaded:', users.length);
    console.log('Orders loaded:', orders.length);
    console.log('Personnel loaded:', personnel.length);
    console.log('Pricing loaded:', Object.keys(pricing).length, 'items');
    
    // Test order management
    if (orders.length > 0) {
        console.log('Testing order management...');
        const order = orders[0];
        console.log('Sample order:', order);
        
        // Test opening order actions modal
        console.log('Opening order actions modal...');
        openOrderActions(order.id);
        
        // Wait a bit then test user management
        setTimeout(() => {
            if (users.length > 0) {
                console.log('Testing user management...');
                const user = users[0];
                console.log('Sample user:', user);
                
                // Test opening user actions modal
                console.log('Opening user actions modal...');
                openUserActions(user.id);
            }
        }, 2000);
    }
    
    console.log('=== TEST COMPLETED ===');
    alert('Admin function test completed! Check console for details. Modals should open automatically.');
}

// Test button functionality
function testButtons() {
    console.log('=== BUTTON TEST ===');
    
    // Test order buttons
    const orderButtons = document.querySelectorAll('button[data-action="manage-order"]');
    console.log('Found', orderButtons.length, 'order management buttons');
    
    // Test user buttons
    const userButtons = document.querySelectorAll('button[data-action="manage-user"]');
    console.log('Found', userButtons.length, 'user management buttons');
    
    // Test clicking first order button
    if (orderButtons.length > 0) {
        console.log('Testing first order button click...');
        orderButtons[0].click();
    }
    
    // Test clicking first user button after a delay
    setTimeout(() => {
        if (userButtons.length > 0) {
            console.log('Testing first user button click...');
            userButtons[0].click();
        }
    }, 1000);
    
    console.log('=== BUTTON TEST COMPLETED ===');
    alert('Button test completed! Check console for details.');
}

// Refresh data function
function refreshData() {
    console.log('=== REFRESHING DATA ===');
    
    // Fix user IDs first
    fixUserIds();
    
    // Reload all data
    loadUsers();
    loadOrders();
    loadPersonnel();
    loadPricing();
    
    // Update tables
    loadOrdersTable();
    loadUsersTable();
    loadPersonnelList();
    
    // Update stats
    updateAdminStats();
    
    console.log('Data refreshed successfully');
    console.log('Users:', users.length);
    console.log('Orders:', orders.length);
    console.log('Personnel:', personnel.length);
    
    alert('Data refreshed successfully! Check console for details.');
}

// Simple test function for button clicks
function testButtonClick() {
    console.log('=== TESTING BUTTON CLICK ===');
    
    // Test if functions exist
    console.log('viewUserDetails function:', typeof viewUserDetails);
    console.log('openUserActions function:', typeof openUserActions);
    
    // Test with first user
    if (users.length > 0) {
        const firstUser = users[0];
        console.log('Testing with first user:', firstUser);
        
        console.log('Calling viewUserDetails...');
        viewUserDetails(firstUser.id);
        
        setTimeout(() => {
            console.log('Calling openUserActions...');
            openUserActions(firstUser.id);
        }, 1000);
    }
    
    console.log('=== BUTTON CLICK TEST COMPLETED ===');
}
