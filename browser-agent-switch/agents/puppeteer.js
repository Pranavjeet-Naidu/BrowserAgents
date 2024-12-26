const puppeteer = require('puppeteer');
const { logWithTimestamp } = require('../utils/log');
const { tryWithRetry, generateScreenshotPath } = require('../utils/helper');
const { checkForCaptcha, scrapeData } = require('../utils/stealth');
const path = require('path');
const fs = require('fs');

async function usePuppeteer(config) {
  const uniqueScreenshotPath = generateScreenshotPath(config, 'puppeteer');
  const screenshotDirectory = path.dirname(uniqueScreenshotPath);

  if (!fs.existsSync(screenshotDirectory)) {
    fs.mkdirSync(screenshotDirectory, { recursive: true });
  }

  async function captureAccessibilityTree(page) {
    const snapshot = await page.accessibility.snapshot();
    logWithTimestamp("INFO", `Accessibility tree: ${JSON.stringify(snapshot)}`);
  }

  const defaultChromiumPath = '/usr/bin/chromium'; // Default Playwright path
  const fallbackChromiumPath = '/usr/lib64/chromium-browser/chromium-browser'; // Your custom path

const chromiumPath = fs.existsSync(defaultChromiumPath) ? defaultChromiumPath : fallbackChromiumPath;
  const browser = await puppeteer.launch({
    headless: config.headless || true,
    executablePath: chromiumPath
  });

  const page = await browser.newPage();

  const startTime = Date.now();
  let errorCount = 0;

  try {
    await tryWithRetry(async () => {
      await page.goto(config.url);

      // Log Accessibility Tree
      await captureAccessibilityTree(page);

      const isCaptchaPresent = await checkForCaptcha(page);
      if (isCaptchaPresent) {
        logWithTimestamp("INFO", `CAPTCHA detected on ${config.url} using Puppeteer.`);
      }

      const data = await scrapeData(page);
      logWithTimestamp("INFO", `Scraped data: ${JSON.stringify(data)}`);
      await page.screenshot({ path: uniqueScreenshotPath });
      logWithTimestamp("INFO", `Screenshot saved for ${config.url} using Puppeteer at ${uniqueScreenshotPath}`);
    });
  } catch (error) {
    logWithTimestamp("ERROR", `Failed to visit ${config.url} using Puppeteer: ${error.message}`);
    errorCount++;
  } finally {
    const endTime = Date.now();
    logWithTimestamp("INFO", `Execution time for Puppeteer: ${endTime - startTime} ms`);
    logWithTimestamp("INFO", `Error count for Puppeteer: ${errorCount}`);
    await browser.close();
  }
}

module.exports = { usePuppeteer };
