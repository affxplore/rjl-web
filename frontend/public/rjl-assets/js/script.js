/* ==================================
   RJL Group Website JavaScript
   Bright Glassmorphism Theme
   =================================== */

// Get the backend URL from environment or use current origin
const BACKEND_URL = window.location.origin;
const API_BASE = `${BACKEND_URL}/api`;

/* ===================================
   MOBILE NAVIGATION TOGGLE
   =================================== */
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
});

/* ===================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   =================================== */
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all elements with slide-up class
document.addEventListener('DOMContentLoaded', function() {
    const slideUpElements = document.querySelectorAll('.slide-up');
    slideUpElements.forEach(el => observer.observe(el));
});

/* ===================================
   CONTACT FORM HANDLING
   =================================== */
const contactForm = document.getElementById('contactForm');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type=\"submit\"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Send to backend API
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Show success message
                contactFormMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                contactFormMessage.className = 'form-message success';
                
                // Reset form
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error message
            contactFormMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
            contactFormMessage.className = 'form-message error';
        } finally {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                contactFormMessage.style.display = 'none';
            }, 5000);
        }
    });
}

/* ===================================
   REGISTRATION FORM HANDLING
   =================================== */
const registrationForm = document.getElementById('registrationForm');
const registrationFormMessage = document.getElementById('registrationFormMessage');

if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            classType: document.getElementById('classType').value,
            preferredDate: document.getElementById('preferredDate').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = registrationForm.querySelector('button[type=\"submit\"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        try {
            // Send to backend API
            const response = await fetch(`${API_BASE}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Show success message
                registrationFormMessage.textContent = 'Registration successful! We will contact you shortly to confirm your class details.';
                registrationFormMessage.className = 'form-message success';
                
                // Reset form
                registrationForm.reset();
            } else {
                throw new Error('Failed to submit registration');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error message
            registrationFormMessage.textContent = 'Sorry, there was an error submitting your registration. Please try again.';
            registrationFormMessage.className = 'form-message error';
        } finally {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                registrationFormMessage.style.display = 'none';
            }, 5000);
        }
    });
}

/* ===================================
   GALLERY IMAGE MODAL (OPTIONAL)
   =================================== */
const galleryImages = document.querySelectorAll('.gallery-image, .gallery-item');

galleryImages.forEach(image => {
    image.addEventListener('click', function() {
        // Get the background image URL
        const bgImage = this.style.backgroundImage;
        const imageUrl = bgImage.slice(5, -2); // Remove 'url(\"' and '\")'
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        // Close modal on click
        modal.addEventListener('click', function() {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    });
});

/* ===================================
   BUTTON HOVER EFFECTS
   =================================== */
const buttons = document.querySelectorAll('.btn-glass, .btn-small');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar-glass');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScrollTop = scrollTop;
});

/* ===================================
   FORM VALIDATION ENHANCEMENT
   =================================== */
const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = 'rgba(76, 175, 80, 0.5)';
        } else if (this.hasAttribute('required')) {
            this.style.borderColor = 'rgba(244, 67, 54, 0.5)';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--color-soft-gold)';
    });
});

/* ===================================
   LAZY LOADING BACKGROUND IMAGES
   =================================== */
const lazyBackgrounds = document.querySelectorAll('.gallery-item, .menu-image, .product-image');

const lazyLoadObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            // Background image is already set in HTML, just add a fade-in effect
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease';
                element.style.opacity = '1';
            }, 100);
            lazyLoadObserver.unobserve(element);
        }
    });
}, {
    rootMargin: '50px'
});

lazyBackgrounds.forEach(element => {
    lazyLoadObserver.observe(element);
});

/* ===================================
   DATE INPUT MIN DATE (FOR REGISTRATION)
   =================================== */
const dateInput = document.getElementById('preferredDate');
if (dateInput) {
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

/* ===================================
   CONSOLE LOG (DEVELOPER INFO)
   =================================== */
console.log('%cRJL Group Website', 'font-size: 24px; font-weight: bold; color: #d4af7a;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 14px; color: #8b6f47;');
console.log('%cDesign Style: Bright Glassmorphism', 'font-size: 14px; color: #8b6f47;');
console.log('%cFonts: Poppins & Inter', 'font-size: 14px; color: #8b6f47;');

/* ===================================
   PAGE LOAD ANIMATION
   =================================== */
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
