// Articles data structure - In a real application, this would come from an API or CMS
const articlesData = [
    {
        id: 1,
        title: "Building Scalable Ecommerce Platforms with Microservices",
        excerpt: "Learn how to architect modern ecommerce applications using microservices for better scalability and maintainability.",
        category: "ecommerce",
        date: "2025-01-15",
        slug: "scalable-ecommerce-microservices"
    },
    {
        id: 2,
        title: "CI/CD Pipeline Best Practices for DevOps Teams",
        excerpt: "Discover the essential practices for building robust continuous integration and deployment pipelines.",
        category: "devops",
        date: "2025-01-10",
        slug: "cicd-best-practices"
    },
    {
        id: 3,
        title: "Linux Security Hardening: A Comprehensive Guide",
        excerpt: "Essential security measures every Linux administrator should implement to protect their servers.",
        category: "linux",
        date: "2025-01-05",
        slug: "linux-security-hardening"
    },
    {
        id: 4,
        title: "Implementing AI-Powered Customer Support Systems",
        excerpt: "How to leverage AI and natural language processing to build intelligent customer support solutions.",
        category: "ai",
        date: "2024-12-28",
        slug: "ai-customer-support"
    },
    {
        id: 5,
        title: "Optimizing Database Performance for Ecommerce",
        excerpt: "Techniques for improving database performance in high-traffic ecommerce applications.",
        category: "ecommerce",
        date: "2024-12-20",
        slug: "database-optimization-ecommerce"
    },
    {
        id: 6,
        title: "Kubernetes Deployment Strategies",
        excerpt: "Understanding different deployment strategies in Kubernetes and when to use each one.",
        category: "devops",
        date: "2024-12-15",
        slug: "kubernetes-deployment-strategies"
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
        searchInput.addEventListener('input', utils.debounce((e) => {
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
document.addEventListener('DOMContentLoaded', () => {
    new ArticlesManager();
});