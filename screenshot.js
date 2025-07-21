const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to common desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to the page
  await page.goto('https://ltscommerce.dev/articles/ai-enhanced-php-development.html');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the article header area
  await page.screenshot({ 
    path: 'article-header-screenshot.png',
    clip: { x: 0, y: 0, width: 1920, height: 600 }  // Focus on header area
  });
  
  console.log('Screenshot saved as article-header-screenshot.png');
  await browser.close();
})();