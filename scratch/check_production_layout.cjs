const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForTimeout(25000);
  
  const layout = await page.evaluate(() => {
    const getRect = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        selector,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        position: style.position,
        transform: style.transform,
        display: style.display
      };
    };
    
    return {
      scrollTop: window.scrollY,
      smoothWrapper: getRect("#smooth-wrapper"),
      smoothContent: getRect("#smooth-content"),
      landingSection: getRect(".landing-section"),
      charModel: getRect(".character-model")
    };
  });
  
  console.log("Production Layout Analysis:", JSON.stringify(layout, null, 2));
  await browser.close();
}

run().catch(console.error);
