async function checkForCaptcha(page) {
    const captchaElement = await page.$('#captcha');
    return captchaElement !== null;
  }
  
  async function scrapeData(page) {
    return await page.evaluate(() => {
      return {
        title: document.title,
        content: document.body.innerText.substring(0, 500) // Scrape first 500 characters of the page
      };
    });
  }
  
  module.exports = { checkForCaptcha, scrapeData };
  