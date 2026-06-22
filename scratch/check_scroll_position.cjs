const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForTimeout(25000);
  
  const scrollInfo = await page.evaluate(() => {
    const results = {
      windowScrollY: window.scrollY,
      documentScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      gsapKeys: window.gsap ? Object.keys(window.gsap) : [],
      scrollTriggers: []
    };
    
    if (window.gsap && window.gsap.utils) {
      // Find ScrollTrigger if attached
      // We can look at gsap.plugins or similar
    }
    
    return results;
  });
  
  console.log("Scroll Info:", JSON.stringify(scrollInfo, null, 2));
  await browser.close();
}

run().catch(console.error);
