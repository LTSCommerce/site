# Article Creation Guide for LTS Commerce Site

## Overview

This guide provides instructions for creating high-quality technical articles for the LTS Commerce site. All articles should demonstrate expertise, provide practical value, and be thoroughly researched with proper citations.

## Critical Requirement: Real-Time Research

**⚠️ WARNING**: Training data is ALWAYS outdated. You MUST research current information for every article.

### Why This Matters

1. **Technology moves fast** - What was true 6 months ago may be obsolete
2. **Version confusion** - Readers need accurate, current version information
3. **Security implications** - Outdated practices can be dangerous
4. **Professional credibility** - Wrong version info destroys trust

### Research Requirements

Before writing ANY technical content:
1. **Check current version** - Visit npm, GitHub releases, official docs
2. **Verify features** - Confirm features exist in the current version
3. **Read recent updates** - Check blog posts from the last 3-6 months
4. **Examine breaking changes** - Review migration guides and changelogs
5. **Test assumptions** - What you "know" may be wrong

### Research Tools

Use these tools for EVERY article:
- `WebSearch` - Find current documentation and recent articles
- `WebFetch` - Read official docs, GitHub pages, and release notes
- Cross-reference multiple sources
- Check publication dates on all sources

## Article Creation Process

### 1. Create Article Template

```bash
# Copy from an existing article as a starting point
cp private_html/articles/oclif-cli-framework-guide.ejs private_html/articles/your-article-slug.ejs
```

### 2. Article Structure

```ejs
<%- include('../templates/layouts/article', {
    articleTitle: 'Your Article Title',
    articleDescription: 'SEO-friendly description (150-160 chars)',
    articleDate: 'YYYY-MM-DD',
    articleCategory: 'php|infrastructure|database|ai|typescript',
    articleReadingTime: 'X', // minutes
    articleContent: `
        <!-- Article content here -->
    `
}) %>
```

### 3. Code Snippets

For proper code formatting that preserves indentation:

1. Create code snippet files in `code-snippets/article-name/`
2. Use placeholder tags in the article: `{{SNIPPET:article-name/filename.ext}}`
3. **IMPORTANT**: Always put closing `</code></pre>` tags on a new line

Example:
```html
<pre><code class="language-javascript">{{SNIPPET:oclif/hello-command.js}}
</code></pre>
```

**Critical**: The closing tags MUST be on a new line. If they're on the same line as the last line of code (especially comments), they'll be treated as part of the code.

**HTML Escaping**: The build process automatically escapes HTML entities in code snippets:
- `<` becomes `&lt;`
- `>` becomes `&gt;`
- `&` becomes `&amp;`
- Quotes are escaped properly

This prevents issues with PHP opening tags (`<?php`) and other HTML-like content in code examples.

### 4. Build and Deploy

```bash
npm run build        # Local build
git add .
git commit -m "Add article: Your Article Title"
git push origin main # Triggers auto-deployment
```

## Style Guidelines

### 1. Research and Citations

**MANDATORY**: All technical articles must include:

- **Real-time research** - NEVER rely on training data. Always research current versions, features, and best practices
- **Bleeding-edge accuracy** - Check GitHub releases, official docs, and recent blog posts for the latest information
- **Version verification** - Confirm exact version numbers and release dates through official sources
- **Extensive hyperlinks** to official documentation, tools, and resources mentioned
- **Primary sources** - Link directly to official docs, not blog posts about them
- **Verification** - All claims must be verifiable through linked sources
- **Current information** - Check that linked resources are up-to-date

**CRITICAL**: Training data is often months or years out of date. For example:
- Framework versions change frequently (e.g., oclif v4 released June 2024)
- Best practices evolve rapidly
- Tool features are added monthly
- Security recommendations change

Always use WebSearch and WebFetch to verify:
- Current version numbers
- Latest features and updates
- Recent breaking changes
- Current best practices
- Active community discussions

### Research Process Example

**BAD** (using training knowledge):
```
"The latest version includes new features like..."
"This framework recently added support for..."
"Version 3 is the current stable release..."
```

**GOOD** (after research):
```
"Version X.Y.Z (released [exact date from GitHub]) includes..."
"According to npm, the current version published [days] ago is..."
"The official documentation confirms these features in v[number]..."
```

Example of well-linked content:
```html
<p>
    <a href="https://oclif.io/" target="_blank" rel="noopener">Oclif</a> is an 
    open-source framework for building command-line interfaces in 
    <a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js</a> and 
    <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>.
</p>
```

### 2. Content Structure

#### Opening Section
- **Lead paragraph** in `<div class="intro"><p class="lead">` 
- Hook the reader with the problem being solved
- Establish credibility and scope

#### Body Sections
- Use `<section>` tags for major topics
- Hierarchical headings: `<h2>` for main sections, `<h3>` for subsections
- One idea per paragraph
- Use lists for multiple related points

#### Code Examples
- Always use appropriate language classes: `language-php`, `language-javascript`, etc.
- Provide context before code blocks
- Keep examples practical and runnable
- Comment complex sections

#### Conclusion
- Summarize key takeaways
- Provide actionable next steps
- Avoid generic endings

### 3. Writing Style

#### Technical Accuracy
- **No fabrication** - Never invent case studies or metrics
- **Practical focus** - Real-world applications over theory
- **Honest assessment** - Include limitations and drawbacks
- **Balanced perspective** - Pros AND cons for tools/approaches

#### Tone and Voice
- **Professional** but approachable
- **Confident** without being arrogant  
- **Instructive** rather than prescriptive
- **Evidence-based** claims only

#### Formatting Standards
- **Links**: All external links must include `target="_blank" rel="noopener"`
- **Emphasis**: Use `<strong>` for important terms, not just bold
- **Lists**: Use `<ul>` for unordered, `<ol>` for sequential steps
- **Terms**: Define technical terms on first use

### 4. SEO Best Practices

- **Title**: 50-60 characters, include primary keyword
- **Description**: 150-160 characters, compelling and accurate
- **Headers**: Use keywords naturally in h2/h3 tags
- **Alt text**: Describe any images for accessibility

### 5. Categories

Available categories and their focus:
- **php** - PHP development, frameworks, best practices
- **infrastructure** - DevOps, hosting, deployment, automation
- **database** - MySQL, PostgreSQL, optimization, architecture
- **ai** - AI tools, ML integration, automation
- **typescript** - TypeScript, Node.js, modern JavaScript

#### Adding a New Category

1. **Add category to `private_html/data/categories.json`**:
   ```json
   "newcategory": {
     "label": "New Category",
     "description": "Description of what this category covers",
     "backgroundColor": "#hexcolor",
     "textColor": "#hexcolor"
   }
   ```

2. **Use the category in your article**: `articleCategory: 'newcategory'`

3. **Build the site** - Category styles are auto-generated and filters appear automatically!

The system will:
- Validate categories during article registration
- Generate CSS styles automatically
- Create filter buttons dynamically
- Display proper labels everywhere

### 6. Quality Checklist

Before publishing, verify:

- [ ] **Current research completed** - All version numbers and features verified through official sources
- [ ] **No training data used** - Everything fact-checked with real-time research
- [ ] **Dates are current** - No references to "recently" or "latest" without specific dates
- [ ] **Version numbers verified** - Exact versions confirmed via npm, GitHub, or official docs
- [ ] All external tools/libraries are linked
- [ ] Code snippets are stored separately and injected
- [ ] Article provides practical, actionable value
- [ ] No fabricated examples or metrics
- [ ] Pros and cons are balanced
- [ ] All links work and use proper attributes
- [ ] Grammar and spelling are correct
- [ ] Reading time estimate is accurate

### 7. Example Article Sections

#### Well-Researched Tool Comparison
```html
<h3><a href="https://github.com/tj/commander.js" target="_blank" rel="noopener">Commander.js</a></h3>
<p>The lightweight choice for simple CLIs:</p>
<ul>
    <li>Minimal learning curve</li>
    <li>Small footprint (only <a href="https://bundlephobia.com/package/commander" target="_blank" rel="noopener">12KB gzipped</a>)</li>
    <li>Great for basic scripts</li>
    <li>Limited plugin support</li>
</ul>
```

#### Resource Section
```html
<h3>Official Resources</h3>
<ul>
    <li><a href="https://docs.example.com">Official Documentation</a> - Comprehensive API reference</li>
    <li><a href="https://github.com/example/repo">GitHub Repository</a> - Source code and issues</li>
    <li><a href="https://example.com/tutorial">Getting Started</a> - Official tutorial</li>
</ul>
```

## Article Types

### 1. Technical Deep Dives
- Comprehensive exploration of a technology
- Include architecture, best practices, examples
- Compare with alternatives
- Real-world use cases

### 2. Practical Guides
- Step-by-step implementation
- Complete, working code examples
- Common pitfalls and solutions
- Performance considerations

### 3. Tool Comparisons
- Objective analysis of competing solutions
- Benchmarks where applicable
- Decision matrices
- Specific use case recommendations

### 4. Best Practices
- Industry-standard approaches
- Code organization patterns
- Security considerations
- Testing strategies

## Common Pitfalls to Avoid

1. **Unsupported claims** - Every technical assertion needs evidence
2. **Outdated information** - Verify all version numbers and practices
3. **Missing context** - Explain why, not just how
4. **Code without explanation** - Every snippet needs introduction
5. **Absolute statements** - Technology choices are rarely black and white
6. **SEO keyword stuffing** - Write for humans first
7. **Plagiarism** - All content must be original

## Real-World Example: The Importance of Research

### Example: Writing About Any Technical Tool

**❌ WRONG (Using Training Data)**:
```
"[Framework] recently released version 3 with [feature]. The latest update 
includes new features like [feature that might be outdated]..."
```

**✅ CORRECT (After Research)**:
```
"[Framework] version [X.Y.Z] (released [exact date]) is the current stable release. 
Version [X], released in [month year], brought [specific feature] with [details]. 
The latest updates include [feature] (v[X.Y.Z]) and [feature] (v[X.Y.Z])..."
```

The difference:
- Training data had outdated version info
- Might miss entire major version releases
- Vague timeline ("recent" vs specific dates)
- Missing current features and updates
- No verifiable sources or links

## Final Notes

The goal is to create articles that:
- Establish technical authority through accuracy and depth
- Provide genuine value to experienced developers
- Stand out through comprehensive research and practical insights
- Build trust through honest, balanced assessments

Remember: Quality over quantity. One thoroughly researched, well-linked article is worth more than ten superficial posts.

---

*Last Updated: 2025-07-22*