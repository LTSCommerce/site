const { chromium } = require('playwright');

// Configuration
const config = {
  url: 'https://ltscommerce.dev/articles/ai-enhanced-php-development.html',
  viewport: { width: 1920, height: 1080 },
  outputPath: 'var/screenshot.png',
  clip: { x: 0, y: 0, width: 1920, height: 600 }, // null for full page
  waitForSelector: null, // Optional selector to wait for
  delay: 0 // Additional delay in ms after page load
};

// Override config from command line args
const args = process.argv.slice(2);
if (args[0]) config.url = args[0];
if (args[1]) config.outputPath = `var/${args[1]}`;

(async () => {
  console.log(`📸 Taking screenshot of: ${config.url}`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewportSize(config.viewport);
  
  try {
    // Navigate to the page
    await page.goto(config.url, { waitUntil: 'networkidle' });
    
    // Wait for specific selector if configured
    if (config.waitForSelector) {
      await page.waitForSelector(config.waitForSelector);
    }
    
    // Additional delay if configured
    if (config.delay > 0) {
      await page.waitForTimeout(config.delay);
    }
    
    // Take screenshot
    const screenshotOptions = {
      path: config.outputPath,
      fullPage: !config.clip
    };
    
    if (config.clip) {
      screenshotOptions.clip = config.clip;
    }
    
    await page.screenshot(screenshotOptions);
    
    console.log(`✅ Screenshot saved: ${config.outputPath}`);
    
  } catch (error) {
    console.error('❌ Screenshot failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

// Usage examples:
// node scripts/screenshot.js
// node scripts/screenshot.js https://ltscommerce.dev/
// node scripts/screenshot.js https://ltscommerce.dev/articles/ full-page.png