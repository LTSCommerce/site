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

### Code Quality
```bash
npm run format          # Auto-format with Prettier
npm run lint            # Lint JavaScript with ESLint
npm run syntax-highlight # Process code syntax highlighting
```

### Deployment Process
1. **Push to main branch** triggers GitHub Actions
2. **Lint & Format** - Code quality checks and auto-formatting
3. **Build** - Vite processes and optimizes all assets
4. **Deploy** - Built files copied to `public_html/` and committed
5. **Lighthouse** - Performance and SEO auditing

## Content Management

### Articles
- **Location**: `public_html/articles/`
- **Format**: Static HTML with embedded metadata
- **Syntax Highlighting**: Automatic language detection for code blocks
- **Categories**: PHP, Infrastructure, Database, AI
- **SEO**: Proper meta tags, structured data, semantic HTML

### Adding New Articles
1. Create HTML file in `public_html/articles/`
2. Add entry to `public_html/js/articles.js` data array
3. Include proper meta tags and structured markup
4. Use semantic HTML and proper heading hierarchy
5. Test locally before deploying

## Configuration Files

- `package.json` - Dependencies and npm scripts
- `vite.config.js` - Build configuration
- `.github/workflows/ci.yml` - CI/CD pipeline
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

---

*Last Updated: 2025-07-17*
*Version: 2.0 - Modern Build System*