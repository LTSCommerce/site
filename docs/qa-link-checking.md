# Link Checking QA Process

## Problem

Articles can contain broken links due to:
- URLs changing or being deprecated
- Repository names/paths changing (e.g., OpenCoder-8B → OpenCoder-llm)
- Sites blocking automated scrapers (403 errors for legitimate URLs)
- Typos in manual link entry

## Solution: Multi-Layer Link QA

### 1. Pre-Commit Local Check (Optional)

Run before committing articles:

```bash
node scripts/check-links.js
```

This extracts and validates all external links. Note: Some sites (Wikipedia, OpenAI) may return 403 for automated requests but work fine for human visitors.

### 2. CI/CD Pipeline Integration

Add link checking to `.github/workflows/ci.yml`:

```yaml
- name: Check article links
  run: node scripts/check-links-ci.js
  continue-on-error: true  # Don't block deployment, but flag issues
```

### 3. Automated Link Extraction

The `scripts/check-links.js` script should:
- Extract links from EJS article templates
- Validate HTTP status codes
- Report broken links with context
- Distinguish between real breaks (404) and false positives (403 from bot protection)

### 4. Monthly Link Audit

Schedule monthly checks for link rot:

```bash
# Add to GitHub Actions scheduled workflow
- cron: '0 0 1 * *'  # First day of each month
```

## Implementation Details

### Enhanced Link Checker (`scripts/check-links-ci.js`)

Features needed:
1. **Parse EJS templates** to extract all `href` attributes
2. **Smart retries** with user-agent headers for 403s
3. **Whitelist known false positives** (Wikipedia, some documentation sites)
4. **Output format** suitable for CI logs
5. **Exit codes** that don't fail builds but create warnings

### Link Checking Best Practices

**When writing articles:**

1. **Use official documentation links** whenever possible
   - Prefer stable docs over blog posts
   - Link to specific versions when relevant

2. **Link to permanent locations**
   - GitHub repos: Use main branch, not specific commits
   - Documentation: Link to stable/latest, not version-specific unless needed
   - Academic papers: Use DOI or arXiv links (stable)

3. **Test links during article creation**
   - Click every link before committing
   - Verify links work in incognito/private browsing

4. **For version-specific content**
   - GPT-4o system card: Use PDF link (cdn.openai.com) instead of web page
   - Model documentation: Link to official announcements, not third-party coverage
   - Tool versions: Link to GitHub releases or official changelogs

### Known False Positives

These sites may return 403 for automated requests but work fine for users:

- **Wikipedia** (`en.wikipedia.org`) - Anti-bot protection
- **Some OpenAI pages** - CloudFlare protection
- **Medium** - Rate limiting

For these, the link checker should:
1. Attempt with proper User-Agent header
2. If still 403, mark as "Likely OK (protected)" instead of "Broken"
3. Include manual verification reminder in output

### Error Categories

**Critical (Break build):**
- 404 Not Found
- 410 Gone
- 500+ Server errors

**Warning (Flag but don't fail):**
- 403 Forbidden (may be false positive)
- Timeouts (may be temporary)
- Redirects to different domain (verify intentional)

**Info:**
- 301/302 Redirects (update to final URL)
- 429 Rate Limited (retry later)

## Rollout Plan

1. ✅ Create basic link checker script
2. ⏳ Enhance with EJS parsing
3. ⏳ Add to CI pipeline as warning-only
4. ⏳ Create monthly audit workflow
5. ⏳ Build whitelist of known false positives

## Future Enhancements

- **Archive.org integration**: For important broken links, suggest archive.org alternatives
- **Link preview validation**: Check that preview text matches linked content
- **Anchor link validation**: Verify `#section` anchors exist on target pages
- **External link diversity**: Flag if too many links point to same domain

---

*Created: 2025-11-20*
