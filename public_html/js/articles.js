// Articles data structure - In a real application, this would come from an API or CMS
const articlesData = [
    {
        id: 1,
        title: "Managing Legacy PHP: From Technical Debt to Modern Architecture",
        excerpt: "Practical strategies for transforming legacy PHP codebases into maintainable, modern systems without breaking production.",
        category: "php",
        date: "2025-01-15",
        slug: "legacy-php-modernization"
    },
    {
        id: 2,
        title: "Ansible Automation for PHP Infrastructure",
        excerpt: "Building robust, repeatable infrastructure deployment pipelines using Ansible for PHP applications.",
        category: "infrastructure",
        date: "2025-01-10",
        slug: "ansible-php-infrastructure"
    },
    {
        id: 3,
        title: "Proxmox vs Cloud: Why Private Infrastructure Wins",
        excerpt: "Real-world comparison of Proxmox private cloud infrastructure versus public cloud solutions for PHP applications.",
        category: "infrastructure",
        date: "2025-01-05",
        slug: "proxmox-vs-cloud"
    },
    {
        id: 4,
        title: "High-Performance PHP: Optimization Strategies",
        excerpt: "Proven techniques for optimizing PHP applications to handle high-turnover, high-complexity scenarios.",
        category: "php",
        date: "2024-12-28",
        slug: "high-performance-php"
    },
    {
        id: 5,
        title: "MySQL Performance Tuning for Complex PHP Applications",
        excerpt: "Database optimization strategies specifically tailored for bespoke PHP systems with complex queries.",
        category: "database",
        date: "2024-12-20",
        slug: "mysql-performance-php"
    },
    {
        id: 6,
        title: "Building Scalable Backend APIs with Modern PHP",
        excerpt: "Architectural patterns and best practices for creating robust, scalable backend systems using modern PHP.",
        category: "php",
        date: "2024-12-15",
        slug: "scalable-php-apis"
    },
    {
        id: 7,
        title: "AI-Enhanced PHP Development: Tools and Workflows",
        excerpt: "How to leverage AI tools like GitHub Copilot and OpenAI APIs to boost PHP development efficiency without compromising quality.",
        category: "ai",
        date: "2024-12-10",
        slug: "ai-enhanced-php-development"
    }
];

// Articles management class
class ArticlesManager {
    constructor() {
        this.articles = articlesData;
        this.filteredArticles = [...this.articles];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderArticles();
        this.hideLoadingIndicator();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('articleSearch');
        searchInput.addEventListener('input', window.appUtils.debounce((e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterArticles();
        }, 300));

        // Category filters
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target);
            });
        });
    }

    handleCategoryFilter(button) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Update current category and filter
        this.currentCategory = button.dataset.category;
        this.filterArticles();
    }

    filterArticles() {
        this.filteredArticles = this.articles.filter(article => {
            const matchesCategory = this.currentCategory === 'all' || article.category === this.currentCategory;
            const matchesSearch = this.searchTerm === '' || 
                article.title.toLowerCase().includes(this.searchTerm) ||
                article.excerpt.toLowerCase().includes(this.searchTerm);
            
            return matchesCategory && matchesSearch;
        });

        this.renderArticles();
    }

    renderArticles() {
        const grid = document.getElementById('articlesGrid');
        const noResults = document.getElementById('noResults');

        if (this.filteredArticles.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        noResults.style.display = 'none';

        grid.innerHTML = this.filteredArticles.map(article => this.createArticleCard(article)).join('');
        
        // Add fade-in animation
        requestAnimationFrame(() => {
            const cards = grid.querySelectorAll('.article-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        });
    }

    createArticleCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="article-card" style="opacity: 0; transform: translateY(20px);">
                <div class="article-meta">
                    <span class="article-category ${article.category}">${article.category}</span>
                    <time>${formattedDate}</time>
                </div>
                <a href="/articles/${article.slug}.html" class="article-title">${article.title}</a>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="/articles/${article.slug}.html" class="article-read-more">
                    Read more →
                </a>
            </article>
        `;
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        loadingIndicator.style.display = 'none';
    }
}

// Initialize articles manager when DOM is ready
(function() {
    'use strict';
    
    // Wait for both DOM and utils to be ready
    function initArticles() {
        if (typeof window.appUtils !== 'undefined') {
            new ArticlesManager();
        } else {
            // Retry in 50ms if utils not loaded yet
            setTimeout(initArticles, 50);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initArticles);
    } else {
        initArticles();
    }
})();