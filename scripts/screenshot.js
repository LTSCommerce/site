import { chromium } from 'playwright';

// Configuration
const config = {
  url: 'https://ltscommerce.dev/articles/ai-enhanced-php-development.html',
  viewport: { width: 1920, height: 1080 },
  outputPath: 'var/screenshot.png',
  clip: null, // null for full page
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
    
    // Take screenshot with dimension constraints
    if (config.clip) {
      await page.screenshot({
        path: config.outputPath,
        clip: config.clip
      });
    } else {
      // Get page dimensions and constrain to 8000px max
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      }));

      const MAX_DIMENSION = 8000;
      const clipWidth = Math.min(dimensions.width, MAX_DIMENSION);

      if (dimensions.height > MAX_DIMENSION) {
        // Take multiple screenshots for tall pages
        const numScreenshots = Math.ceil(dimensions.height / MAX_DIMENSION);
        console.log(`⚠️  Page height (${dimensions.height}px) exceeds max, taking ${numScreenshots} screenshots`);

        const baseOutputPath = config.outputPath.replace(/\.png$/, '');

        for (let i = 0; i < numScreenshots; i++) {
          const yOffset = i * MAX_DIMENSION;
          const remainingHeight = dimensions.height - yOffset;
          const clipHeight = Math.min(remainingHeight, MAX_DIMENSION);

          const screenshotPath = `${baseOutputPath}_scroll${yOffset}.png`;

          // Scroll to the position first
          await page.evaluate((offset) => {
            window.scrollTo(0, offset);
          }, yOffset);

          // Wait a moment for any dynamic content to load
          await page.waitForTimeout(500);

          await page.screenshot({
            path: screenshotPath,
            fullPage: false,
            clip: {
              x: 0,
              y: 0,
              width: clipWidth,
              height: clipHeight
            }
          });

          console.log(`✅ Screenshot ${i + 1}/${numScreenshots} saved: ${screenshotPath} (y: ${yOffset}-${yOffset + clipHeight})`);
        }
      } else {
        // Single screenshot
        await page.screenshot({
          path: config.outputPath,
          fullPage: true
        });
        console.log(`✅ Screenshot saved: ${config.outputPath}`);
      }
    }
    
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