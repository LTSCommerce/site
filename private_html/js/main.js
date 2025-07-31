// Prevent FOUC with smooth fade-in
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});

// Elegant interactions and mathematical animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elegant scroll animations
    initializeScrollAnimations();
    
    // Initialize reading progress
    initializeReadingProgress();
    
    // Initialize dynamic gradients
    initializeDynamicGradients();
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    
    // Enhanced scroll effects with mathematical precision
    let lastScroll = 0;
    const scrollHandler = utils.throttle(function() {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.site-header');
        const scrollProgress = currentScroll / (document.body.scrollHeight - window.innerHeight);
        
        // Header backdrop blur effect
        if (currentScroll > 50) {
            header.style.backdropFilter = `blur(${Math.min(currentScroll / 10, 16)}px) saturate(180%)`;
            header.style.backgroundColor = `rgba(255, 255, 255, ${Math.min(0.85 + (currentScroll / 1000), 0.95)})`;
        } else {
            header.style.backdropFilter = 'blur(8px) saturate(180%)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        }
        
        
        lastScroll = currentScroll;
    }, 16); // 60fps
    
    window.addEventListener('scroll', scrollHandler);
});

// Elegant scroll animations with intersection observer
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delays
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe all sections and major elements (exclude article content to prevent conflicts with body fade-in)
    document.querySelectorAll('section:not(.article-section), .expertise-card, .article-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
}

// Reading progress indicator
function initializeReadingProgress() {
    if (!document.querySelector('.article-container')) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    const updateProgress = utils.throttle(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, 16);
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Dynamic gradient that follows mouse movement
function initializeDynamicGradients() {
    const dynamicGradientHandler = utils.throttle((e) => {
        // Calculate angle based on mouse position
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Convert to angle (in degrees), add offset for nice starting angle
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 135;
        
        // Update CSS custom property for gradient angle
        document.documentElement.style.setProperty('--gradient-angle', `${angle}deg`);
        
        // Calculate complementary drop shadow position (inverted from mouse)
        // Normalize mouse position to viewport percentage
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        // Calculate shadow offset (subtle, opposite to mouse position)
        // Shadow appears to be "cast" away from mouse position
        const shadowX = (50 - mouseX) * 0.08; // Very subtle horizontal offset
        const shadowY = (50 - mouseY) * 0.06; // Very subtle vertical offset
        
        // Update CSS custom properties for dynamic shadow
        document.documentElement.style.setProperty('--shadow-x', `${shadowX}px`);
        document.documentElement.style.setProperty('--shadow-y', `${shadowY}px`);
        
        // Calculate subtle blur based on distance from center
        const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const blurIntensity = 2 + (distanceFromCenter / maxDistance) * 1; // 2-3px blur range
        
        document.documentElement.style.setProperty('--shadow-blur', `${blurIntensity}px`);
    }, 16); // 60fps
    
    // Add mouse move listener
    document.addEventListener('mousemove', dynamicGradientHandler);
    
    // Reset to default values when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        document.documentElement.style.setProperty('--gradient-angle', '135deg');
        document.documentElement.style.setProperty('--shadow-x', '2px');
        document.documentElement.style.setProperty('--shadow-y', '2px');
        document.documentElement.style.setProperty('--shadow-blur', '2px');
    });
}



// Page router for single page navigation (if needed later)
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }
    
    add(path, callback) {
        this.routes[path] = callback;
        return this;
    }
    
    navigate(path) {
        if (this.routes[path]) {
            this.currentRoute = path;
            this.routes[path]();
        }
    }
}

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Fade in animation
    fadeIn: function(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        requestAnimationFrame(function animate(time) {
            const elapsed = time - start;
            const progress = elapsed / duration;
            
            element.style.opacity = Math.min(progress, 1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        });
    }
};

// Export for use in other scripts
window.appUtils = utils;
window.appRouter = new Router();