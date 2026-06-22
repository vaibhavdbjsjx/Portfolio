const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  
  await page.waitForTimeout(25000);
  
  const progressInfo = await page.evaluate(() => {
    const timelines = window.debugCharacter ? true : false;
    return {
      scrollTop: window.scrollY,
      timelinesExist: timelines,
      gsapActiveTl1Progress: window.gsap ? gsap.globalTimeline.getChildren().length : 0,
      bodyHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });
  
  console.log("Progress Info:", JSON.stringify(progressInfo, null, 2));
  await browser.close();
}

run().catch(console.error);
