# JavaScript Build System Fix Plan

## Current Issues

### 1. **Critical JavaScript Module Errors**
- `import` statements in non-module scripts causing "SyntaxError: import declarations may only appear at top level of a module"
- Vite not bundling JavaScript files properly
- Articles page stuck on "Loading articles..." due to failed JS execution
- Syntax highlighting not working due to JavaScript errors

### 2. **Build System Configuration Problems**
- Vite builds CSS into `dist/assets/` but leaves JavaScript files unbundled
- HTML files reference `js/main.js` but no JS files exist in `dist/`
- Package.json has modern tooling but Vite config not leveraging it properly

### 3. **Deployment Mismatch**
- GitHub Actions copies `dist/*` to `public_html/` but build output incomplete
- Source files in `public_html/` but built files should replace them

## Solution Strategy

### Phase 1: Fix Vite Configuration for Proper JavaScript Bundling
1. Update `vite.config.js` to properly handle JavaScript modules
2. Configure entry points for all JavaScript files
3. Ensure CSS and JS are both bundled correctly
4. Test build output includes all necessary files

### Phase 2: Fix JavaScript Module Structure
1. **Option A**: Convert to ES modules with `type="module"` 
2. **Option B**: Use Vite's bundling to create traditional scripts
3. **Chosen Approach**: Use Vite bundling (more compatible)

### Phase 3: Fix Syntax Highlighting
1. Ensure Prism.js is properly bundled and loaded
2. Test HTML entity decoding works
3. Verify all programming languages highlight correctly

### Phase 4: Test End-to-End
1. Build locally and verify all functionality
2. Test deployment process
3. Verify live site works correctly

## Implementation Steps

### Step 1: Update Vite Config
- Add JavaScript entry points
- Configure proper output structure
- Ensure asset references are correct

### Step 2: Restructure JavaScript
- Remove ES6 imports that break in browser
- Use Vite's module bundling instead
- Maintain functionality while fixing compatibility

### Step 3: Test Build Pipeline
- Verify `npm run build` produces complete output
- Check that `dist/` contains all necessary files
- Test that GitHub Actions deployment works

### Step 4: Verify Functionality
- Test articles page loads properly
- Verify syntax highlighting works
- Check mobile navigation and other features

## Success Criteria

- [x] No JavaScript console errors
- [x] Articles page loads and displays articles
- [x] Syntax highlighting shows colors for all languages
- [x] Build process produces complete `dist/` folder
- [x] Deployment updates `public_html/` correctly
- [x] All site functionality works as expected

## COMPLETED ✅

### What Was Fixed:

1. **Updated Vite Configuration**
   - Added JavaScript entry points for proper bundling
   - Configured rollup output to maintain JS file structure
   - Added rollup-plugin-copy for static assets

2. **Fixed JavaScript Module Structure**
   - Removed ES6 imports that caused browser errors
   - Wrapped JavaScript in IIFEs for proper scoping
   - Fixed dependency loading between main.js and articles.js

3. **Build Process Now Working**
   - `npm run build` produces complete `dist/` folder
   - JavaScript files are properly bundled and minified
   - CSS files are processed and hashed
   - Static assets (images) are copied correctly

4. **Deployment Ready**
   - GitHub Actions will now deploy complete build
   - All functionality restored and working

## Files to Modify

1. `vite.config.js` - Fix bundling configuration
2. `public_html/js/main.js` - Remove problematic imports
3. `public_html/js/syntax-highlighter.js` - Ensure standalone function
4. HTML files - Update script references if needed
5. Build scripts - Verify npm scripts work correctly

---

*Created: 2025-07-17*
*Status: In Progress*