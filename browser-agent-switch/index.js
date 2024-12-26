const fs = require('fs');
const path = require('path');
const { logWithTimestamp, logAccessibilityTree } = require(path.resolve(__dirname, './utils/log.js')); 

const { usePuppeteer } = require(path.resolve(__dirname, './agents/puppeteer.js'));
const { usePuppeteerStealth } = require(path.resolve(__dirname, './agents/puppeteerStealth.js'));
const { usePlaywright } = require(path.resolve(__dirname, './agents/playwright.js'));

(async () => {
  try {
    // Read and parse the config.json file
    const config = JSON.parse(fs.readFileSync("config.json", 'utf-8'));

    // Ensure essential config fields are present
    if (!config.url || !config.screenshotPath) {
      throw new Error('Missing necessary configuration fields: url or screenshotPath.');
    }

    // Determine the browser agent to use
    const agent = process.env.BROWSER_AGENT || config.agent || "puppeteer"; 

    // Log the start of the execution
    logWithTimestamp('INFO', `Starting execution with ${agent} for URL: ${config.url}`);

    // Choose the agent based on config or environment variable
    if (agent === "puppeteer") {
      logWithTimestamp('INFO', 'Using Puppeteer agent');
      await usePuppeteer(config);
    } else if (agent === "puppeteer-stealth") {
      logWithTimestamp('INFO', 'Using Puppeteer Stealth agent');
      await usePuppeteerStealth(config);
    } else if (agent === "playwright") {
      logWithTimestamp('INFO', 'Using Playwright agent');
      await usePlaywright(config);
    } else {
      logWithTimestamp('ERROR', "Invalid agent specified! Please use 'puppeteer', 'puppeteer-stealth', or 'playwright'.");
    }

  } catch (error) {
    // Log any errors
    logWithTimestamp('ERROR', 'An error occurred during execution: ' + error.message);
  }
})();
