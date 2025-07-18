# LTS Commerce Site - Technical Documentation

## Overview

Professional freelance PHP engineer portfolio website showcasing expertise in modern PHP development, infrastructure automation, and high-performance web applications.

## Architecture

### Build System
- **Build Tool**: Vite 5.x (modern, fast ES module bundler)
- **Package Manager**: npm with lockfile for reproducible builds
- **Source Directory**: `private_html/` (development files)
- **Build Output**: `public_html/` (optimized production files)
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
├── private_html/        # Source files (pre-build)
│   ├── css/             # Stylesheets  
│   ├── js/              # JavaScript modules
│   ├── images/          # Static assets
│   ├── articles/        # Article pages
│   └── *.html           # Main pages
├── public_html/         # Built files (production)
├── templates/           # Article templates
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
- **Location**: `private_html/articles/` (source), `public_html/articles/` (built)
- **Format**: Static HTML with embedded metadata
- **Syntax Highlighting**: Automatic language detection for code blocks
- **Categories**: PHP, Infrastructure, Database, AI
- **SEO**: Proper meta tags, structured data, semantic HTML
- **Comments**: HTML comments in source files are removed during build

### Adding New Articles

**FULLY AUTOMATED PROCESS**: Creating articles is now completely automated using metadata extraction:

#### Step 1: Create Article from Template
```bash
# Copy the template to create a new article
cp templates/article-template.html private_html/articles/your-article-slug.html
```

#### Step 2: Edit Article Content
Edit the new article file and replace all `{{PLACEHOLDER}}` values:

**HTML Head Metadata** (automatically extracted):
- `<title>` - Article title (automatically extracted, removes " | Joseph")
- `<meta name="description">` - SEO meta description (becomes excerpt)
- `<meta name="keywords">` - Article tags (comma-separated)
- `<time datetime="YYYY-MM-DD">` - Article date (ISO format)

**HTML Comment Metadata** (for article-specific data only):
```html
<!-- ARTICLE_META:
category: php|infrastructure|database|ai
readingTime: 8
-->
```

**Content Placeholders:**
- `{{ARTICLE_TITLE}}` - Article title (used in multiple places)
- `{{ARTICLE_DESCRIPTION}}` - SEO meta description
- `{{ARTICLE_DATE_ISO}}` - Date in ISO format (YYYY-MM-DD)
- `{{ARTICLE_DATE_FORMATTED}}` - Human-readable date (e.g., "July 18, 2025")
- `{{ARTICLE_CATEGORY}}` - Category from comment metadata
- `{{READING_TIME}}` - Reading time from comment metadata
- `{{ARTICLE_LEAD}}` - Article introduction/lead paragraph
- `{{SECTION_TITLE_*}}` - Section headings
- `{{SECTION_CONTENT_*}}` - Section content
- `{{CODE_EXAMPLE}}` - Code snippets
- `{{LANGUAGE}}` - Programming language for syntax highlighting

#### Step 3: Build and Deploy (Articles Auto-Register!)
```bash
# Test locally (auto-registers articles)
npm run dev

# Build and deploy (auto-registers articles)
npm run build
git add .
git commit -m "Add new article: Your Article Title"
git push origin main
```

**✨ AUTOMATIC FEATURES:**
- **No manual registration needed** - articles are automatically detected and registered
- **Metadata extraction** - title, description, date extracted from HTML head tags
- **Auto-generated articles.js** - data array created from scanned articles
- **Auto-updated vite.config.js** - build paths added automatically
- **Smart ID generation** - unique IDs created from article slugs
- **Consistent ordering** - articles sorted by date (newest first)

**Source vs Built Files:**
- **Source**: `private_html/` contains original HTML with comments and placeholders
- **Built**: `public_html/` contains optimized, comment-free production files
- **Templates**: `templates/` contains reusable article templates

**Benefits of New Structure:**
- Clear separation between source and built files
- HTML comments allowed in source for documentation
- Template-based article creation reduces errors
- Consistent article structure and formatting
- Comments automatically removed in production

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