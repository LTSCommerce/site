// Syntax highlighting with highlight.js
(function() {
    'use strict';
    
    // Load highlight.js CSS
    function loadHighlightCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
        document.head.appendChild(link);
    }
    
    // Load highlight.js library
    function loadHighlightJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
            script.onload = () => {
                console.log('✓ Highlight.js loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('✗ Failed to load Highlight.js');
                reject(new Error('Failed to load Highlight.js'));
            };
            document.head.appendChild(script);
        });
    }
    
    // Initialize syntax highlighting
    async function initHighlighting() {
        try {
            await loadHighlightJS();
            
            // Configure highlight.js
            hljs.configure({
                languages: ['php', 'javascript', 'typescript', 'bash', 'json', 'yaml', 'sql', 'css', 'html', 'nginx']
            });
            
            // Highlight all code blocks
            document.querySelectorAll('pre code').forEach(block => {
                // Only process if not already highlighted
                if (!block.classList.contains('hljs')) {
                    hljs.highlightElement(block);
                }
            });
            
            console.log('✓ Syntax highlighting initialized');
        } catch (error) {
            console.error('Failed to initialize syntax highlighting:', error);
            // No fallback - if highlight.js fails, we just show plain code
        }
    }
    
    // Initialize when DOM is ready
    function init() {
        loadHighlightCSS();
        initHighlighting();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();