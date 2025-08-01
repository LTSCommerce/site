// Import CSS for Vite processing
import '../css/articles.css';

// This will be auto-generated - same as before
// Import the full articles data (used only in dynamic mode)
const articles = [
  // Full articles data will be here - generated by build process
];

const categories = {
  "php": {
    "label": "PHP",
    "description": "PHP development, frameworks, best practices",
    "backgroundColor": "#f3e5f5",
    "textColor": "#7b1fa2"
  },
  "infrastructure": {
    "label": "Infrastructure", 
    "description": "DevOps, hosting, deployment, automation",
    "backgroundColor": "#e8f5e9",
    "textColor": "#388e3c"
  },
  "database": {
    "label": "Database",
    "description": "MySQL, PostgreSQL, optimization, architecture", 
    "backgroundColor": "#e3f2fd",
    "textColor": "#1976d2"
  },
  "ai": {
    "label": "AI",
    "description": "AI tools, ML integration, automation",
    "backgroundColor": "#fff3e0",
    "textColor": "#f57c00"
  },
  "typescript": {
    "label": "TypeScript",
    "description": "TypeScript, Node.js, modern JavaScript",
    "backgroundColor": "#e1f5fe", 
    "textColor": "#0277bd"
  }
};

class HybridArticleManager {
  constructor() {
    this.articles = articles;
    this.filteredArticles = [...this.articles];
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.isStaticMode = true;
    this.currentPage = 1;
    this.articlesPerPage = 6; // For dynamic pagination
    
    // Detect if we're on a static paginated page
    this.detectPageMode();
    this.init();
  }

  detectPageMode() {
    const grid = document.getElementById('articlesGrid');
    if (grid && grid.classList.contains('static-page')) {
      this.isStaticMode = true;
      this.currentPage = parseInt(grid.dataset.page) || 1;
    } else {
      this.isStaticMode = false;
    }
  }

  init() {
    this.setupEventListeners();
    if (!this.isStaticMode) {
      this.renderArticles();
    }
    this.hideLoadingIndicator();
  }

  setupEventListeners() {
    const searchInput = document.getElementById('articleSearch');
    if (searchInput) {
      const handler = e => {
        this.searchTerm = e.target.value.toLowerCase();
        // Switch to dynamic mode when searching
        if (this.searchTerm !== '') {
          this.switchToDynamicMode();
        }
        this.filterArticles();
      };
      
      // Use debounce if available
      if (window.appUtils && window.appUtils.debounce) {
        searchInput.addEventListener('input', window.appUtils.debounce(handler, 300));
      } else {
        searchInput.addEventListener('input', handler);
      }
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.handleCategoryFilter(e.target);
      });
    });
  }

  handleCategoryFilter(button) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    this.currentCategory = button.dataset.category;
    
    // Switch to dynamic mode when filtering (unless "All" on page 1)
    if (this.currentCategory !== 'all' || this.currentPage !== 1) {
      this.switchToDynamicMode();
    }
    
    this.filterArticles();
  }

  switchToDynamicMode() {
    if (this.isStaticMode) {
      this.isStaticMode = false;
      
      // Hide static pagination
      const paginationTop = document.querySelector('.pagination-top');
      const paginationBottom = document.querySelector('.pagination-bottom');
      if (paginationTop) paginationTop.style.display = 'none';
      if (paginationBottom) paginationBottom.style.display = 'none';
      
      // Update help text
      const helpText = document.querySelector('.filter-help');
      if (helpText) {
        helpText.innerHTML = '✨ Dynamic mode active - showing filtered results from all articles.';
        helpText.style.color = '#388e3c';
      }
      
      // Show dynamic pagination placeholder
      this.showDynamicPagination();
    }
  }

  switchToStaticMode() {
    if (!this.isStaticMode && this.currentCategory === 'all' && this.searchTerm === '') {
      // Only switch back if no filters applied
      window.location.href = '/articles.html';
      return;
    }
  }

  filterArticles() {
    this.filteredArticles = this.articles.filter(article => {
      const categoryMatch = this.currentCategory === 'all' || article.category === this.currentCategory;
      const searchMatch = this.searchTerm === '' || 
        article.title.toLowerCase().includes(this.searchTerm) ||
        article.excerpt.toLowerCase().includes(this.searchTerm);
      return categoryMatch && searchMatch;
    });
    
    if (!this.isStaticMode) {
      this.currentPage = 1; // Reset to first page when filtering
      this.renderArticles();
      this.updateDynamicPagination();
    }
  }

  renderArticles() {
    const grid = document.getElementById('articlesGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;

    // In static mode, don't re-render
    if (this.isStaticMode) return;
    
    if (this.filteredArticles.length === 0) {
      grid.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      return;
    }
    
    grid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
    
    // Calculate articles for current page in dynamic mode
    const startIndex = (this.currentPage - 1) * this.articlesPerPage;
    const endIndex = Math.min(startIndex + this.articlesPerPage, this.filteredArticles.length);
    const pageArticles = this.filteredArticles.slice(startIndex, endIndex);
    
    grid.innerHTML = pageArticles.map(article => this.createArticleCard(article)).join('');
    grid.classList.remove('static-page'); // Remove static class
    
    // Animate articles
    requestAnimationFrame(() => {
      grid.querySelectorAll('.article-card').forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 50);
      });
    });
  }

  createArticleCard(article) {
    const date = new Date(article.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const categoryLabel = categories[article.category]?.label || article.category;
    
    return `
      <article class="article-card" data-category="${article.category}" style="opacity: 0; transform: translateY(20px);">
        <div class="article-meta">
          <span class="article-category article-category-${article.category}">${categoryLabel}</span>
          <time class="article-date" datetime="${article.date}">${date}</time>
        </div>
        <h2 class="article-title">
          <a href="/articles/${article.slug}.html">${article.title}</a>
        </h2>
        <p class="article-excerpt">${article.excerpt}</p>
        <div class="article-footer">
          <a href="/articles/${article.slug}.html" class="read-more">Read Article</a>
          <span class="reading-time">~${article.readingTime || '5'} min read</span>
        </div>
      </article>
    `;
  }

  showDynamicPagination() {
    // Create dynamic pagination container if it doesn't exist
    let dynamicPaginationTop = document.getElementById('dynamicPaginationTop');
    let dynamicPaginationBottom = document.getElementById('dynamicPaginationBottom');
    
    if (!dynamicPaginationTop) {
      dynamicPaginationTop = document.createElement('div');
      dynamicPaginationTop.id = 'dynamicPaginationTop';
      dynamicPaginationTop.className = 'dynamic-pagination';
      
      const grid = document.getElementById('articlesGrid');
      grid.parentNode.insertBefore(dynamicPaginationTop, grid);
    }
    
    if (!dynamicPaginationBottom) {
      dynamicPaginationBottom = document.createElement('div');
      dynamicPaginationBottom.id = 'dynamicPaginationBottom'; 
      dynamicPaginationBottom.className = 'dynamic-pagination';
      
      const grid = document.getElementById('articlesGrid');
      grid.parentNode.insertBefore(dynamicPaginationBottom, grid.nextSibling);
    }
    
    this.updateDynamicPagination();
  }

  updateDynamicPagination() {
    const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
    
    if (totalPages <= 1) {
      const topPagination = document.getElementById('dynamicPaginationTop');
      const bottomPagination = document.getElementById('dynamicPaginationBottom');
      if (topPagination) topPagination.style.display = 'none';
      if (bottomPagination) bottomPagination.style.display = 'none';
      return;
    }

    const paginationHtml = this.generateDynamicPaginationHtml(totalPages);
    
    const topPagination = document.getElementById('dynamicPaginationTop');
    const bottomPagination = document.getElementById('dynamicPaginationBottom');
    
    if (topPagination) {
      topPagination.innerHTML = paginationHtml;
      topPagination.style.display = 'block';
    }
    if (bottomPagination) {
      bottomPagination.innerHTML = paginationHtml;
      bottomPagination.style.display = 'block';
    }

    // Add event listeners to dynamic pagination
    document.querySelectorAll('.dynamic-page-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        this.goToPage(page);
      });
    });
  }

  generateDynamicPaginationHtml(totalPages) {
    const { currentPage } = this;
    
    let html = '<nav class="pagination-nav dynamic" aria-label="Dynamic article pagination">\n';
    html += '  <ul class="pagination-list">\n';

    // Previous button
    if (currentPage > 1) {
      html += `    <li><button class="pagination-link dynamic-page-btn pagination-prev" data-page="${currentPage - 1}" aria-label="Previous page">‹ Previous</button></li>\n`;
    }

    // Page numbers (simplified for dynamic)
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      const isActive = page === currentPage;
      const activeClass = isActive ? ' pagination-current' : '';
      const ariaLabel = isActive ? ` aria-current="page"` : '';
      
      html += `    <li><button class="pagination-link dynamic-page-btn${activeClass}" data-page="${page}"${ariaLabel}>${page}</button></li>\n`;
    }

    // Next button
    if (currentPage < totalPages) {
      html += `    <li><button class="pagination-link dynamic-page-btn pagination-next" data-page="${currentPage + 1}" aria-label="Next page">Next ›</button></li>\n`;
    }

    html += '  </ul>\n';
    html += `  <div class="pagination-info">Page ${currentPage} of ${totalPages} (${this.filteredArticles.length} articles)</div>\n`;
    html += '</nav>';

    return html;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderArticles();
    this.updateDynamicPagination();
    
    // Scroll to top of articles
    const grid = document.getElementById('articlesGrid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }
}

// Initialize when DOM is ready
(function() {
  let retryCount = 0;
  const maxRetries = 100;
  
  function init() {
    if (typeof window.appUtils !== 'undefined') {
      new HybridArticleManager();
    } else if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(init, 50);
    } else {
      console.warn('appUtils not found, initializing without debounce');
      new HybridArticleManager();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();