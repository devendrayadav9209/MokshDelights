// ===========================
// AUTHENTICATION SYSTEM
// Handles login, signup, and localStorage
// ===========================

// Switch between login and signup forms
function switchForm(e) {
    e.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show auth message
function showAuthMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    element.textContent = message;
    element.className = 'auth-message ' + (isSuccess ? 'auth-success' : 'auth-error');
    
    if (isSuccess) {
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Initialize auth forms on page load
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!isValidEmail(email)) {
                showAuthMessage('login-status', 'Please enter a valid email address', false);
                return;
            }
            
            if (password.length < 6) {
                showAuthMessage('login-status', 'Password must be at least 6 characters', false);
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('moksh_users')) || {};
            
            if (!users[email]) {
                showAuthMessage('login-status', 'Email not found. Please sign up first', false);
                return;
            }
            
            if (users[email].password !== password) {
                showAuthMessage('login-status', 'Incorrect password', false);
                return;
            }
            
            // Login successful
            localStorage.setItem('moksh_currentUser', JSON.stringify({
                email: email,
                fullName: users[email].fullName,
                loginTime: new Date().getTime()
            }));
            
            showAuthMessage('login-status', 'Login successful! Redirecting...', true);
            
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1500);
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Validation
            if (!fullName) {
                showAuthMessage('signup-status', 'Please enter your full name', false);
                return;
            }
            
            if (!isValidEmail(email)) {
                showAuthMessage('signup-status', 'Please enter a valid email address', false);
                return;
            }
            
            if (password.length < 6) {
                showAuthMessage('signup-status', 'Password must be at least 6 characters', false);
                return;
            }
            
            if (password !== confirmPassword) {
                showAuthMessage('signup-status', 'Passwords do not match', false);
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('moksh_users')) || {};
            
            if (users[email]) {
                showAuthMessage('signup-status', 'Email already registered. Please login', false);
                return;
            }
            
            // Create new user
            users[email] = {
                fullName: fullName,
                email: email,
                password: password,
                signupDate: new Date().toISOString()
            };
            
            localStorage.setItem('moksh_users', JSON.stringify(users));
            
            // Auto-login after signup
            localStorage.setItem('moksh_currentUser', JSON.stringify({
                email: email,
                fullName: fullName,
                loginTime: new Date().getTime()
            }));
            
            showAuthMessage('signup-status', 'Account created successfully! Redirecting...', true);
            
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1500);
        });
    }
});

// Check if user is logged in
function isUserLoggedIn() {
    const currentUser = localStorage.getItem('moksh_currentUser');
    return currentUser !== null;
}

// Get current logged-in user
function getCurrentUser() {
    const currentUser = localStorage.getItem('moksh_currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Logout user
function logout() {
    localStorage.removeItem('moksh_currentUser');
    const isInPages = window.location.pathname.split('/').includes('pages');
    const authHref = isInPages ? 'auth.html' : 'pages/auth.html';
    window.location.href = authHref;
}

// Redirect non-logged-in users
function requireLogin() {
    if (!isUserLoggedIn()) {
        const isInPages = window.location.pathname.split('/').includes('pages');
        const authHref = isInPages ? 'auth.html' : 'pages/auth.html';
        window.location.href = authHref;
    }
}
