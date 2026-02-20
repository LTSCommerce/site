# Edmonds Commerce SSG Research

## Executive Summary

Edmonds Commerce uses a Jekyll-based static site for their development blog (edmondscommerce.github.io) while their main website (edmondscommerce.co.uk) uses modern technologies like Next.js and React for a handbook-style knowledge base.

## Repositories Found

### Primary Blog Repository
- **Name**: edmondscommerce/edmondscommerce.github.io
- **URL**: https://github.com/edmondscommerce/edmondscommerce.github.io
- **Type**: Jekyll-based GitHub Pages blog
- **Status**: Public, 7 stars, 6 forks
- **Last Update**: December 21, 2017 (legacy system)
- **Content**: 150+ category directories, 154 pages

### Main Company Website
- **URL**: https://www.edmondscommerce.co.uk
- **Type**: Modern PHP consultancy site with handbook
- **Stack**: Next.js, React 18, TypeScript
- **Backend**: PHP, Laravel, Symfony

## SSG Implementation - Jekyll Blog

### Technology Stack
- **Generator**: Jekyll (Ruby-based static site generator)
- **Hosting**: GitHub Pages (automatic deployment)
- **Content**: HTML files (99.4%), minimal CSS (0.6%)
- **Build**: GitHub Pages native Jekyll integration (zero configuration)

### Content Organization

**Category-Based Hierarchy**:
- Flat directory structure per category
- 150+ category folders
- Kebab-case file naming (e.g., `php-custom-error-handler.html`)

**Categories Include**:
- Programming: PHP, JavaScript, Java, Bash, Python
- E-commerce: Magento 1.x/2.x, Drupal, PrestaShop, OpenCart
- DevOps: Linux, Fedora, Apache, Nginx, Docker, MySQL
- Tools: Behat, Composer, Git, PHPStorm
- Business: SEO, conversion optimization, PageSpeed

**File Structure**:
```
/
├── index.html (12,916 bytes)
├── 404.html (5,089 bytes)
├── index.xml (98,521 bytes RSS feed)
├── /images
├── /img
├── /js
├── /css
├── /categories
├── /featured
└── /[category-name]/
    └── article-name.html
```

### URL Structure

**Category Pages**: `/php/`, `/magento/`, `/docker/`
**Articles**: `/php/custom-error-handler.html`
**Tags**: Static tag pages linking to filtered content
**Search**: Client-side JavaScript (Simple Jekyll Search pattern)
**RSS**: Single feed at `/index.xml`

### Build & Deployment Pipeline

1. **Write**: Author creates HTML file in category directory
2. **Commit**: Push to GitHub master branch
3. **Build**: GitHub Pages automatically runs Jekyll
4. **Deploy**: Static HTML served from GitHub Pages CDN
5. **No CI/CD**: Uses GitHub Pages native build (no Actions)

**Advantages**:
- Zero configuration deployment
- Automatic RSS generation
- Free hosting on GitHub Pages
- Simple, predictable URLs
- No database or backend needed

**Limitations**:
- Cannot handle dynamic URL states (filters, search)
- Static HTML only, no client-side routing
- Manual category management
- Limited to GitHub Pages constraints

## Modern Handbook - Main Site

### Technology Stack (edmondscommerce.co.uk)
- **Frontend**: React 18, Next.js, TypeScript
- **Backend**: PHP, Laravel, Symfony
- **Infrastructure**: Kubernetes, Terraform, Ansible
- **Cloud**: AWS, Google Cloud, Azure, DigitalOcean

### Handbook Organization

**Categories**: Development Tools, Platforms, Languages, Infrastructure, Support
**Structure**: Longer pages vs. deep subcategorization
**Principle**: Categorized by purpose, not data type
**Top-level**: Static single-word names for scannability

## Key Learnings for LTS Commerce

### What Works (Jekyll Blog)
1. **Simple Categories**: Flat directories scale to 150+ categories
2. **GitHub Pages**: Zero-maintenance hosting
3. **Standard URLs**: Clean, predictable structure
4. **RSS Built-in**: Automatic feed generation
5. **Asset Organization**: Clear `/images`, `/js`, `/css` structure

### Limitations
1. **No Dynamic Filtering**: Can't encode filter state in URLs
2. **No Client Routing**: All content is static HTML
3. **Limited Search**: Client-side only, no URL state
4. **Static Only**: Can't generate filtered content sets dynamically

### Adaptations for LTS Commerce

#### Current Vite/React Approach
- Implement URL-based filtering with query parameters
- Example: `/articles?category=php&search=magento`
- Client-side routing preserves SPA benefits
- Can pre-render common routes at build time

#### Next Steps for Full SSG
1. **Pre-render Common Routes**:
   - `/articles` (all articles)
   - `/articles?category=php` (category pages)
   - Individual article pages

2. **URL State Management**:
   - Use query parameters for filters: `?category=php&search=mysql`
   - Pre-generate popular filter combinations
   - Client-side filtering for uncommon combinations

3. **Build Process**:
   - Vite static build → generates HTML files
   - Optional: Add prerendering plugin for popular routes
   - Deploy static files to CDN/GitHub Pages

4. **Content Updates**:
   - Git-based workflow (like ec-site)
   - Automatic rebuild on push (GitHub Actions)
   - Deploy to static hosting

## Comparison Table

| Feature | EC Blog (Jekyll) | EC Main (Next.js) | LTS Current | LTS Recommended |
|---------|------------------|-------------------|-------------|-----------------|
| **Generator** | Jekyll | Next.js | Vite/React | Vite + Prerender |
| **Hosting** | GitHub Pages | Custom | Any | GitHub Pages/Vercel |
| **URLs** | Static paths | Dynamic routes | Client routing | Query params |
| **Search** | Client-side | Server/client | Client-side | URL-based client |
| **Build** | GitHub native | Custom CI | Vite build | Vite + GH Actions |
| **Content** | HTML files | MDX/API | React components | TSX + data files |
| **Deploy** | Auto (GH) | CI/CD | Manual | Auto (GH Actions) |

## Implementation Recommendations

### Phase 1: URL State (✅ Completed)
- Implement query parameter-based filtering
- Articles accessible via `/articles?category=php&search=mysql`
- Shareable, bookmarkable URLs

### Phase 2: Static Optimization
- Add Vite prerender plugin
- Pre-generate popular routes at build time
- Reduces client-side JavaScript execution

### Phase 3: Automated Deployment
- GitHub Actions workflow
- Build on push to main
- Deploy to GitHub Pages or Vercel

### Phase 4: Content Management
- Git-based workflow (like ec-site)
- Article files in `/src/articles`
- Auto-rebuild on content changes

## Conclusion

Edmonds Commerce demonstrates two approaches:
1. **Jekyll (legacy)**: Simple, static, category-based
2. **Next.js (modern)**: Dynamic, handbook-style

For LTS Commerce, a hybrid approach works best:
- React/Vite for modern development
- URL-based state for shareability
- Pre-rendering for performance
- Git-based content workflow

The current implementation with URL query parameters (`?category=php&search=mysql`) aligns well with modern SSG practices while maintaining the simplicity of the ec-site approach.

---

**Sources**:
- https://github.com/edmondscommerce/edmondscommerce.github.io
- https://edmondscommerce.github.io/
- https://www.edmondscommerce.co.uk/
- https://www.edmondscommerce.co.uk/handbook/
