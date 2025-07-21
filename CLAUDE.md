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
- **Templating**: EJS (Embedded JavaScript templates) for template-driven development
- **Build Pipeline**: Custom EJS preprocessing → Vite (ES modules, CSS processing, optimization)
- **Syntax Highlighting**: Prism.js (PHP, Bash, YAML, SQL, JSON, Nginx)
- **Code Quality**: ESLint + Prettier + Lighthouse CI
- **CI/CD**: GitHub Actions with automated deployment
- **Performance**: Optimized assets, lazy loading, performance monitoring

### Site Structure
```
├── private_html/        # Source files (pre-build)
│   ├── templates/       # EJS template system
│   │   ├── layouts/     # Base layouts (base.ejs, page.ejs, article.ejs)
│   │   ├── partials/    # Reusable components (navigation.ejs, footer.ejs)
│   │   └── components/  # Smaller components (article-card.ejs)
│   ├── pages/           # EJS page templates (*.ejs)
│   ├── data/            # Template data (site.json, navigation.json)
│   ├── css/             # Stylesheets  
│   ├── js/              # JavaScript modules
│   ├── images/          # Static assets
│   ├── articles/        # Article pages (static HTML)
│   └── *.html           # Generated HTML from EJS templates
├── public_html/         # Built files (production)
├── templates/           # Legacy article templates
├── scripts/             # Build utilities (process-ejs.js, screenshot.js)
├── var/                 # Temporary files (gitignored except .gitignore)
└── .github/workflows/   # CI/CD configuration
```

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server (port 3000)
npm run build           # Build for production (EJS → HTML → optimized build)
npm run preview         # Preview built site
node scripts/process-ejs.js  # Process EJS templates manually (optional)
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

### Debugging & Screenshots

Take screenshots of live pages for debugging layout issues:

```bash
# Take screenshot of specific page
node scripts/screenshot.js
# Modify the URL in the script as needed
```

Screenshots are saved to `var/` directory which is gitignored. The screenshot script uses Playwright to capture high-quality screenshots for debugging visual issues.

**Script Configuration:**
- Default viewport: 1920x1080 (desktop)
- Waits for network idle before capturing
- Configurable clip area for focusing on specific sections
- Outputs PNG files to `var/` directory

### Deployment Process
1. **Push to main branch** triggers GitHub Actions CI/CD pipeline
2. **Auto-Format** - Prettier automatically formats all code and commits changes
3. **Auto-Fix PHP** - PHP-CS-Fixer automatically fixes PHP code style issues
4. **Quality Checks** - Linting and code style validation (deployment blocked if fails)
5. **Article Registration** - Auto-detects and registers new articles
6. **Code Embedding** - Embeds syntax-highlighted code snippets
7. **EJS Processing** - Converts EJS templates to static HTML
8. **Build** - Vite processes and optimizes all assets
9. **Deploy** - Built files copied to `public_html/` and committed
10. **GitHub Pages** - Deployment triggered only when CI succeeds
11. **Lighthouse** - Performance and SEO auditing (post-deployment)

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

## EJS Template System

### Overview
The site uses a custom EJS (Embedded JavaScript) templating system for template-driven development, eliminating code duplication and enabling data-driven content.

### Template Architecture
- **Layouts**: Base HTML structure with template inheritance
  - `base.ejs` - Core HTML document with navigation/footer
  - `page.ejs` - Standard page layout with hero section
  - `article.ejs` - Article-specific layout with metadata
- **Partials**: Reusable components
  - `navigation.ejs` - Site navigation with active states
  - `footer.ejs` - Site footer with copyright/links  
- **Components**: Smaller reusable elements
  - `article-card.ejs` - Reusable article listing component

### Template Data
Global data available in all templates:
```javascript
{
  site: {              // From private_html/data/site.json
    title: "Site Title",
    description: "...",
    author: "Joseph",
    tagline: "...",
    social: { github, linkedin },
    contact: { email }
  },
  navigation: {        // From private_html/data/navigation.json  
    main: [{ label, path, key }, ...]
  },
  articles: [...],     // From auto-generated articles.js
  
  // Helper functions
  currentYear: 2025,
  formatDate: (date) => "21 July 2025",
  isActive: (current, target) => boolean,
  truncate: (text, length) => "...",
  articleUrl: (slug) => "/articles/slug.html"
}
```

### Creating New Pages
1. Create EJS template in `private_html/pages/filename.ejs`
2. Use template inheritance: `<%- include('../templates/layouts/base', { ... }) %>`
3. Run `node scripts/process-ejs.js` to generate HTML
4. Build process automatically includes EJS processing

### Build Process
```
EJS Templates (*.ejs) 
  ↓ scripts/process-ejs.js
Static HTML (*.html)
  ↓ Vite build
Optimized Production Files
```

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