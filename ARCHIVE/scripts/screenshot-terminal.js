import { chromium } from 'playwright';

const url = 'https://ltscommerce.dev/articles/understanding-llm-context-management.html';

(async () => {
  console.log(`📸 Taking screenshot of terminal section: ${url}`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for terminal window to load
    await page.waitForSelector('.terminal-window', { timeout: 5000 });
    
    // Scroll to the terminal window
    await page.evaluate(() => {
      const terminal = document.querySelector('.terminal-window');
      if (terminal) {
        terminal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    // Wait a moment for scroll
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({
      path: 'var/terminal-section.png',
      fullPage: false
    });
    
    console.log(`✅ Screenshot saved: var/terminal-section.png`);
    
  } catch (error) {
    console.error('❌ Screenshot failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();