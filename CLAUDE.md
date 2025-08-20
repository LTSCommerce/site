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
- **Syntax Highlighting**: Highlight.js (CSS, JavaScript, PHP, Bash, YAML, SQL, JSON, Nginx)
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
│   └── articles/        # Article pages (EJS templates)
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
npm run build           # Build for production (EJS → HTML → optimized build)
# After build, read the generated HTML files directly from public_html/
npm run preview         # Preview built site (optional)
node scripts/process-ejs.js  # Process EJS templates manually (optional)
```

**Note**: For testing changes, use `npm run build` and then read the generated HTML files directly from `public_html/`. The dev server (`npm run dev`) is optional and not required for most development tasks.

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
5. **Article Registration** - Auto-detects and registers new EJS articles
6. **Build** - Vite processes and optimizes all assets (CSS/JS with hashing)
7. **EJS Processing** - Converts EJS templates to static HTML with proper asset paths
8. **Deploy** - Built files deployed to `public_html/` and committed
9. **GitHub Pages** - Deployment triggered only when CI succeeds
10. **Lighthouse** - Performance and SEO auditing (post-deployment)

## Content Management

### Articles
- **Location**: `private_html/articles/` (source), `public_html/articles/` (built)
- **Format**: EJS templates with embedded metadata
- **Syntax Highlighting**: Automatic language detection with Highlight.js for code blocks
- **Categories**: PHP (purple), Infrastructure (green), Database (blue), AI (orange)
- **SEO**: Proper meta tags, structured data, semantic HTML
- **Template Processing**: EJS templates converted to static HTML during build

### Adding New Articles

**MODERN EJS TEMPLATE SYSTEM**: Articles are now created using EJS templates with automated metadata extraction:

#### Step 1: Create Article from Template
```bash
# Create new EJS article template
cp private_html/articles/dynamic-gradient-headings.ejs private_html/articles/your-article-slug.ejs
```

#### Step 2: Edit Article Template
Edit the new EJS file with article metadata and content:

**EJS Template Structure:**
```ejs
<%- include('../templates/layouts/article', {
    articleTitle: 'Your Article Title',
    articleDescription: 'SEO meta description that becomes excerpt',
    articleDate: '2025-07-21',
    articleCategory: 'php|infrastructure|database|ai',
    articleReadingTime: '6',
    articleContent: `
        <div class="intro">
            <p class="lead">Lead paragraph...</p>
        </div>
        
        <section>
            <h2>Section Title</h2>
            <p>Content...</p>
            
            <pre><code class="language-css">/* CSS code */</code></pre>
            <pre><code class="language-javascript">// JavaScript code</code></pre>
        </section>
    `
}) %>
```

**Supported Languages for Syntax Highlighting:**
- `language-css` - CSS stylesheets
- `language-javascript` - JavaScript code
- `language-php` - PHP code
- `language-bash` - Shell/terminal commands
- `language-sql` - Database queries
- `language-yaml` - Configuration files
- `language-json` - JSON data
- `language-nginx` - Nginx configuration

#### Step 3: Build and Deploy (Articles Auto-Register!)
```bash
# Build locally (auto-registers articles)
npm run build
# Review generated HTML in public_html/articles/

# Deploy
git add .
git commit -m "Add new article: Your Article Title"
git push origin main
```

**✨ AUTOMATIC FEATURES:**
- **No manual registration needed** - articles are automatically detected and registered from EJS templates
- **Metadata extraction** - title, description, date extracted from EJS template parameters
- **Auto-generated articles.js** - data array created from scanned EJS articles
- **Auto-updated vite.config.js** - build paths added automatically
- **Smart ID generation** - unique IDs created from article slugs
- **Consistent ordering** - articles sorted by date (newest first)
- **Syntax highlighting** - Automatic code highlighting with Highlight.js included in all articles

**EJS Template Benefits:**
- **Template inheritance** - Consistent layout and structure across all articles
- **Data-driven content** - Structured metadata in template parameters
- **Clean separation** - Content logic separate from presentation
- **Automatic asset linking** - CSS and JS assets properly linked via Vite manifest
- **SEO optimization** - Meta tags, structured data automatically generated
- **Category styling** - Article categories automatically get appropriate colors

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
1. Article Registration (scripts/auto-register-articles.js)
   ├── Scan private_html/articles/*.ejs
   ├── Extract metadata from EJS templates
   └── Generate articles.js with article data

2. Vite Build (vite build)
   ├── Process CSS/JS assets with hashing
   ├── Generate manifest.json for asset paths
   └── Output to public_html/assets/

3. EJS Processing (scripts/process-ejs.js)
   ├── Load Vite manifest for asset paths
   ├── Process page templates (private_html/pages/*.ejs)
   ├── Process article templates (private_html/articles/*.ejs)
   ├── Inject code snippets with HTML escaping
   ├── Apply template inheritance and data injection
   └── Generate static HTML (public_html/*.html)
```

### Code Snippet Best Practices

**CRITICAL**: When embedding code snippets:

1. **Always put closing tags on new line**:
   ```html
   <!-- CORRECT -->
   <pre><code class="language-php">{{SNIPPET:example.php}}
   </code></pre>
   
   <!-- WRONG - will break if last line is a comment -->
   <pre><code class="language-php">{{SNIPPET:example.php}}</code></pre>
   ```

2. **HTML entities are auto-escaped** during build:
   - PHP tags `<?php` become `&lt;?php`
   - Prevents browser interpretation issues
   - All special characters properly escaped

3. **Store snippets separately** in `code-snippets/` directory:
   - Preserves formatting and indentation
   - Easier to maintain and update
   - Enables syntax checking in editors

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

## Documentation Standards

### Code Examples in Documentation

#### When to Link vs When to Show Code

**Link to actual code when:**
- Referencing complete interface definitions (use `See [path/to/file.ts](../path/to/file.ts)`)
- Showing real implementation patterns that exist in the codebase
- Pointing to complex examples that would clutter documentation
- Referencing configuration files or complete class definitions

**Use dummy examples when:**
- Illustrating concepts or patterns generically
- Showing before/after transformations
- Demonstrating anti-patterns to avoid
- Teaching implementation approaches

#### Interface and Type Definitions

**NEVER replicate actual interfaces in documentation.** Always link to the source file:

```typescript
// ❌ WRONG - Replicating actual interface
export interface ILLMDataDTO {
  toLLMData(): Record<string, string>
  // ... other methods
}

// ✅ CORRECT - Link to actual interface
// See [src/core/interfaces/ILLMDataDTO.ts](../src/core/interfaces/ILLMDataDTO.ts) for the complete interface.
```

#### Dummy Code Naming Conventions

All dummy examples must use clear naming conventions:

**Dummy Services:** `MyService`, `ExampleService`, `SampleDataService`
**Dummy DTOs:** `MyDataDTO`, `ExampleDTO`, `SampleDTO`
**Dummy Interfaces:** `IMyService`, `IExampleApi`
**Dummy Types:** `TMyConfig`, `TExampleResponse`
**Dummy Variables:** `exampleData`, `sampleResponse`, `mockApiResult`
**Dummy Constants:** `EXAMPLE_FIELD`, `SAMPLE_KEY`, `DUMMY_VALUE`

#### Magic String Prevention

**Never use actual production keys/constants in examples:**

```typescript
// ❌ WRONG - Using actual production constants
result.addData('PROJECT_COUNT', '5')  // PROJECT_COUNT might be real

// ✅ CORRECT - Clearly dummy examples
result.addData('EXAMPLE_FIELD', 'sample-value')
result.addData(ExampleKeys.SAMPLE_FIELD, 'dummy-data')
```

#### Code Synchronization Rules

**For code snippets that reference real files:**
1. Always include a comment indicating the source file
2. Use `// Snippet from [filename]` to indicate partial code
3. Keep snippets under 20 lines - link to full file for complete examples
4. Update snippets when referenced files change significantly

**For complete dummy examples:**
1. Make them self-contained and runnable conceptually
2. Use consistent dummy naming throughout the same document
3. Ensure examples follow current coding standards and patterns

### Documentation Maintenance

#### Cross-Reference Integrity

All documentation must maintain mutual coherence:

**Link Verification:** All relative links must point to existing files
**Consistency Checking:** Ensure terminology and patterns match across all docs
**Version Alignment:** Keep examples aligned with current implementation patterns

#### Contradiction Detection

Before publishing documentation changes:

1. **Scan for conflicting information** across all docs
2. **Identify authoritative sources** for disputed information
3. **Resolve contradictions** by updating outdated information
4. **Add cross-references** to prevent future inconsistencies

#### Content Hierarchy

Documentation should follow clear information prioritization:

1. **Core concepts first** - fundamental principles and architecture
2. **Common use cases** - 80% of developer needs
3. **Edge cases and advanced topics** - specialized scenarios
4. **Troubleshooting** - problem resolution patterns

## Content Policy

**No Bullshit Rule**: All content must be factual and verifiable. No fabricated client case studies, made-up performance metrics, or fictional project examples. Use generic examples or theoretical scenarios instead of claiming specific real-world implementations that didn't happen.

---

---

*Last Updated: 2025-07-21*
*Version: 3.0 - EJS Template System with Enhanced Article Management*

## Recent Updates (v3.0)

### Article System Enhancements
- **EJS Templates**: Converted all articles from static HTML to EJS templates
- **Syntax Highlighting**: Integrated Highlight.js for automatic code highlighting
- **Category Colors**: Added visual category distinctions (PHP=purple, Infrastructure=green, Database=blue, AI=orange)
- **Template Inheritance**: Consistent article layout through template system
- **Dynamic Gradients**: Mouse-responsive gradient effects on headings

### Build System Improvements
- **Three-Stage Build**: Article registration → Vite asset processing → EJS template processing
- **Asset Hashing**: Vite-managed asset hashing with manifest-driven path resolution
- **Automated Deployment**: Full CI/CD pipeline with quality gates and auto-formatting