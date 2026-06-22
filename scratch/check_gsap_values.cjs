const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForTimeout(25000);
  
  const gsapData = await page.evaluate(() => {
    const el = document.querySelector(".character-model");
    if (!el) return { error: "No character-model found!" };
    
    const style = window.getComputedStyle(el);
    const gsapObj = el._gsap;
    
    return {
      inlineStyleTransform: el.style.transform,
      computedTransform: style.transform,
      gsapData: gsapObj ? {
        x: gsapObj.x,
        y: gsapObj.y,
        xPercent: gsapObj.xPercent,
        yPercent: gsapObj.yPercent
      } : null
    };
  });
  
  console.log("GSAP Data:", JSON.stringify(gsapData, null, 2));
  await browser.close();
}

run().catch(console.error);
