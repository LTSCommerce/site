# Article Creation Guide for LTS Commerce Site

## Overview

This guide provides instructions for creating high-quality technical articles for the LTS Commerce site. All articles should demonstrate expertise, provide practical value, and be thoroughly researched with proper citations.

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

Example:
```html
<pre><code class="language-javascript">{{SNIPPET:oclif/hello-command.js}}</code></pre>
```

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

- **Extensive hyperlinks** to official documentation, tools, and resources mentioned
- **Primary sources** - Link directly to official docs, not blog posts about them
- **Verification** - All claims must be verifiable through linked sources
- **Current information** - Check that linked resources are up-to-date

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

### 6. Quality Checklist

Before publishing, verify:

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

## Final Notes

The goal is to create articles that:
- Establish technical authority through accuracy and depth
- Provide genuine value to experienced developers
- Stand out through comprehensive research and practical insights
- Build trust through honest, balanced assessments

Remember: Quality over quantity. One thoroughly researched, well-linked article is worth more than ten superficial posts.

---

*Last Updated: 2025-07-22*