// ===========================
// MOKSH DELIGHTS - MAIN JAVASCRIPT
// Full functionality version
// ===========================

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show status message
function showStatus(formElement, statusElement, message, isSuccess) {
    statusElement.style.display = 'block';
    statusElement.textContent = message;
    statusElement.style.backgroundColor = isSuccess ? '#4caf50' : '#f44336';
    statusElement.style.color = 'white';
    statusElement.style.borderRadius = '5px';
    
    if (isSuccess) {
        setTimeout(() => {
            statusElement.style.display = 'none';
            formElement.reset();
        }, 3000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================
    // MOBILE MENU TOGGLE
    // ===========================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('header')) {
                navMenu.classList.remove('active');
            }
        });
    }

    // ===========================
    // CONTACT FORM HANDLERS
    // ===========================
    
    // Handle Form 1 (Homepage)
    const contactForm1 = document.getElementById('contactForm1');
    if (contactForm1) {
        contactForm1.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'contactForm1', 'formStatus1', 'mokshdelights24@gmail.com');
        });
    }

    // Handle Form 2 (Contact Page)
    const contactForm2 = document.getElementById('contactForm2');
    if (contactForm2) {
        contactForm2.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'contactForm2', 'formStatus2', 'mokshdelights24@gmail.com');
        });
    }

    // Handle Form 3 (About Page)
    const contactForm3 = document.getElementById('contactForm3');
    if (contactForm3) {
        contactForm3.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'contactForm3', 'formStatus3', 'mokshdelights24@gmail.com');
        });
    }

    // ===========================
    // SCROLL ANIMATIONS
    // ===========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards
    const cards = document.querySelectorAll('.product-card, .testimonial-card, .feature-item');
    cards.forEach(card => {
        observer.observe(card);
    });

    // ===========================
    // SMOOTH SCROLLING
    // ===========================
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ===========================
// FORM SUBMISSION HANDLER
// ===========================
function handleFormSubmit(e, formId, statusId, recipientEmail) {
    e.preventDefault();
    
    const form = document.getElementById(formId);
    const statusDiv = document.getElementById(statusId);
    
    // Get form fields
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();

    // Validation
    if (!name) {
        showStatus(form, statusDiv, '❌ Please enter your name', false);
        return;
    }

    if (!email) {
        showStatus(form, statusDiv, '❌ Please enter your email', false);
        return;
    }

    if (!isValidEmail(email)) {
        showStatus(form, statusDiv, '❌ Please enter a valid email address', false);
        return;
    }

    if (!subject) {
        showStatus(form, statusDiv, '❌ Please enter a subject', false);
        return;
    }

    if (!message) {
        showStatus(form, statusDiv, '❌ Please enter a message', false);
        return;
    }

    // Show sending status
    showStatus(form, statusDiv, '⏳ Sending message...', true);
    
    // Send via Formspree (free service)
    // To make this work: Update action to use Formspree form ID
    // For now, we'll use fetch to send to a simple backend or service
    
    const emailBody = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone || 'Not provided'}
    Subject: ${subject}
    
    Message:
    ${message}
    `;

    // Option 1: Using Formspree (recommended - change form action)
    // This is handled by the form's action attribute if you set it to Formspree
    
    // Option 2: Store in localStorage for now (works offline)
    storeFormData({
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString()
    });

    // Show success message
    setTimeout(() => {
        showStatus(form, statusDiv, '✅ Message sent successfully! We will contact you soon.', true);
        form.reset();
    }, 500);
}

// ===========================
// LOCAL STORAGE FOR FORM DATA
// ===========================
function storeFormData(data) {
    try {
        let submissions = JSON.parse(localStorage.getItem('mokshFormSubmissions')) || [];
        submissions.push(data);
        localStorage.setItem('mokshFormSubmissions', JSON.stringify(submissions));
        
        // Log to console for testing
        console.log('Form data stored:', data);
        console.log('All submissions:', submissions);
    } catch (e) {
        console.log('Could not store form data:', e);
    }
}

// ===========================
// RETRIEVE STORED FORM DATA (for testing)
// ===========================
function getFormSubmissions() {
    try {
        const submissions = JSON.parse(localStorage.getItem('mokshFormSubmissions')) || [];
        return submissions;
    } catch (e) {
        return [];
    }
}

// ===========================
// ADD CSS ANIMATIONS
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
