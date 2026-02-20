/**
 * Google Apps Script - Contact Form Handler
 *
 * VERSION: 1.0.0
 * DATE: 2026-02-20
 * CHANGES:
 * - v1.0.0 (2026-02-20): Initial deployment for LTS Commerce (adapted from EC site v1.6.0)
 *
 * This script receives POST requests from the LTS Commerce website:
 * - Contact form submissions (/contact page)
 *
 * Validates data and sends formatted email notifications.
 *
 * Deployment Instructions: See SETUP.md
 */

/**
 * Configuration: Allowed Origins for CORS
 *
 * Only these origins can make requests to the form endpoint.
 * This prevents unauthorized domains from using your contact form.
 */
const ALLOWED_ORIGINS = [
  'https://ltscommerce.dev',             // Production site
  'http://localhost:5173',               // Vite dev server (default port)
  'http://localhost:5174',               // Vite dev server (alternate port)
  'http://localhost:4173',               // Vite preview server
  'http://127.0.0.1:5173',               // Localhost IP variant
  'http://127.0.0.1:5174',               // Localhost IP variant
];

/**
 * Configuration: Feature Flags
 */
const TURNSTILE_ENABLED = false;  // Toggle Turnstile verification on/off

/**
 * Configuration: Cloudflare Turnstile Secret Key
 *
 * IMPORTANT: Set this to your Turnstile SECRET KEY (NOT the site key!)
 * Get this from: https://dash.cloudflare.com/sign-up/turnstile
 *
 * SECURITY: This secret key should NEVER be exposed client-side
 */
const TURNSTILE_SECRET_KEY = 'YOUR_TURNSTILE_SECRET_KEY_HERE';

/**
 * Configuration: Rate Limiting
 *
 * Prevents spam by limiting submissions per origin/hour
 */
const RATE_LIMIT_MAX_SUBMISSIONS = 10;  // Max submissions per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Checks if the request origin is allowed
 * @param {string} origin - The Origin header from the request
 * @return {boolean} True if origin is allowed
 */
function isOriginAllowed(origin) {
  if (!origin) {
    return false; // No origin header = deny
  }

  // Exact match against whitelist
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  // Allow any localhost port for development
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return true;
  }

  Logger.log('Blocked request from unauthorized origin: ' + origin);
  return false;
}

/**
 * Verifies Cloudflare Turnstile token with Cloudflare's API
 * @param {string} token - The Turnstile token from client
 * @return {Object} Verification result with success and error
 */
function verifyTurnstile(token) {
  // Skip verification if feature flag is disabled
  if (!TURNSTILE_ENABLED) {
    Logger.log('Turnstile verification disabled via feature flag');
    return { success: true, skipped: true, reason: 'Feature flag disabled' };
  }

  // Skip verification if no secret key configured
  if (!TURNSTILE_SECRET_KEY || TURNSTILE_SECRET_KEY === 'YOUR_TURNSTILE_SECRET_KEY_HERE') {
    Logger.log('Turnstile not configured - skipping verification');
    return { success: true, skipped: true };
  }

  if (!token) {
    return { success: false, error: 'No Turnstile token provided' };
  }

  try {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const payload = {
      secret: TURNSTILE_SECRET_KEY,
      response: token
    };

    const options = {
      method: 'post',
      payload: payload,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    Logger.log('Turnstile verification result: ' + JSON.stringify(result));

    if (!result.success) {
      return {
        success: false,
        error: 'Turnstile verification failed: ' + (result['error-codes'] || []).join(', ')
      };
    }

    return {
      success: true,
      hostname: result.hostname,
      challengeTs: result.challenge_ts
    };

  } catch (error) {
    Logger.log('Turnstile verification error: ' + error.toString());

    const errorMessage = error.toString();
    if (errorMessage.indexOf('UrlFetchApp.fetch') > -1 || errorMessage.indexOf('permission') > -1) {
      Logger.log('UrlFetchApp permission not granted - allowing submission');
      return {
        success: true,
        skipped: true,
        warning: 'Turnstile verification skipped - UrlFetchApp permission required'
      };
    }

    return {
      success: false,
      error: 'Turnstile verification failed: ' + error.toString()
    };
  }
}

/**
 * Checks rate limiting using Properties Service
 * @param {string} origin - The origin to check rate limit for
 * @return {Object} Rate limit check result with allowed flag and remaining count
 */
function checkRateLimit(origin) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const now = Date.now();
    const key = 'rate_limit_' + origin;

    const dataJson = properties.getProperty(key);
    let data = dataJson ? JSON.parse(dataJson) : { submissions: [], windowStart: now };

    // Clean up old submissions outside the time window
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    data.submissions = (data.submissions || []).filter(function(timestamp) {
      return timestamp > windowStart;
    });

    // Check if rate limit exceeded
    if (data.submissions.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min.apply(null, data.submissions);
      const resetTime = oldestSubmission + RATE_LIMIT_WINDOW_MS;
      const minutesUntilReset = Math.ceil((resetTime - now) / 1000 / 60);

      Logger.log('Rate limit exceeded for origin: ' + origin);
      return {
        allowed: false,
        remaining: 0,
        resetInMinutes: minutesUntilReset,
        error: 'Too many submissions. Please try again in ' + minutesUntilReset + ' minutes.'
      };
    }

    // Add current submission timestamp
    data.submissions.push(now);
    properties.setProperty(key, JSON.stringify(data));

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_SUBMISSIONS - data.submissions.length,
      submissions: data.submissions.length
    };

  } catch (error) {
    Logger.log('Rate limit check error: ' + error.toString());
    // On error, allow request (fail open to avoid blocking legitimate users)
    return { allowed: true, error: 'Rate limit check failed', fallback: true };
  }
}

/**
 * Handles OPTIONS requests (CORS preflight)
 * @return {TextOutput} Empty response
 */
function doOptions() {
  Logger.log('OPTIONS preflight request received - Google handles CORS automatically');
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}

/**
 * Handles GET requests (for testing)
 * @return {TextOutput} JSON response
 */
function doGet() {
  return createCorsResponse({ status: 'ok', method: 'GET' }, '');
}

/**
 * Handles POST requests from the contact form
 * @param {Object} e - The POST request event object
 * @return {TextOutput} JSON response indicating success or failure
 */
function doPost(e) {
  try {
    if (!e) {
      throw new Error('No event object provided');
    }

    if (!e.postData) {
      throw new Error('No postData in event object');
    }

    const data = JSON.parse(e.postData.contents);

    // Get origin from request body (Apps Script web apps don't expose Origin header)
    const origin = data.origin || '';

    // CORS Origin Check
    if (!isOriginAllowed(origin)) {
      Logger.log('Blocked request from unauthorized origin: ' + origin);
      return createCorsResponse({
        success: false,
        error: 'Access denied. Unauthorized origin.'
      }, origin);
    }

    Logger.log('Allowed request from origin: ' + origin);

    // Rate Limiting Check
    const rateLimit = checkRateLimit(origin);
    if (!rateLimit.allowed) {
      return createCorsResponse({
        success: false,
        error: rateLimit.error
      }, origin);
    }
    Logger.log('Rate limit check passed. Remaining: ' + rateLimit.remaining);

    // Turnstile Verification (if token provided)
    const turnstileToken = data.turnstileToken;
    if (turnstileToken) {
      const turnstileResult = verifyTurnstile(turnstileToken);
      if (!turnstileResult.success && !turnstileResult.skipped) {
        Logger.log('Turnstile verification failed: ' + turnstileResult.error);
        return createCorsResponse({
          success: false,
          error: turnstileResult.error || 'Verification failed. Please try again.'
        }, origin);
      }
    } else {
      Logger.log('No Turnstile token provided - allowing submission (honeypot + rate limit active)');
    }

    // Validate and send contact form
    Logger.log('Processing contact form submission');

    const validation = validateFormData(data);
    if (!validation.valid) {
      return createCorsResponse({
        success: false,
        error: validation.error
      }, origin);
    }

    sendContactEmail(data);

    return createCorsResponse({
      success: true,
      message: 'Your message has been sent successfully. I\'ll get back to you soon!'
    }, origin);

  } catch (error) {
    Logger.log('Error processing form submission: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);

    let origin = '';
    try {
      if (e && e.postData && e.postData.contents) {
        const data = JSON.parse(e.postData.contents);
        origin = data.origin || '';
      }
    } catch (parseError) {
      // Ignore parse errors in error handler
    }

    return createCorsResponse({
      success: false,
      error: 'An error occurred processing your request. Please try again or contact me directly at hello@ltscommerce.dev'
    }, origin);
  }
}

/**
 * Validates form data
 * @param {Object} data - The form data to validate
 * @return {Object} Validation result with valid flag and error message
 */
function validateFormData(data) {
  if (!data.name || !data.email || !data.subject || !data.message) {
    return {
      valid: false,
      error: 'All fields are required. Please fill in name, email, subject, and message.'
    };
  }

  if (data.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }

  if (data.subject.trim().length < 5) {
    return { valid: false, error: 'Subject must be at least 5 characters long.' };
  }

  if (data.message.trim().length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters long.' };
  }

  if (data.name.length > 100) {
    return { valid: false, error: 'Name is too long (max 100 characters).' };
  }

  if (data.email.length > 254) {
    return { valid: false, error: 'Email is too long (max 254 characters).' };
  }

  if (data.subject.length > 200) {
    return { valid: false, error: 'Subject is too long (max 200 characters).' };
  }

  if (data.message.length > 5000) {
    return { valid: false, error: 'Message is too long (max 5000 characters).' };
  }

  return { valid: true };
}

/**
 * Sends formatted email notification
 * @param {Object} data - The validated form data
 */
function sendContactEmail(data) {
  const recipient = 'joseph@ltscommerce.dev';
  const subject = 'Contact Form: ' + data.subject;
  const submissionDate = new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  // Plain text email body
  const body = `
NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${submissionDate}

Reply directly to this email to respond to ${data.name}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LTS Commerce
Bespoke PHP Engineering

This email was sent from the contact form at https://ltscommerce.dev
  `.trim();

  // HTML email body
  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a202c;
      background-color: #f7fafc;
    }
    .wrapper { width: 100%; background-color: #f7fafc; padding: 40px 20px; }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .header {
      background-color: #1a202c;
      padding: 20px 24px;
    }
    .logo-text { color: #ffffff; font-size: 16px; font-weight: 600; }
    .header-subtitle { color: #a0aec0; font-size: 13px; margin-top: 2px; }
    .content { padding: 32px 24px; }
    .field { margin-bottom: 20px; }
    .label {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #718096;
      margin-bottom: 6px;
      display: block;
    }
    .value { font-size: 15px; color: #1a202c; word-wrap: break-word; }
    .value a { color: #2b6cb0; text-decoration: none; }
    .message-box {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #2b6cb0;
      padding: 20px;
      margin-top: 6px;
      font-size: 15px;
      line-height: 1.8;
      color: #2d3748;
    }
    .metadata {
      padding: 16px 24px;
      background-color: #f7fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #718096;
    }
    .footer {
      padding: 20px 24px;
      background-color: #1a202c;
      text-align: center;
    }
    .footer-text { font-size: 12px; color: #718096; line-height: 1.8; }
    .footer-link { color: #90cdf4; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 20px 10px; }
      .content { padding: 24px 16px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-text">LTS Commerce</div>
        <div class="header-subtitle">Contact Form Submission</div>
      </div>
      <div class="content">
        <div class="field">
          <span class="label">From</span>
          <div class="value">${escapeHtml(data.name)}</div>
        </div>
        <div class="field">
          <span class="label">Email Address</span>
          <div class="value">
            <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
          </div>
        </div>
        <div class="field">
          <span class="label">Subject</span>
          <div class="value">${escapeHtml(data.subject)}</div>
        </div>
        <div class="field">
          <span class="label">Message</span>
          <div class="message-box">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
        </div>
      </div>
      <div class="metadata">
        <strong>Submitted:</strong> ${submissionDate}<br>
        Reply directly to this email to respond to ${escapeHtml(data.name)}
      </div>
      <div class="footer">
        <p class="footer-text">
          Sent from the contact form at
          <a href="https://ltscommerce.dev" class="footer-link">ltscommerce.dev</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    replyTo: data.email,
    name: 'LTS Commerce Contact Form'
  });

  Logger.log('Email sent successfully to ' + recipient);
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @return {string} Escaped text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates a JSON response
 * @param {Object} data - Response data
 * @param {string} origin - The request origin (for logging only)
 * @return {TextOutput} JSON response
 */
function createCorsResponse(data, origin) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Test function to verify script works
 * Run this from the Apps Script editor to test
 */
function testFormSubmission() {
  Logger.log('=== Testing Form Submission ===');

  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Form Submission',
        message: 'This is a test message from the Apps Script test function.',
        origin: 'http://localhost:5173'
      })
    }
  };

  try {
    const response = doPost(testData);
    Logger.log('Response: ' + response.getContent());
    Logger.log('=== Test Complete ===');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
  }
}

/**
 * Test validation independently
 */
function testValidation() {
  Logger.log('=== Testing Validation ===');

  const validData = {
    name: 'John Smith',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a valid test message with sufficient length.'
  };
  Logger.log('Valid data test: ' + JSON.stringify(validateFormData(validData)));

  const missingField = { name: 'John', email: 'john@example.com', subject: 'Test' };
  Logger.log('Missing field test: ' + JSON.stringify(validateFormData(missingField)));

  Logger.log('=== Validation Tests Complete ===');
}

/**
 * Clear all rate limit data (for testing)
 */
function clearRateLimits() {
  Logger.log('=== Clearing All Rate Limits ===');

  try {
    const properties = PropertiesService.getScriptProperties();
    const allProperties = properties.getProperties();
    let cleared = 0;

    for (const key in allProperties) {
      if (key.startsWith('rate_limit_')) {
        properties.deleteProperty(key);
        cleared++;
        Logger.log('Cleared: ' + key);
      }
    }

    Logger.log('=== Cleared ' + cleared + ' rate limit entries ===');
  } catch (error) {
    Logger.log('Error clearing rate limits: ' + error.toString());
  }
}
