// Import CSS for Vite processing
import '../css/main.css';
import '../css/contact.css';

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!validateForm(data)) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Disable submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // In a real application, this would send data to a server
            // For now, we'll simulate a successful submission
            await simulateFormSubmission(data);
            
            // Show success message
            showMessage('Thank you for your message! I\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
    
    function validateForm(data) {
        // Check required fields
        const requiredFields = ['name', 'email', 'projectType', 'message'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        return true;
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function simulateFormSubmission(data) {
        // Simulate API call with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted with data:', data);
                resolve();
            }, 1500);
        });
    }
    
    // Add input animations
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});