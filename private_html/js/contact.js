// Contact Form Handler - Dynamic mailto link generation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    
    sendEmailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!validateForm(data)) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Generate mailto link
        const mailtoLink = generateMailtoLink(data);
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showMessage('Opening your email client... Please send the prepared email.', 'success');
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
    
    function generateMailtoLink(data) {
        const toEmail = 'contact@ltscommerce.dev';
        const subject = `Contact Form from ${data.name}`;
        
        // Format the email body
        let body = `Hello Joseph,\n\n`;
        body += `I'm reaching out regarding a potential project.\n\n`;
        body += `--- Contact Details ---\n`;
        body += `Name: ${data.name}\n`;
        body += `Email: ${data.email}\n`;
        if (data.company) {
            body += `Company: ${data.company}\n`;
        }
        body += `\n--- Project Information ---\n`;
        body += `Project Type: ${getProjectTypeLabel(data.projectType)}\n`;
        if (data.budget) {
            body += `Budget Range: ${data.budget}\n`;
        }
        if (data.timeline) {
            body += `Timeline: ${data.timeline}\n`;
        }
        body += `\n--- Project Details ---\n`;
        body += `${data.message}\n\n`;
        body += `Best regards,\n${data.name}`;
        
        // Create mailto link
        const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        return mailtoLink;
    }
    
    function getProjectTypeLabel(value) {
        const projectTypes = {
            'bespoke-php': 'Bespoke PHP Development',
            'legacy-php': 'Legacy PHP Modernization',
            'infrastructure': 'Infrastructure & Automation',
            'cto-services': 'CTO-Level Services',
            'ai-development': 'AI-Enhanced Development',
            'other': 'Other'
        };
        return projectTypes[value] || value;
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