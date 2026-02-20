# Plan 003: Contact Form with Google Apps Script Backend

**Status**: 📋 Planned
**Created**: 2026-02-20
**Owner**: Claude Code
**Priority**: High
**Type**: Feature Implementation
**Related**: Plan 001 (React Migration - Phase 5 Complete)

## ⚠️ Execution Workflow: Worktree Required

This plan **must** be executed using the git worktree workflow. Read the full documentation before starting any implementation:

**@CLAUDE/Worktree.md**

```bash
# Setup: create parent worktree before any implementation
git worktree add untracked/worktrees/worktree-plan-003 -b worktree-plan-003
```

- All implementation work happens inside the worktree — never directly in `/workspace`
- Child → Parent merges: automatic (no approval needed)
- Parent → `react-migration` merge: **requires explicit human approval**

## Overview

Replace the current LTS Commerce contact form's `mailto:` approach with a proper Google Apps Script backend. The current contact page (`src/pages/Contact.tsx`) uses `window.location.href = mailtoLink` which opens the user's email client -- this is unreliable (requires a configured mail client), provides no spam protection, and gives no confirmation of delivery.

The target solution lifts the proven contact form architecture from the EC site: React Hook Form with Zod validation on the client, posting to a Google Apps Script web app that validates server-side and sends formatted email via Gmail's MailApp service. The EC site's implementation includes honeypot spam protection, rate limiting, and optional Cloudflare Turnstile -- all battle-tested in production.

This plan covers both the backend deployment (Google Apps Script) and the frontend replacement (React component), adapted for LTS Commerce branding and domain.

## Goals

1. **Working contact form**: Submissions arrive in Joseph's inbox as formatted emails
2. **Spam protection**: Honeypot field silently blocks bots without user friction
3. **Rate limiting**: Server-side rate limiting (10 submissions/hour) via Apps Script Properties Service
4. **Client-side validation**: Real-time field validation with clear error messages using React Hook Form + Zod
5. **Type safety**: Full TypeScript coverage with zero type errors

## Non-Goals

- **Feedback button**: The EC site has a separate feedback submission system -- not needed for LTS
- **Cloudflare Turnstile**: The EC site has Turnstile support behind a feature flag (currently disabled) -- honeypot + rate limiting is sufficient for LTS; Turnstile can be added later if spam becomes an issue
- **Phone number field**: LTS is a freelance portfolio, not a business with a phone line
- **Subject category routing**: The EC site has typed `ContactSubject` categories for departmental routing -- LTS only needs a free-text subject field
- **Styling overhaul**: Adapt the form to work within the existing LTS page structure, not redesign the Contact page layout

## Context & Background

### Current State

The LTS contact page (`src/pages/Contact.tsx`) builds a `mailto:` link with form data encoded in the URL:

```typescript
const mailtoLink = `mailto:hello@ltscommerce.dev?subject=Project Inquiry from ${name}&body=${encodeURIComponent(emailBody)}`;
window.location.href = mailtoLink;
```

**Problems with this approach:**
- Requires user to have a configured email client (many don't, especially on mobile)
- No delivery confirmation -- the form "submits" but the email may never be sent
- No spam protection whatsoever
- No server-side validation
- Exposes the recipient email address in the page source
- Form data can be lost if the email client doesn't open properly

### Target State

- **Client**: React Hook Form + Zod validation -> POST to Google Apps Script endpoint
- **Server**: Google Apps Script web app receives JSON, validates, sends formatted email via MailApp
- **Spam protection**: Hidden `company_url` honeypot field (bots fill it, humans don't see it)
- **Rate limiting**: 10 submissions/hour per origin, tracked via Apps Script Properties Service
- **CORS**: `Content-Type: text/plain` workaround to avoid preflight OPTIONS request (Apps Script limitation)

### Source Reference

All implementation patterns lifted from the EC site:
- **Backend**: `untracked/ec-site/google-apps-script/Code.gs` (v1.6.0)
- **Frontend**: `untracked/ec-site/src/components/sections/Contact.tsx`
- **Types**: `untracked/ec-site/src/types/forms.ts`
- **Setup guide**: `untracked/ec-site/google-apps-script/SETUP.md`

## Tasks

### Phase 1: Backend Setup (Google Apps Script)

- [ ] **Copy and adapt `Code.gs`**: Create `google-apps-script/Code.gs` in the LTS repo
  - [ ] Change recipient email from `info@edmondscommerce.co.uk` to LTS email address
  - [ ] Update `ALLOWED_ORIGINS` array: add `https://ltscommerce.dev` (and localhost ports for dev)
  - [ ] Update email branding: replace "Edmonds Commerce" with "LTS Commerce" in plain text and HTML email templates
  - [ ] Update email footer: remove Edmonds Commerce company registration details, add LTS-appropriate footer
  - [ ] Remove feedback submission handler (`sendFeedbackEmail`, `validateFeedbackData`, `formatDeviceInfo`, `formatDeviceInfoHtml`) -- not needed for LTS
  - [ ] Keep `TURNSTILE_ENABLED = false` (not using Turnstile)
  - [ ] Remove Turnstile secret key value (replace with placeholder)
  - [ ] Keep rate limiting logic unchanged (10 submissions/hour)
  - [ ] Keep honeypot-compatible validation (no `company_url` field validation server-side -- honeypot is client-side only)
- [ ] **Create `google-apps-script/SETUP.md`**: Adapt EC site's setup guide for LTS
  - [ ] Update project name references
  - [ ] Update recipient email references
  - [ ] Update test verification steps
- [ ] **Deploy to Google Apps Script**: Follow setup guide to deploy
  - [ ] Create Apps Script project
  - [ ] Paste adapted Code.gs
  - [ ] Authorise script (MailApp permission)
  - [ ] Deploy as web app (Execute as: Me, Access: Anyone)
  - [ ] Copy deployment URL
  - [ ] Test with cURL

### Phase 2: Environment Configuration

- [ ] **Create `.env.example`**: Document the required environment variable
  ```env
  # Google Apps Script web app URL for contact form
  # Get this from: script.google.com -> Deploy -> Manage deployments
  VITE_CONTACT_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
  ```
- [ ] **Create `.env.local`**: Add actual deployment URL (gitignored)
- [ ] **Verify `.gitignore`**: Ensure `.env.local` is listed

### Phase 3: Dependencies

- [ ] **Install form libraries**:
  ```bash
  npm install react-hook-form @hookform/resolvers zod
  ```
- [ ] **Verify TypeScript types**: react-hook-form and zod ship their own types, no `@types/` packages needed
- [ ] **Run type-check**: Ensure no type conflicts with existing dependencies

### Phase 4: Form Types

- [ ] **Create `src/types/forms.ts`**: Contact form TypeScript types
  - [ ] `ContactFormData` type (inferred from Zod schema): `name`, `email`, `subject`, `message`, `company_url` (optional honeypot)
  - [ ] `ApiResponse` interface: `{ success: boolean; error?: string; message?: string }`
  - [ ] `SubmissionStatus` type: `'idle' | 'submitting' | 'success' | 'error'`
  - [ ] `isApiResponse` type guard function

### Phase 5: React Component

- [ ] **Replace `src/pages/Contact.tsx`**: Adapt EC site's Contact component for LTS
  - [ ] **Zod schema**: Define `contactFormSchema` with field validation:
    - `name`: min 2, max 100 chars, trimmed
    - `email`: valid email, max 254 chars
    - `subject`: min 5, max 200 chars, trimmed
    - `message`: min 10, max 5000 chars, trimmed
    - `company_url`: optional string (honeypot)
  - [ ] **React Hook Form setup**: `useForm<ContactFormData>` with `zodResolver`, mode `onTouched`, reValidateMode `onChange`
  - [ ] **Form fields**: Name, Email, Subject, Message inputs with:
    - Error state styling (red border + error message)
    - Valid state styling (green border + confirmation)
    - Disabled state during submission and after success
    - Proper `aria-invalid` and `aria-describedby` attributes
  - [ ] **Honeypot field**: Hidden `company_url` input (`position: absolute; left: -9999px`), `tabIndex={-1}`, `aria-hidden="true"`
  - [ ] **Submit handler**:
    - Check honeypot -- if filled, fake success after 1.8-2.2s random delay
    - POST to `VITE_CONTACT_FORM_URL` with `Content-Type: text/plain` (CORS workaround)
    - Include `origin: window.location.origin` in payload (Apps Script needs this for origin validation)
    - Parse response with `isApiResponse` type guard
    - Handle success (show message, reset form) and error (show error message) states
  - [ ] **Loading state**: Spinner icon + "Sending..." text on submit button
  - [ ] **Success state**: Green confirmation message with "Send another message" reset button
  - [ ] **Error state**: Red error message with server error or fallback text
  - [ ] **Fallback**: If `VITE_CONTACT_FORM_URL` not configured, show error with direct email address
- [ ] **Remove `mailto:` logic**: Delete the `handleSendEmail` function and `mailto` link construction
- [ ] **Remove Flowbite imports**: Replace `Button`, `Card`, `Label`, `Select`, `Textarea`, `TextInput` from flowbite-react with native HTML elements styled with Tailwind (matching existing LTS patterns)
- [ ] **Simplify form fields**: Remove LTS-specific fields not needed for the Apps Script backend:
  - Remove `company` field (was for mailto body, not a real form field)
  - Remove `projectType` select (use free-text subject instead)
  - Remove `budget` select (not needed for contact form)
  - Remove `timeline` select (not needed for contact form)
- [ ] **Keep sidebar content**: Preserve the "Get in Touch", "Response Time", "Project Process", and "Other Ways to Connect" sidebar cards

### Phase 6: Testing & Verification

- [ ] **Type-check**: `npx tsc --noEmit` passes with zero errors
- [ ] **ESLint**: Zero violations
- [ ] **Build**: `npm run build` succeeds
- [ ] **Manual test - happy path**: Submit form, verify email arrives with correct formatting
- [ ] **Manual test - validation**: Verify each field shows appropriate error messages
- [ ] **Manual test - honeypot**: Fill hidden field, verify fake success (no email sent)
- [ ] **Manual test - rate limiting**: Submit 11 times quickly, verify rate limit error on 11th
- [ ] **Manual test - missing env var**: Remove `VITE_CONTACT_FORM_URL`, verify graceful fallback message
- [ ] **Manual test - network error**: Disconnect network, verify error message shown

## Dependencies

- **Depends on**: Plan 001 Phase 5 (Core Templates to React) -- **COMPLETE**
- **Blocks**: Nothing directly
- **Related**: Plan 001 (React Migration)

## Technical Decisions

### Decision 1: Content-Type text/plain for CORS
**Context**: Google Apps Script web apps don't handle CORS OPTIONS preflight requests properly. The infrastructure blocks OPTIONS at the platform level, so browsers sending `application/json` with a preflight will fail.

**Options Considered**:
1. `Content-Type: text/plain` -- Classified as a "simple" request by CORS spec, no preflight needed
2. CORS proxy -- Adds latency, complexity, and another point of failure
3. JSONP -- Outdated, security concerns

**Decision**: Use `Content-Type: text/plain` with JSON body. Apps Script's `e.postData.contents` parses the body as a string regardless of Content-Type, so `JSON.parse(e.postData.contents)` works the same way.

**Date**: 2026-02-20

### Decision 2: Honeypot vs CAPTCHA
**Context**: Need spam protection for the contact form.

**Options Considered**:
1. **Honeypot field** -- Zero user friction, invisible to humans, effective against basic bots
2. **Cloudflare Turnstile** -- More robust, but adds external dependency, slightly more setup
3. **Google reCAPTCHA** -- Most common, but user-hostile (image puzzles), privacy concerns

**Decision**: Honeypot (`company_url` hidden field) as primary defence. The EC site has Turnstile wired up behind a feature flag but disabled -- this validates that honeypot + rate limiting is sufficient for a site of this scale. Turnstile can be added later if spam becomes a problem.

**Date**: 2026-02-20

### Decision 3: Rate Limiting Strategy
**Context**: Need to prevent abuse without adding infrastructure.

**Options Considered**:
1. **Apps Script Properties Service** -- Built-in key-value store, tracks submissions per origin per hour
2. **Client-side rate limiting** -- Easily bypassed, not a real solution
3. **External rate limiting service** -- Overkill for a portfolio site

**Decision**: Server-side rate limiting via Apps Script Properties Service (10 submissions/hour per origin). Already implemented and proven in EC site's Code.gs. No LTS-side changes needed -- the rate limiting logic lives entirely in the backend.

**Date**: 2026-02-20

### Decision 4: Remove Flowbite Dependency
**Context**: Current Contact.tsx imports `Button`, `Card`, `Label`, `Select`, `Textarea`, `TextInput` from flowbite-react. The new form should use native HTML elements with Tailwind.

**Options Considered**:
1. Keep Flowbite components for the form
2. Replace with native HTML + Tailwind (matching EC site pattern)

**Decision**: Replace with native HTML elements styled with Tailwind. The EC site's Contact component uses plain `<input>`, `<textarea>`, and `<button>` with Tailwind classes. This eliminates the Flowbite dependency for this page and gives full control over styling and accessibility attributes.

**Date**: 2026-02-20

## Success Criteria

- [ ] Contact form submits successfully and Joseph receives formatted email
- [ ] Honeypot field blocks bot submissions silently (fake success, no email)
- [ ] Rate limiting triggers after 10 submissions/hour (error message shown)
- [ ] All form fields validate with appropriate error messages (client-side)
- [ ] Server-side validation catches malformed data
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 violations
- [ ] Build: successful
- [ ] Graceful fallback when `VITE_CONTACT_FORM_URL` is not configured

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Google Apps Script downtime | High | Low | Gmail/Apps Script has 99.9%+ uptime SLA; show fallback email address on error |
| CORS issues with text/plain workaround | High | Low | Proven pattern in EC site production; well-documented workaround |
| Spam overwhelms rate limiting | Medium | Low | Honeypot catches most bots; rate limiting handles the rest; Turnstile available as escalation |
| Apps Script daily email quota exceeded | Medium | Very Low | Free tier allows 100 emails/day; far more than a portfolio site needs |
| Honeypot detected by sophisticated bots | Low | Low | Honeypot + rate limiting is defence in depth; Turnstile is ready to enable if needed |
| Flowbite removal breaks other pages | Medium | Low | Check for Flowbite usage across codebase before removing; scope removal to Contact page only |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases, each completed before moving to next.

- **Phase 1**: Backend Setup (Google Apps Script)
- **Phase 2**: Environment Configuration
- **Phase 3**: Dependencies
- **Phase 4**: Form Types
- **Phase 5**: React Component
- **Phase 6**: Testing & Verification

**Target Completion**: When all phases complete and success criteria met.

## Notes & Updates

### 2026-02-20 - Plan Creation

- Plan created based on analysis of EC site's contact form implementation
- EC site Code.gs is at v1.6.0 with feedback support (added Plan 087) -- LTS only needs contact form, not feedback
- EC site has Turnstile wired up but disabled via `TURNSTILE_ENABLED = false` feature flag -- confirms honeypot + rate limiting is sufficient
- Current LTS Contact.tsx uses Flowbite components and mailto approach -- both will be replaced
- The EC site Contact component references several EC-specific components (`PageContent`, `BlurText`, `StatusBadge`, `SubHeading`, `WhiteToRedTypewriter`, `Button`, `useInView`, `SSR`) -- LTS will use its own component patterns, not lift EC UI components

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-02-20
**Plan Status**: 📋 Planned
