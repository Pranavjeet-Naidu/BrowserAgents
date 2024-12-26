const path = require('path');
const fs = require('fs');
const { logWithTimestamp } = require('./log.js');

function generateScreenshotPath(config, agent) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replace colon and period for valid filename
  const directory = path.dirname(config.screenshotPath);
  const extension = path.extname(config.screenshotPath);
  const baseName = path.basename(config.screenshotPath, extension);
  return path.join(directory, `${baseName}-${agent}-${timestamp}${extension}`);
}

async function tryWithRetry(fn, retries = 3, delay = 5000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn(); // Try running the function
    } catch (error) {
      attempt++;
      logWithTimestamp('ERROR', `Attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        logWithTimestamp('INFO', `Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retry
      } else {
        throw new Error(`All ${retries} attempts failed. Aborting.`);
      }
    }
  }
}

module.exports = { generateScreenshotPath, tryWithRetry };
