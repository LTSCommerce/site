# Google Apps Script Setup Guide

This guide walks you through deploying the contact form backend using Google Apps Script.

## Prerequisites

- Google Account (gmail.com or Google Workspace)
- Access to Google Apps Script (script.google.com)
- 10-15 minutes for initial setup

---

## Step 1: Create Apps Script Project

1. **Open Google Apps Script Console**
   - Go to [script.google.com](https://script.google.com)
   - Sign in with your Google Account

2. **Create New Project**
   - Click **"New project"** (top left)
   - The editor will open with a default `Code.gs` file

3. **Rename Project** (optional but recommended)
   - Click **"Untitled project"** at the top
   - Rename to: `LTS Commerce Contact Form`
   - The project is automatically saved

---

## Step 2: Add Script Code

1. **Replace Default Code**
   - Delete the existing `function myFunction() {}` code
   - Copy the entire contents of `Code.gs` from this directory
   - Paste into the Apps Script editor

2. **Save the Project**
   - Click the **save icon** or press `Ctrl+S` / `Cmd+S`
   - You should see "Saved" confirmation

3. **Verify Code** (optional)
   - Click **"Run"** dropdown -> Select `testFormSubmission`
   - Click **"Run"** - you'll be prompted for permissions (see Step 3)
   - After authorisation, check **"Execution log"** for success message

---

## Step 3: Authorise Script

The first time you run or deploy the script, Google requires authorisation:

1. **Click "Review Permissions"**
   - You'll see: "This app isn't verified"
   - Click **"Advanced"** (bottom left)
   - Click **"Go to LTS Commerce Contact Form (unsafe)"**

2. **Grant Permissions**
   - Review the permissions requested:
     - **Send email as you** (required for `MailApp.sendEmail`)
   - Click **"Allow"**

3. **Why "unsafe"?**
   - Google shows this for personal scripts not submitted for verification
   - This is YOUR script running under YOUR account - it's safe
   - Commercial apps require Google verification, personal scripts don't

---

## Step 4: Deploy as Web App

1. **Open Deploy Menu**
   - Click **"Deploy"** button (top right)
   - Select **"New deployment"**

2. **Configure Deployment**
   - **Type**: Select the gear icon -> Choose **"Web app"**
   - **Description**: `Production deployment` (or leave blank)
   - **Execute as**: **Me** (your email address)
   - **Who has access**: **Anyone**

3. **Important Settings Explained**
   - **"Execute as: Me"** = Script runs with your permissions (can send email from your account)
   - **"Who has access: Anyone"** = Anyone with the URL can POST data (required for public contact form)

4. **Click "Deploy"**
   - You'll see a "New deployment created" confirmation
   - **Copy the Web App URL** - it looks like:
     ```
     https://script.google.com/macros/s/ABCD1234.../exec
     ```
   - **IMPORTANT**: Save this URL - you'll need it for the React app

5. **Test the Deployment** (optional but recommended)
   - Use the test script in the next section to verify it works

---

## Step 5: Configure React App

1. **Create Environment File**
   - In your project root, create `.env.local`:
     ```env
     VITE_CONTACT_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
     ```
   - Replace `YOUR_DEPLOYMENT_ID` with the actual URL from Step 4

2. **Add to .gitignore** (should already be there)
   - Verify `.env.local` is in `.gitignore`
   - This prevents the URL from being committed to git

3. **Create Example File**
   - Copy `.env.example` contents:
     ```env
     # Google Apps Script web app URL for contact form
     # Get this from: script.google.com -> Deploy -> Manage deployments
     VITE_CONTACT_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
     ```

---

## Step 6: Test the Integration

### Option A: Use cURL (Command Line)

```bash
curl -X POST https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Submission",
    "message": "This is a test message to verify the integration works.",
    "origin": "http://localhost:5173"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. I'll get back to you soon!"
}
```

**Check Email:**
- You should receive an email at `hello@ltscommerce.dev`
- Subject: "Contact Form: Test Submission"
- Body contains the test data

### Option B: Use Apps Script Test Function

1. In the Apps Script editor, select `testFormSubmission` function
2. Click **"Run"**
3. Check **"Execution log"** (View -> Logs)
4. Check email inbox

### Option C: Test from React App

1. Start dev server: `npm run dev`
2. Navigate to `/contact` page
3. Fill out the form
4. Submit and verify success message
5. Check email inbox

---

## Updating the Script

If you need to modify the script later:

1. **Edit Code in Apps Script Editor**
   - Make your changes to `Code.gs`
   - Click **Save**

2. **Create New Deployment**
   - Click **"Deploy"** -> **"Manage deployments"**
   - Click the edit icon next to active deployment
   - Click **"Version"** -> **"New version"**
   - Click **"Deploy"**

3. **URL Stays the Same**
   - The web app URL doesn't change
   - New version goes live immediately
   - No need to update React app

---

## Troubleshooting

### Issue: "Authorization required" error

**Cause**: Script hasn't been authorised to send emails

**Fix**:
1. Go to Apps Script editor
2. Run `testFormSubmission` function
3. Complete authorisation flow (see Step 3)

---

### Issue: No email received

**Possible Causes**:

1. **Email in spam folder**
   - Check spam/junk folder
   - Add script sender to contacts

2. **Wrong recipient address**
   - Verify `hello@ltscommerce.dev` in `Code.gs`
   - Update if needed, save, redeploy

3. **Execution error**
   - Go to Apps Script editor -> **"Executions"** tab
   - Check for failed executions
   - Click to see error details

---

### Issue: CORS error in browser console

**Cause**: Apps Script CORS is restrictive for non-GET requests

**Fix**:
1. Verify deployment settings: **"Who has access: Anyone"**
2. Ensure you're POSTing to the `/exec` URL (not `/dev`)
3. If using development deployment URL (ends in `/dev`), switch to production (`/exec`)

**Note**: Apps Script automatically handles CORS for web apps deployed as "Anyone can access"

---

### Issue: "Script function not found: doPost"

**Cause**: Function name typo or script not saved

**Fix**:
1. Verify function is named exactly `doPost` (case-sensitive)
2. Save the script
3. Redeploy (new version)

---

### Issue: Form validation fails but client-side passed

**Cause**: Server-side validation is stricter or different

**Fix**:
1. Check `Code.gs` validation rules
2. Ensure client-side validation matches server-side
3. Update React validation to match

---

## Security Notes

### What's Secure

- **No credentials in client code** - Email sending happens server-side
- **Server-side validation** - Prevents malicious submissions
- **HTML escaping** - Prevents XSS in email content
- **Input length limits** - Prevents abuse
- **Rate limiting** - 10 submissions per hour per origin via Properties Service
- **Honeypot field** - Client-side bot detection (`company_url` hidden field)
- **Origin whitelist** - Only `ltscommerce.dev` and localhost origins accepted
- **HTTPS enforced** - All Apps Script endpoints use HTTPS

### What's NOT Protected (Add Later if Needed)

- **CAPTCHA** - No Turnstile/reCAPTCHA (can enable `TURNSTILE_ENABLED = true` if spam becomes issue)
- **IP blocking** - Can't block specific IPs

---

## Monitoring & Logs

### View Execution Logs

1. Go to Apps Script editor
2. Click **"Executions"** (left sidebar)
3. See all form submissions with:
   - Timestamp
   - Status (Success/Failure)
   - Execution time

### View Detailed Logs

1. Click any execution
2. See `Logger.log()` output
3. Useful for debugging

### Email Notifications for Errors

Apps Script can email you when executions fail:

1. Click **"Triggers"** (left sidebar, clock icon)
2. Click **"Add Trigger"**
3. Configure:
   - Function: `doPost`
   - Event source: "From web"
   - Notify me: **"daily"** (or "immediately")
4. You'll get emails if the script fails

---

## Backup & Version Control

### Backup Script Code

**Option 1: Manual Backup**
- Copy `Code.gs` contents periodically
- Save to this repository

**Option 2: Apps Script Version History**
- Apps Script keeps version history automatically
- View: File -> Version history

**Option 3: Git Integration** (advanced)
- Use [clasp](https://github.com/google/clasp) to sync Apps Script with git
- Install: `npm install -g @google/clasp`
- Clone project: `clasp clone <scriptId>`

---

## Production Checklist

Before going live, verify:

- [ ] Script deployed as **"Web app"**
- [ ] **"Execute as: Me"** selected
- [ ] **"Who has access: Anyone"** selected
- [ ] Web app URL copied to `.env.local`
- [ ] `.env.local` in `.gitignore`
- [ ] Recipient email correct (`hello@ltscommerce.dev`)
- [ ] Test email received successfully
- [ ] Form submission tested from React app
- [ ] Error handling tested (try submitting invalid data)
- [ ] Email formatting looks good (check HTML rendering)

---

## Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [MailApp Reference](https://developers.google.com/apps-script/reference/mail/mail-app)
- [Web Apps Guide](https://developers.google.com/apps-script/guides/web)
- [Troubleshooting Guide](https://developers.google.com/apps-script/guides/support/troubleshooting)

---

## Support

If you encounter issues not covered in this guide:

1. Check **"Executions"** tab in Apps Script for error details
2. Review Apps Script documentation
3. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/google-apps-script) for similar issues
4. Check Google Apps Script [status page](https://www.google.com/appsstatus)

---

**Last Updated**: 2026-02-20
**Maintained by**: LTS Commerce
