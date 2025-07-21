// Elegant interactions and mathematical animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elegant scroll animations
    initializeScrollAnimations();
    
    // Initialize reading progress
    initializeReadingProgress();
    
    // Initialize elegant cursor effects
    initializeCursorEffects();
    
    // Initialize particle effects
    initializeParticleEffects();
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
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                const parallaxOffset = currentScroll * 0.5;
                hero.style.transform = `translateY(${parallaxOffset}px)`;
            }
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
    
    // Observe all sections and major elements
    document.querySelectorAll('section, .article-container > *, .expertise-card, .article-card').forEach(el => {
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

// Elegant cursor effects
function initializeCursorEffects() {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, rgba(0, 102, 204, 0.1) 70%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
        mix-blend-mode: multiply;
    `;
    document.body.appendChild(cursor);
    
    // Smooth cursor following
    const updateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        requestAnimationFrame(updateCursor);
    };
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Scale cursor on hover
    document.querySelectorAll('a, button, .btn, .article-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, rgba(0, 102, 204, 0.2) 0%, rgba(0, 102, 204, 0.05) 70%, transparent 100%)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, rgba(0, 102, 204, 0.1) 70%, transparent 100%)';
        });
    });
    
    requestAnimationFrame(updateCursor);
}

// Subtle particle effects
function initializeParticleEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.6;
    `;
    hero.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    const resizeCanvas = () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    };
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 102, 204, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
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