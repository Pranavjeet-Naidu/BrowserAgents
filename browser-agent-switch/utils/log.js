const fs = require('fs');
const path = require('path');

// General log function with timestamp
function logWithTimestamp(level, message, logType = 'general') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  // Define log file paths based on logType
  const logPath = logType === 'accessibility' ? './logs/accessibility_logs.log' : './logs/general_logs.log';

  // Ensure log directory exists
  const logDir = path.dirname(logPath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Append to the appropriate log file
  fs.appendFileSync(logPath, logMessage);
}

// Function to log accessibility trees
async function logAccessibilityTree(page) {
  const accessibilityTree = await page.accessibility.snapshot();
  logWithTimestamp('DEBUG', `Accessibility Tree: ${JSON.stringify(accessibilityTree)}`, 'accessibility');
}

module.exports = { logWithTimestamp, logAccessibilityTree };
