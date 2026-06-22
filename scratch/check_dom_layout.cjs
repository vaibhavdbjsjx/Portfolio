const { chromium } = require("@playwright/test");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = "http://localhost:5173/";
  console.log(`Navigating to ${url}...`);
  
  await page.goto(url);
  
  // Wait for loading screen to end and layout to settle
  await page.waitForTimeout(10000);
  
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
        display: style.display,
        margin: style.margin,
        padding: style.padding,
        leftStyle: style.left
      };
    };
    
    return {
      bodyWidth: document.body.clientWidth,
      windowWidth: window.innerWidth,
      smoothWrapper: getRect("#smooth-wrapper"),
      smoothContent: getRect("#smooth-content"),
      landingSection: getRect(".landing-section"),
      landingContainer: getRect(".landing-container"),
      charContainer: getRect(".character-container"),
      charModel: getRect(".character-model"),
      canvas: getRect(".character-model canvas")
    };
  });
  
  console.log("DOM Layout Analysis at 725px:");
  console.log(JSON.stringify(layout, null, 2));
  
  await browser.close();
}

run().catch(console.error);
