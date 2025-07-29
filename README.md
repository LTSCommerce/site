# LTS Commerce Portfolio

Professional freelance PHP engineer portfolio website showcasing expertise in modern PHP development, infrastructure automation, and high-performance web applications with hybrid pagination.

## 🚀 Live Site

The portfolio is automatically deployed to GitHub Pages at: **[ltscommerce.dev](https://ltscommerce.dev)**

## 📋 Overview

This is a statically generated portfolio site built with modern web technologies and automated CI/CD deployment. The site features:

- **Modern Build System**: Vite 5.x with ES modules and asset optimization
- **Template-Driven Development**: EJS templating system for maintainable code
- **Automated Deployment**: GitHub Actions CI/CD with quality gates
- **Performance Optimized**: Lighthouse-tested with automated performance monitoring
- **Content Management**: Dynamic article system with syntax highlighting

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Templating**: EJS (Embedded JavaScript templates)
- **Build Tool**: Vite 5.x (ES module bundler)
- **Package Manager**: npm with lockfile
- **Syntax Highlighting**: Highlight.js
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

### Project Structure
```
├── private_html/        # Source files (development)
│   ├── templates/       # EJS template system
│   │   ├── layouts/     # Base layouts (base.ejs, page.ejs, article.ejs)
│   │   ├── partials/    # Reusable components (navigation.ejs, footer.ejs)
│   │   └── components/  # Smaller components (article-card.ejs)
│   ├── pages/           # EJS page templates
│   ├── data/            # Template data (site.json, navigation.json)
│   ├── articles/        # Article EJS templates
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript modules
│   └── images/          # Static assets
├── public_html/         # Built files (production)
├── scripts/             # Build utilities
├── .github/workflows/   # CI/CD configuration
└── qa-tools/           # Code quality tools
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Build Process

The site uses a three-stage build process:

1. **Article Registration** - Scans EJS templates and extracts metadata
2. **Vite Asset Processing** - Bundles and optimizes CSS/JS with hashing
3. **EJS Template Processing** - Converts templates to static HTML

## 📝 Content Management

### Creating New Articles

Articles are created using EJS templates with automated metadata extraction:

1. **Create article template**
   ```bash
   cp private_html/articles/example-article.ejs private_html/articles/your-article-slug.ejs
   ```

2. **Edit the EJS template**
   ```ejs
   <%- include('../templates/layouts/article', {
       articleTitle: 'Your Article Title',
       articleDescription: 'SEO meta description',
       articleDate: '2025-07-25',
       articleCategory: 'php|infrastructure|database|ai',
       articleReadingTime: '6',
       articleContent: `
           <div class="intro">
               <p class="lead">Lead paragraph...</p>
           </div>
           <section>
               <h2>Section Title</h2>
               <pre><code class="language-php"><?php echo "Hello World"; ?></code></pre>
           </section>
       `
   }) %>
   ```

3. **Test locally**
   ```bash
   npm run dev
   ```

4. **Deploy** (articles are automatically registered!)
   ```bash
   git add .
   git commit -m "Add new article: Your Article Title"
   git push origin main
   ```

### Supported Code Languages
- CSS, JavaScript, PHP, Bash, SQL, YAML, JSON, Nginx

## 🚀 Deployment

### Automated Deployment

Every push to the `main` branch triggers the automated CI/CD pipeline:

1. **Auto-Format** - Prettier formats all code and commits changes
2. **Quality Checks** - Linting and code style validation
3. **Build Process** - Three-stage build with asset optimization
4. **Deploy** - Built files committed to repository
5. **GitHub Pages** - Site deployment (triggered only on CI success)
6. **Performance Audit** - Lighthouse testing post-deployment

### Manual Deployment

Force deployment using GitHub Actions UI:
```bash
gh workflow run "Deploy static content to Pages"
```

## 🔧 Development Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview built site
npm run format:check     # Check code formatting (CI only)
npm run lint:check       # Check linting (CI only)
npm run syntax-highlight # Process code syntax highlighting
```

## 📊 Code Quality

**Important**: This project uses CI-only formatting. Do NOT run local formatting commands.

- **Auto-Formatting**: Prettier automatically formats code on push
- **Auto-Fixing**: PHP-CS-Fixer automatically fixes PHP code style
- **Quality Gates**: Deployment blocked if CI checks fail
- **Performance Monitoring**: Automated Lighthouse auditing

## 🐛 Debugging

### Taking Screenshots

Debug layout issues by taking screenshots of live pages:

```bash
node scripts/screenshot.js
# Modify the URL in the script as needed
```

Screenshots are saved to the `var/` directory (gitignored).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally with `npm run dev`
4. Push to your fork - CI will handle formatting and quality checks
5. Create a pull request

### Code Style

- Focus on functionality - CI handles all formatting automatically
- Use semantic HTML and accessible markup
- Follow the existing EJS template patterns
- Include proper syntax highlighting for code blocks

## 📄 License

This is a personal portfolio project. Please respect the content and code structure.

---

**Portfolio Site** | Built with ♥️ using modern web technologies