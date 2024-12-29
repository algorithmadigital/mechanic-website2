// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    
    // Service Calculator
    const serviceCalculator = document.getElementById('serviceCalculator');
    
    // Testimonials Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    
    // Mobile Menu Toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Appointment Form Handler
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointment);
    }

    // Service Price Calculator
    if (serviceCalculator) {
        serviceCalculator.addEventListener('change', calculateServicePrice);
    }

    // Initialize Testimonials Slider
    initTestimonialSlider();
});

// Appointment Form Handler
function handleAppointment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointment = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        message: formData.get('message')
    };

    // Validate form data
    if (validateAppointment(appointment)) {
        // Send to server (replace with your endpoint)
        submitAppointment(appointment);
    }
}

// Form Validation
function validateAppointment(data) {
    const errors = [];
    
    if (!data.name) errors.push('Name is required');
    if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!data.phone) errors.push('Phone number is required');
    if (!data.service) errors.push('Please select a service');
    if (!data.date) errors.push('Please select a date');

    if (errors.length > 0) {
        showErrors(errors);
        return false;
    }
    return true;
}

// Service Price Calculator
function calculateServicePrice() {
    const selectedServices = document.querySelectorAll('input[name="service"]:checked');
    let totalPrice = 0;

    const servicePrices = {
        'oil-change': 49.99,
        'brake-service': 199.99,
        'tire-rotation': 29.99,
        'engine-tune': 299.99,
        'ac-service': 149.99
    };

    selectedServices.forEach(service => {
        totalPrice += servicePrices[service.value] || 0;
    });

    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}

// Testimonials Slider
function initTestimonialSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    
    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize first slide
    showSlide(0);
    
    // Auto advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showErrors(errors) {
    const errorDiv = document.getElementById('form-errors');
    if (errorDiv) {
        errorDiv.innerHTML = errors.map(error => `<p class="error">${error}</p>`).join('');
    }
}

async function submitAppointment(data) {
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showSuccess('Appointment scheduled successfully!');
            resetForm();
        } else {
            throw new Error('Failed to schedule appointment');
        }
    } catch (error) {
        showErrors(['Failed to schedule appointment. Please try again.']);
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Show/Hide Header on Scroll
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
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
