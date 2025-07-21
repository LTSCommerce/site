# EJS Templating Implementation Plan

## Overview

Transform the static HTML site into a template-driven system using EJS, maintaining all existing functionality while enabling efficient content management and reducing code duplication.

## Current State Analysis

### Existing Architecture
- **Source**: `private_html/` with static HTML files
- **Build**: Vite processes to `public_html/` with asset optimization
- **Template System**: Basic placeholder replacement (`{{ARTICLE_TITLE}}`)
- **Articles**: Auto-registration system with metadata extraction
- **Build Pipeline**: article registration → code embedding → Vite build → deployment

### Current Pain Points
- 🔴 **Code Duplication**: Navigation, header, footer repeated in every file
- 🔴 **Manual HTML**: No template inheritance or component reuse
- 🔴 **Inconsistent Updates**: Changes require editing multiple files
- 🔴 **Limited Logic**: No conditional rendering or loops in templates

## Implementation Strategy

### Phase 1: Foundation Setup
**Duration**: 2-3 hours
**Risk**: Low
**Priority**: High

#### 1.1 Install EJS Plugin
- [ ] Install `vite-plugin-ejs` package
- [ ] Configure plugin in `vite.config.js`
- [ ] Test basic EJS processing with simple template

#### 1.2 Directory Structure
```
private_html/
├── templates/
│   ├── layouts/
│   │   ├── base.ejs           # Base HTML structure
│   │   ├── page.ejs           # Standard page layout
│   │   └── article.ejs        # Article-specific layout
│   ├── partials/
│   │   ├── head.ejs           # HTML head section
│   │   ├── navigation.ejs     # Site navigation
│   │   ├── header.ejs         # Page headers
│   │   └── footer.ejs         # Site footer
│   └── components/
│       ├── article-card.ejs   # Article listing component
│       └── code-block.ejs     # Syntax highlighted code
├── data/
│   ├── site.json             # Global site data
│   ├── navigation.json       # Navigation structure
│   └── articles.json         # Article metadata (existing)
├── pages/                    # Source EJS pages
│   ├── index.ejs
│   ├── about.ejs
│   ├── services.ejs
│   └── articles/
│       └── *.ejs
├── assets/                   # Renamed from existing structure
│   ├── css/
│   ├── js/
│   └── images/
```

#### 1.3 Data Structure Design
```json
// data/site.json
{
  "title": "Joseph - Bespoke PHP Developer",
  "description": "Bespoke PHP developer specializing in high-complexity systems",
  "author": "Joseph",
  "baseUrl": "https://josephlts.co.uk",
  "social": {
    "github": "josephltshq",
    "linkedin": "josephltshq"
  }
}

// data/navigation.json
{
  "main": [
    { "label": "Home", "path": "/", "key": "home" },
    { "label": "Services", "path": "/services.html", "key": "services" },
    { "label": "Articles", "path": "/articles.html", "key": "articles" },
    { "label": "About", "path": "/about.html", "key": "about" },
    { "label": "Author", "path": "/author.html", "key": "author" },
    { "label": "Contact", "path": "/contact.html", "key": "contact" }
  ]
}
```

### Phase 2: Core Template System
**Duration**: 4-5 hours
**Risk**: Medium
**Priority**: High

#### 2.1 Base Layout Template
- [ ] Create `templates/layouts/base.ejs` with:
  - HTML5 document structure
  - Dynamic head section inclusion
  - Navigation integration
  - Footer integration
  - Asset path handling for Vite

#### 2.2 Partial Components
- [ ] Extract navigation to `templates/partials/navigation.ejs`
  - Dynamic active state based on current page
  - Mobile responsive toggle
- [ ] Extract head section to `templates/partials/head.ejs`
  - Dynamic title, description, keywords
  - Font loading, CSS includes
- [ ] Extract footer to `templates/partials/footer.ejs`

#### 2.3 Page Layout Templates
- [ ] Create `templates/layouts/page.ejs` for standard pages
- [ ] Create `templates/layouts/article.ejs` for article pages
  - Article metadata display
  - Breadcrumb navigation
  - Reading time, categories
  - Related articles section

#### 2.4 Vite Plugin Configuration
```javascript
// vite.config.js additions
import { defineConfig } from 'vite';
import ejs from 'vite-plugin-ejs';
import { resolve } from 'path';

// Load global data
const siteData = JSON.parse(fs.readFileSync('./private_html/data/site.json', 'utf8'));
const navigationData = JSON.parse(fs.readFileSync('./private_html/data/navigation.json', 'utf8'));
const articlesData = JSON.parse(fs.readFileSync('./private_html/data/articles.json', 'utf8'));

export default defineConfig({
  plugins: [
    ejs({
      // Global template data
      site: siteData,
      navigation: navigationData,
      articles: articlesData,
      // Helper functions
      currentYear: new Date().getFullYear(),
      formatDate: (date) => new Date(date).toLocaleDateString('en-GB'),
      isActive: (currentPage, targetPage) => currentPage === targetPage
    })
  ],
  // ... rest of config
});
```

### Phase 3: Content Migration
**Duration**: 3-4 hours  
**Risk**: High
**Priority**: High

#### 3.1 Page Templates Migration
- [ ] Convert `index.html` → `pages/index.ejs`
- [ ] Convert `about.html` → `pages/about.ejs`
- [ ] Convert `services.html` → `pages/services.ejs`
- [ ] Convert `articles.html` → `pages/articles.ejs`
- [ ] Convert `contact.html` → `pages/contact.ejs`
- [ ] Convert `author.html` → `pages/author.ejs`

#### 3.2 Article Templates Migration
- [ ] Update `templates/article-template.html` → `templates/article-template.ejs`
- [ ] Migrate existing articles incrementally:
  - Replace navigation with `<%- include('../templates/partials/navigation', { current: 'articles' }) %>`
  - Replace head section with dynamic data
  - Use article layout template

#### 3.3 Template Data Integration
- [ ] Integrate with existing `articles.js` data
- [ ] Ensure auto-registration still works
- [ ] Update build scripts to work with EJS

### Phase 4: Advanced Features
**Duration**: 2-3 hours
**Risk**: Low
**Priority**: Medium

#### 4.1 Template Components
- [ ] Create `templates/components/article-card.ejs`
  - Reusable article listing component
  - Category badges, reading time display
- [ ] Create `templates/components/code-block.ejs`
  - Syntax highlighted code blocks
  - Language detection integration

#### 4.2 Template Helpers & Functions
```javascript
// Helper functions for templates
{
  // Format date consistently
  formatDate: (date) => new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  }),
  
  // Truncate text for excerpts
  truncate: (text, length = 150) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
  
  // Check if current page for navigation
  isActive: (current, target) => current === target,
  
  // Generate article URL
  articleUrl: (slug) => `/articles/${slug}.html`,
  
  // Filter articles by category
  articlesByCategory: (articles, category) => {
    return articles.filter(article => article.category === category);
  },
  
  // Get recent articles
  recentArticles: (articles, limit = 5) => {
    return articles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}
```

### Phase 5: Build System Integration
**Duration**: 3-4 hours
**Risk**: High
**Priority**: High

#### 5.1 Build Pipeline Updates
```javascript
// Updated build process
"scripts": {
  "dev": "vite",
  "build": "node scripts/prepare-ejs-data.js && node scripts/auto-register-articles.js && node embed-code-snippets.js && vite build",
  "articles:register": "node scripts/auto-register-articles.js && node scripts/prepare-ejs-data.js"
}
```

#### 5.2 New Build Scripts
- [ ] Create `scripts/prepare-ejs-data.js`
  - Prepare template data from various sources
  - Merge site config, articles, navigation
  - Generate dynamic data for templates

#### 5.3 Vite Config Updates
- [ ] Update input paths to reference EJS files
- [ ] Ensure asset processing works with templates
- [ ] Configure EJS file extensions and processing
- [ ] Maintain existing HTML comment removal

#### 5.4 Integration Testing
- [ ] Test development server with EJS templates
- [ ] Test build process produces correct HTML
- [ ] Verify asset paths and references
- [ ] Test article auto-registration still works

### Phase 6: Migration Verification & Optimization
**Duration**: 2-3 hours
**Risk**: Low
**Priority**: High

#### 6.1 Content Verification
- [ ] Compare built HTML with original files (automated diff)
- [ ] Verify all navigation links work
- [ ] Check asset loading and CSS/JS inclusion
- [ ] Test responsive navigation and mobile experience

#### 6.2 SEO & Meta Data Verification
- [ ] Verify all meta tags are properly populated
- [ ] Check structured data is preserved
- [ ] Test article metadata display
- [ ] Validate HTML markup

#### 6.3 Performance Testing
- [ ] Compare build times before/after EJS
- [ ] Test development server performance
- [ ] Verify asset optimization still works
- [ ] Check Lighthouse scores are maintained

#### 6.4 CI/CD Integration
- [ ] Test GitHub Actions pipeline with EJS build
- [ ] Verify deployment process works
- [ ] Check formatting/linting compatibility
- [ ] Test auto-deployment triggers

## Critical Gotchas & Risk Mitigation

### 🚨 High-Risk Issues

#### 1. **Build Order Dependencies**
**Risk**: EJS processing conflicts with existing build scripts
**Mitigation**: 
- Update build scripts to prepare data before EJS processing
- Test each build step independently
- Create rollback plan with git branches

#### 2. **Asset Path Resolution**
**Risk**: Template assets fail to load after processing
**Mitigation**:
- Test asset paths in both dev and build modes
- Use Vite's asset importing in templates
- Create path helper functions for consistent URLs

#### 3. **HTML Comment Removal**
**Risk**: EJS comments conflict with existing comment removal
**Mitigation**:
- Update comment removal plugin to handle EJS
- Test comment processing in templates
- Verify metadata comments are preserved where needed

#### 4. **Article Auto-Registration**
**Risk**: EJS conversion breaks existing article system
**Mitigation**:
- Maintain existing articles.json structure
- Test auto-registration with EJS files
- Create migration script for gradual conversion

#### 5. **Development/Build Parity**
**Risk**: Templates work in dev but fail in build
**Mitigation**:
- Test both modes continuously during development
- Use same data sources in dev and build
- Create automated comparison tests

### ⚠️ Medium-Risk Issues

#### 6. **Template Performance**
**Risk**: EJS processing slows build times
**Solution**: Pre-compile templates, cache data loading

#### 7. **CSS/JS Integration**
**Risk**: Template-specific assets don't load properly  
**Solution**: Update Vite input config, test asset imports

#### 8. **Mobile Navigation**
**Risk**: JavaScript navigation breaks with templates
**Solution**: Test interactive components, update JS selectors

### ✅ Best Practices Implementation

#### Template Organization
- **Consistent naming**: Use kebab-case for files, camelCase for data
- **Clear separation**: layouts vs partials vs components vs pages
- **Documentation**: Comment complex template logic
- **Reusability**: Design components for maximum reuse

#### Data Management
- **Single source of truth**: Centralize site configuration
- **Type safety**: Document expected data structures
- **Validation**: Check required data exists before templating
- **Performance**: Load data once, reuse across templates

#### Development Workflow
- **Incremental migration**: Convert pages one at a time
- **Testing**: Compare output HTML before/after conversion
- **Version control**: Use feature branch, test before merging
- **Rollback plan**: Keep original files until fully tested

#### Production Readiness
- **Error handling**: Graceful fallbacks for missing data
- **Caching**: Optimize template compilation and data loading
- **Monitoring**: Track build performance and success rates
- **Documentation**: Update README and developer docs

## Success Criteria

### ✅ Functional Requirements
- [ ] All existing pages render identically to current versions
- [ ] Navigation works correctly with active states
- [ ] Article system continues to function (auto-registration, metadata)
- [ ] Build process completes successfully
- [ ] Development server works with hot reload
- [ ] CI/CD pipeline deploys successfully

### ✅ Non-Functional Requirements
- [ ] Build time increase < 20% from baseline
- [ ] Development server startup < 10 seconds
- [ ] Template errors fail the build (no silent failures)
- [ ] All existing npm scripts work unchanged
- [ ] Lighthouse scores maintained or improved

### ✅ Developer Experience
- [ ] Creating new pages requires only EJS template creation
- [ ] Common elements (nav, footer) are single-source
- [ ] Article creation process is unchanged or improved
- [ ] Clear documentation for template system
- [ ] Easy rollback process if issues arise

## Timeline & Resource Allocation

**Total Estimated Time**: 16-20 hours over 5-7 days
**Critical Path**: Phases 1-3 and 5 (core functionality)
**Testing Time**: ~25% of development time
**Documentation**: 2-3 hours (update README, create template docs)

## Rollback Strategy

### Emergency Rollback (< 5 minutes)
```bash
git checkout main
npm run build
git push origin main
```

### Partial Rollback (maintain some templates)
- Keep template system but revert problem areas
- Use git cherry-pick for selective changes
- Maintain hybrid approach during debugging

### Data Preservation
- Backup current `articles.json` before migration
- Preserve all original HTML files in git history
- Document any data structure changes for recovery

---

**Plan Status**: Ready for Implementation  
**Last Updated**: 2025-07-21  
**Estimated Completion**: 5-7 days with testing  
**Risk Level**: Medium (manageable with proper testing)  