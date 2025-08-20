// Contact Form Handler - Dynamic mailto link generation with enhanced UX
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const requiredFields = contactForm.querySelectorAll('[required]');
    
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
        
        // Show preparing message immediately
        showMessage('Preparing to open your email client...', 'info');
        
        // Generate mailto link
        const mailtoLink = generateMailtoLink(data);
        
        // Small delay to ensure message is visible
        setTimeout(() => {
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message after a brief moment
            setTimeout(() => {
                showMessage('Your email client should now be open with a pre-filled message. Please review and send.', 'success');
            }, 500);
        }, 300);
    });
    
    function validateForm(data) {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.form-error');
            if (errorMsg) errorMsg.remove();
        });
        
        // Check required fields
        const requiredFields = ['name', 'email', 'projectType', 'message'];
        for (const field of requiredFields) {
            const input = contactForm.querySelector(`[name="${field}"]`);
            const formGroup = input.closest('.form-group');
            
            if (!data[field] || data[field].trim() === '') {
                formGroup.classList.add('error');
                addErrorMessage(formGroup, 'This field is required');
                isValid = false;
            }
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = contactForm.querySelector('[name="email"]');
        const emailGroup = emailInput.closest('.form-group');
        
        if (data.email && !emailRegex.test(data.email)) {
            emailGroup.classList.add('error');
            addErrorMessage(emailGroup, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!isValid) {
            // Shake the button to indicate error
            sendEmailBtn.classList.add('shake');
            setTimeout(() => sendEmailBtn.classList.remove('shake'), 500);
        }
        
        return isValid;
    }
    
    function addErrorMessage(formGroup, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
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
    
    // Real-time validation and animations
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Focus animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.parentElement.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.form-error');
            if (errorMsg) errorMsg.remove();
        });
        
        // Blur validation
        input.addEventListener('blur', function() {
            const formGroup = this.parentElement;
            if (!this.value) {
                formGroup.classList.remove('focused');
            }
            
            // Validate on blur if required
            if (this.hasAttribute('required') && !this.value.trim()) {
                formGroup.classList.add('error');
                addErrorMessage(formGroup, 'This field is required');
            } else if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    formGroup.classList.add('error');
                    addErrorMessage(formGroup, 'Please enter a valid email address');
                } else {
                    formGroup.classList.add('success');
                    setTimeout(() => formGroup.classList.remove('success'), 2000);
                }
            } else if (this.value && this.hasAttribute('required')) {
                formGroup.classList.add('success');
                setTimeout(() => formGroup.classList.remove('success'), 2000);
            }
        });
        
        // Real-time input validation for email
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                const formGroup = this.parentElement;
                if (this.value.length > 5) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(this.value)) {
                        formGroup.classList.remove('error');
                        const errorMsg = formGroup.querySelector('.form-error');
                        if (errorMsg) errorMsg.remove();
                    }
                }
            });
        }
    });
    
    // Character counter for textarea
    const messageTextarea = contactForm.querySelector('[name="message"]');
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        messageTextarea.parentElement.appendChild(charCounter);
        
        function updateCharCount() {
            const length = messageTextarea.value.length;
            const maxLength = 1000;
            charCounter.textContent = `${length}/${maxLength}`;
            if (length > maxLength * 0.9) {
                charCounter.style.color = '#ef4444';
            } else {
                charCounter.style.color = '#9ca3af';
            }
        }
        
        messageTextarea.addEventListener('input', updateCharCount);
        updateCharCount();
    }
});