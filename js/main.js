// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    setupMobileMenu();
    setupSmoothScroll();
    setupAppointmentForm();
    setupServiceCalculator();
    initializeAnimations();
}

// Mobile Menu Handler
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// Smooth Scroll for Navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.querySelector('.nav-links')?.classList.remove('active');
                document.querySelector('.mobile-menu-btn')?.classList.remove('active');
            }
        });
    });
}

// Appointment Form Handler
function setupAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const formDetails = {
                name: formData.get('name'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message'),
                date: formData.get('date')
            };

            if (validateForm(formDetails)) {
                try {
                    await submitAppointment(formDetails);
                    showNotification('Appointment scheduled successfully!', 'success');
                    form.reset();
                } catch (error) {
                    showNotification('Error scheduling appointment. Please try again.', 'error');
                }
            }
        });
    }
}

// Form Validation
function validateForm(data) {
    const errors = [];

    if (!data.name) errors.push('Name is required');
    if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!data.service) errors.push('Please select a service');
    if (!data.date) errors.push('Please select a date');

    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    return true;
}

// Service Price Calculator
function setupServiceCalculator() {
    const calculator = document.getElementById('serviceCalculator');
    
    if (calculator) {
        const services = {
            'oil-change': 49.99,
            'brake-service': 199.99,
            'tire-rotation': 29.99,
            'engine-diagnostic': 89.99,
            'ac-service': 129.99
        };

        calculator.addEventListener('change', (e) => {
            let total = 0;
            const selected = document.querySelectorAll('#serviceCalculator input:checked');
            
            selected.forEach(service => {
                total += services[service.value] || 0;
            });

            document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
        });
    }
}

// Scroll Animations
function initializeAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

async function submitAppointment(data) {
    // Replace with your actual API endpoint
    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to submit appointment');
    }

    return await response.json();
}

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});
