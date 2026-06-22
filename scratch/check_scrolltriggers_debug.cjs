const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForTimeout(25000);
  
  const triggers = await page.evaluate(() => {
    if (!window.ScrollTrigger) return { error: "No ScrollTrigger found!" };
    
    return window.ScrollTrigger.getAll().map((t, idx) => ({
      index: idx,
      triggerClass: t.trigger ? t.trigger.className : "none",
      start: t.start,
      end: t.end,
      scroll: t.scroll(),
      progress: t.progress,
      isActive: t.isActive
    }));
  });
  
  console.log("ScrollTriggers:", JSON.stringify(triggers, null, 2));
  await browser.close();
}

run().catch(console.error);
