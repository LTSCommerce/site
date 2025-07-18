# LTS Commerce Site - Technical Documentation

## Overview

Professional freelance PHP engineer portfolio website showcasing expertise in modern PHP development, infrastructure automation, and high-performance web applications.

## Architecture

### Build System
- **Build Tool**: Vite 5.x (modern, fast ES module bundler)
- **Package Manager**: npm with lockfile for reproducible builds
- **Source Directory**: `public_html/` (development files)
- **Build Output**: `dist/` (optimized production files)
- **Deployment**: Automated via GitHub Actions

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Pipeline**: Vite (ES modules, CSS processing, optimization)
- **Syntax Highlighting**: Prism.js (PHP, Bash, YAML, SQL, JSON, Nginx)
- **Code Quality**: ESLint + Prettier + Lighthouse CI
- **CI/CD**: GitHub Actions with automated deployment
- **Performance**: Optimized assets, lazy loading, performance monitoring

### Site Structure
```
├── public_html/          # Source files
│   ├── css/             # Stylesheets  
│   ├── js/              # JavaScript modules
│   ├── images/          # Static assets
│   ├── articles/        # Article pages
│   └── *.html           # Main pages
├── dist/                # Built files (production)
├── scripts/             # Build utilities
└── .github/workflows/   # CI/CD configuration
```

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server (port 3000)
npm run build           # Build for production
npm run preview         # Preview built site
```

### Code Quality & Formatting

**IMPORTANT: This project uses CI-only formatting. Do NOT run local formatting commands.**

All code formatting and quality checks are handled automatically by GitHub Actions CI/CD pipeline:

- **Auto-Formatting**: Prettier automatically formats code on push to main
- **Auto-Fixing**: PHP-CS-Fixer automatically fixes PHP code style issues
- **Quality Gates**: Deployment blocked if CI quality checks fail
- **Local Development**: Focus on functionality - CI handles formatting

Available scripts (for reference only):
```bash
npm run format:check    # Check formatting (used by CI)
npm run lint:check      # Check linting (used by CI)
npm run syntax-highlight # Process code syntax highlighting
```

**Manual Deployment Override**: Use GitHub Actions UI or `gh workflow run "Deploy static content to Pages"`

### Deployment Process
1. **Push to main branch** triggers GitHub Actions CI/CD pipeline
2. **Auto-Format** - Prettier automatically formats all code and commits changes
3. **Auto-Fix PHP** - PHP-CS-Fixer automatically fixes PHP code style issues
4. **Quality Checks** - Linting and code style validation (deployment blocked if fails)
5. **Build** - Vite processes and optimizes all assets
6. **Deploy** - Built files copied to `public_html/` and committed
7. **GitHub Pages** - Deployment triggered only when CI succeeds
8. **Lighthouse** - Performance and SEO auditing (post-deployment)

## Content Management

### Articles
- **Location**: `public_html/articles/`
- **Format**: Static HTML with embedded metadata
- **Syntax Highlighting**: Automatic language detection for code blocks
- **Categories**: PHP, Infrastructure, Database, AI
- **SEO**: Proper meta tags, structured data, semantic HTML

### Adding New Articles

**CRITICAL**: All 3 steps below are REQUIRED for articles to appear and be accessible:

1. **Create HTML file** in `public_html/articles/`
   - Use semantic HTML with proper heading hierarchy
   - Include complete SEO meta tags (title, description, keywords, Open Graph, Twitter)
   - Add JSON-LD structured data for articles
   - Use proper canonical URLs
   - Follow existing article format and structure

2. **Register in articles.js** - Add entry to `public_html/js/articles.js` data array:
   ```javascript
   {
     id: 8,  // Next sequential ID
     title: "Article Title",
     excerpt: "Brief description for article cards",
     category: "php|infrastructure|database|ai",
     date: "2025-07-18",  // YYYY-MM-DD format
     slug: "article-filename-without-extension"
   }
   ```

3. **Register in Vite config** - Add entry to `vite.config.js` rollupOptions.input:
   ```javascript
   'articles/article-filename': resolve(__dirname, 'public_html/articles/article-filename.html'),
   ```

**WARNING**: If any step is missed, the CI will delete the article file during the build process. The CI should be improved to fail instead of silently deleting unregistered articles.

**Testing**: After deployment, verify:
- Article appears on articles.html page
- Article URL is accessible (not 404)
- Article displays correctly with all formatting
- SEO metadata is properly rendered

### Potential Architecture Improvements

**Current Issues**:
1. Manual registration in multiple places (articles.js + vite.config.js) is error-prone
2. CI silently deletes unregistered articles instead of failing
3. Source and build directories are confusing (`public_html` contains both)

**Suggested Improvements**:
1. **Separate source/build directories**: Move HTML source to `private_html/` or `src/`, build to `public_html/`
2. **Automatic article registration**: Build script scans source articles and auto-generates articles.js
3. **CI validation**: Fail build if articles are malformed or missing metadata
4. **Metadata extraction**: Parse article HTML for title/excerpt instead of manual entry

**Benefits**:
- Single source of truth (just create HTML file)
- Reduced manual work and human error
- Better separation of concerns
- Fail-fast on missing articles

## Configuration Files

- `package.json` - Dependencies and npm scripts
- `vite.config.js` - Build configuration
- `.github/workflows/ci.yml` - Main CI/CD pipeline with quality gates
- `.github/workflows/static.yml` - GitHub Pages deployment (triggered by CI success)
- `qa-tools/composer.json` - PHP quality assurance tools (PHPStan, PHP-CS-Fixer)
- `qa-tools/.php-cs-fixer.php` - PHP code style configuration
- `lighthouserc.js` - Performance auditing
- `.eslintrc` & `.prettierrc` - Code quality rules

## Performance Features

- **Asset Optimization**: CSS/JS minification and bundling
- **Image Optimization**: Optimized images with proper formats
- **Lighthouse Scoring**: Automated performance monitoring
- **Semantic HTML**: Proper accessibility and SEO structure
- **Mobile-First**: Responsive design with touch-friendly navigation

## Security & Best Practices

- **Content Security**: No external dependencies in critical path
- **Modern JavaScript**: ES2022+ features with fallbacks
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: WCAG 2.1 compliant markup and navigation
- **SEO Optimization**: Structured data, meta tags, semantic HTML

## Content Policy

**No Bullshit Rule**: All content must be factual and verifiable. No fabricated client case studies, made-up performance metrics, or fictional project examples. Use generic examples or theoretical scenarios instead of claiming specific real-world implementations that didn't happen.

---

*Last Updated: 2025-07-17*
*Version: 2.0 - Modern Build System*