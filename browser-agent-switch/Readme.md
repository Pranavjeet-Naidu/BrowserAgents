
# Browser Agent Switch

This project manages different browser automations (Puppeteer, Puppeteer Stealth, and Playwright) to scrape or capture content from various URLs with retries, screenshots, and accessibility logs.

## Installation

1. Clone this repository.  
2. Run `npm install` or `yarn` to install dependencies.

## Usage

1. Configure your agent and URL in a settings object (e.g., `{ headless: true, url: "https://www.amazon.com/" }`).  
2. Run the respective script (e.g., `node index.js` or similar).  
3. Check logs in `/logs/general_logs.log` for info and errors.  

## Agents

• Puppeteer: Standard Puppeteer flow with retries, CAPTCHA detection, and accessibility tree logging.  
• Puppeteer Stealth: Uses `puppeteer-extra` with stealth plugin to avoid detection.  
• Playwright: Alternative agent using the Playwright library.  

## Logging

Logs are written to `/logs/general_logs.log` to record execution times, error counts, and status messages.

## License

MIT
