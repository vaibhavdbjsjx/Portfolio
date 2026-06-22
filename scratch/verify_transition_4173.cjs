const { chromium } = require("playwright");

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1440, height: 900 });
  
  page.on("console", (msg) => {
    console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  });

  page.on("pageerror", (err) => {
    console.error(`[BROWSER ERROR] ${err.message}`);
  });

  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  
  // Wait for character to load (25s to be absolutely sure progress finishes and timelines compile)
  console.log("Waiting 25 seconds for character model load...");
  await page.waitForTimeout(25000);
  
  // Check state on Landing page
  console.log("\n--- SCROLL = 0 (Landing) ---");
  let state = await page.evaluate(() => {
    const model = document.querySelector(".character-model");
    if (!model) return { error: "No model element found!" };
    const style = window.getComputedStyle(model);
    const canvas = document.querySelector(".character-model canvas");
    const canvasStyle = canvas ? window.getComputedStyle(canvas) : {};
    return {
      scrollTop: window.scrollY,
      modelTransform: style.transform,
      modelLeft: model.getBoundingClientRect().left,
      modelWidth: model.getBoundingClientRect().width,
      canvasWidthStyle: canvasStyle.width,
      canvasHeightStyle: canvasStyle.height
    };
  });
  console.log(JSON.stringify(state, null, 2));

  // Scroll down to About section
  console.log("\n--- SCROLL = 900 (About) ---");
  await page.evaluate(() => {
    window.scrollTo(0, 900);
  });
  await page.waitForTimeout(2000);
  state = await page.evaluate(() => {
    const model = document.querySelector(".character-model");
    if (!model) return { error: "No model element found!" };
    const style = window.getComputedStyle(model);
    return {
      scrollTop: window.scrollY,
      modelTransform: style.transform,
      modelLeft: model.getBoundingClientRect().left,
      modelWidth: model.getBoundingClientRect().width
    };
  });
  console.log(JSON.stringify(state, null, 2));

  console.log("\nClosing browser...");
  await browser.close();
}

run().catch(console.error);
