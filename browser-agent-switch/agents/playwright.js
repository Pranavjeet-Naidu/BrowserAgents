const playwright = require('playwright');
const { logWithTimestamp } = require('../utils/log');
const { tryWithRetry, generateScreenshotPath } = require('../utils/helper');
const { checkForCaptcha, scrapeData } = require('../utils/stealth');
const path = require('path');
const fs = require('fs');

async function usePlaywright(config) {
  const uniqueScreenshotPath = generateScreenshotPath(config, 'playwright');
  const screenshotDirectory = path.dirname(uniqueScreenshotPath);

  if (!fs.existsSync(screenshotDirectory)) {
    fs.mkdirSync(screenshotDirectory, { recursive: true });
  }

  // Set default and fallback paths for Chromium
  const defaultChromiumPath = '/usr/bin/chromium'; // Default Playwright path
  const fallbackChromiumPath = '/usr/lib64/chromium-browser/chromium-browser'; // Your custom path

  // Check if the default Chromium exists, if not, use fallback
  const chromiumPath = fs.existsSync(defaultChromiumPath) ? defaultChromiumPath : fallbackChromiumPath;

  const browser = await playwright.chromium.launch({
    headless: config.headless || true,
    executablePath: chromiumPath, // Use the determined path
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const startTime = Date.now();
  let errorCount = 0;

  try {
    await tryWithRetry(async () => {
      await page.goto(config.url);

      const isCaptchaPresent = await checkForCaptcha(page);
      if (isCaptchaPresent) {
        logWithTimestamp('INFO', `CAPTCHA detected on ${config.url} using Playwright.`);
      }

      const data = await scrapeData(page);
      logWithTimestamp('INFO', `Scraped data: ${JSON.stringify(data)}`);
      await page.screenshot({ path: uniqueScreenshotPath });
      logWithTimestamp('INFO', `Screenshot saved for ${config.url} using Playwright at ${uniqueScreenshotPath}`);
    });
  } catch (error) {
    logWithTimestamp('ERROR', `Failed to visit ${config.url} using Playwright: ${error.message}`);
    errorCount++;
  } finally {
    const endTime = Date.now();
    logWithTimestamp('INFO', `Execution time for Playwright: ${endTime - startTime} ms`);
    logWithTimestamp('INFO', `Error count for Playwright: ${errorCount}`);
    await browser.close();
  }
}

module.exports = { usePlaywright };
