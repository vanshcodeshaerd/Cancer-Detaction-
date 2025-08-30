/**
 * Authentication System for Cancer Detection Portal
 * Handles secure login, session management, and access control
 */

class AuthSystem {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.sessionTimer = null;
        
        this.init();
    }

    init() {
        this.checkSession();
        this.setupEventListeners();
        this.startSessionTimer();
    }

    /**
     * Check if user has valid session
     */
    checkSession() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const lastActivity = localStorage.getItem('lastActivity');

        if (token && userData && lastActivity) {
            const now = Date.now();
            const timeSinceLastActivity = now - parseInt(lastActivity);

            if (timeSinceLastActivity < this.sessionTimeout) {
                this.isAuthenticated = true;
                this.currentUser = JSON.parse(userData);
                this.updateLastActivity();
                this.redirectToDashboard();
            } else {
                this.logout('Session expired');
            }
        }
    }

    /**
     * Setup authentication event listeners
     */
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Session activity tracking
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.updateLastActivity(), true);
        });
    }

    /**
     * Handle login form submission
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('.login-btn');
        const username = form.username.value.trim();
        const password = form.password.value;

        // Validate inputs
        if (!this.validateLoginInputs(username, password)) {
            return;
        }

        // Show loading state
        this.setLoginLoadingState(submitBtn, true);

        try {
            // Simulate API call delay
            await this.simulateApiCall();
            
            // Validate credentials
            if (this.validateCredentials(username, password)) {
                this.loginSuccess(username);
            } else {
                this.showLoginError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            this.showLoginError('Login failed. Please try again.');
        } finally {
            this.setLoginLoadingState(submitBtn, false);
        }
    }

    /**
     * Validate login inputs
     */
    validateLoginInputs(username, password) {
        let isValid = true;
        
        // Clear previous errors
        this.clearLoginErrors();

        // Validate username
        if (!username) {
            this.showFieldError('username', 'Doctor ID is required');
            isValid = false;
        } else if (username.length < 3) {
            this.showFieldError('username', 'Doctor ID must be at least 3 characters');
            isValid = false;
        }

        // Validate password
        if (!password) {
            this.showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Validate credentials against sample data
     */
    validateCredentials(username, password) {
        // Sample doctor accounts for demonstration
        const validDoctors = [
            { username: 'dr.smith', password: 'password123', name: 'Dr. John Smith', role: 'Oncologist' },
            { username: 'dr.johnson', password: 'password123', name: 'Dr. Sarah Johnson', role: 'Radiologist' },
            { username: 'dr.williams', password: 'password123', name: 'Dr. Michael Williams', role: 'Pathologist' },
            { username: 'dr.brown', password: 'password123', name: 'Dr. Emily Brown', role: 'Oncologist' },
            { username: 'dr.davis', password: 'password123', name: 'Dr. David Davis', role: 'Surgeon' }
        ];

        return validDoctors.some(doctor => 
            doctor.username === username && doctor.password === password
        );
    }

    /**
     * Handle successful login
     */
    loginSuccess(username) {
        // Find doctor data
        const validDoctors = [
            { username: 'dr.smith', password: 'password123', name: 'Dr. John Smith', role: 'Oncologist' },
            { username: 'dr.johnson', password: 'password123', name: 'Dr. Sarah Johnson', role: 'Radiologist' },
            { username: 'dr.williams', password: 'password123', name: 'Dr. Michael Williams', role: 'Pathologist' },
            { username: 'dr.brown', password: 'password123', name: 'Dr. Emily Brown', role: 'Oncologist' },
            { username: 'dr.davis', password: 'password123', name: 'Dr. David Davis', role: 'Surgeon' }
        ];

        const doctor = validDoctors.find(d => d.username === username);
        
        // Create session
        this.isAuthenticated = true;
        this.currentUser = {
            username: doctor.username,
            name: doctor.name,
            role: doctor.role,
            loginTime: new Date().toISOString()
        };

        // Store session data
        localStorage.setItem('authToken', this.generateToken());
        localStorage.setItem('userData', JSON.stringify(this.currentUser));
        this.updateLastActivity();

        // Show success message
        this.showLoginSuccess();

        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    /**
     * Handle logout
     */
    logout(reason = 'User logged out') {
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Clear session data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('lastActivity');
        
        // Clear session timer
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }

        // Log logout reason
        console.log(`Logout: ${reason}`);

        // Redirect to login page
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
    }

    /**
     * Generate simple token (in production, use proper JWT)
     */
    generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Update last activity timestamp
     */
    updateLastActivity() {
        localStorage.setItem('lastActivity', Date.now().toString());
    }

    /**
     * Start session timer
     */
    startSessionTimer() {
        this.sessionTimer = setInterval(() => {
            const lastActivity = localStorage.getItem('lastActivity');
            if (lastActivity) {
                const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
                if (timeSinceLastActivity >= this.sessionTimeout) {
                    this.logout('Session timeout');
                }
            }
        }, 60000); // Check every minute
    }

    /**
     * Simulate API call delay
     */
    simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000 + Math.random() * 1000); // 1-2 seconds
        });
    }

    /**
     * Set login button loading state
     */
    setLoginLoadingState(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    /**
     * Show field-specific error
     */
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(errorDiv);
    }

    /**
     * Clear all login errors
     */
    clearLoginErrors() {
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    /**
     * Show login error message
     */
    showLoginError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'login-error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.close-error');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }

    /**
     * Show login success message
     */
    showLoginSuccess() {
        const submitBtn = document.querySelector('.login-btn');
        submitBtn.classList.add('success');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
    }

    /**
     * Redirect to dashboard
     */
    redirectToDashboard() {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            window.location.href = 'dashboard.html';
        }
    }

    /**
     * Check if user is authenticated
     */
    checkAuth() {
        if (!this.isAuthenticated) {
            this.logout('Authentication required');
            return false;
        }
        return true;
    }

    /**
     * Get current user information
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Update user profile
     */
    updateProfile(profileData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...profileData };
            localStorage.setItem('userData', JSON.stringify(this.currentUser));
        }
    }
}

// Initialize authentication system
const auth = new AuthSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
