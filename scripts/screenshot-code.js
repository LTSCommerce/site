import { chromium } from 'playwright';

const url = 'https://ltscommerce.dev/articles/mysql-legacy-to-modern-upgrade.html';

(async () => {
  console.log(`📸 Taking screenshot of code blocks in: ${url}`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for code blocks to load
    await page.waitForSelector('pre', { timeout: 5000 });
    
    // Scroll to first code block
    await page.evaluate(() => {
      const codeBlock = document.querySelector('pre');
      if (codeBlock) {
        codeBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    // Wait a moment for scroll
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({
      path: 'var/mysql-code-blocks.png',
      fullPage: false
    });
    
    console.log(`✅ Screenshot saved: var/mysql-code-blocks.png`);
    
  } catch (error) {
    console.error('❌ Screenshot failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();