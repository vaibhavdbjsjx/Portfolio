const { chromium } = require("@playwright/test");
const path = require("path");

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const consoleMsgs = [];
  page.on("console", (msg) => {
    const text = msg.text();
    consoleMsgs.push(text);
    if (text.includes("FORENSIC") || text.includes("Scene")) {
      console.log(`[BROWSER LOG] ${text}`);
    }
  });

  const url = "http://localhost:5173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  
  // Wait for character to load (12s to let progress finish and settling timeline compile)
  console.log("Waiting 12 seconds for character model load...");
  await page.waitForTimeout(12000);
  
  const artifactDir = "/Users/vaibhavsg/.gemini/antigravity-ide/brain/87028329-cca6-427e-b676-2fd266d2a2fb";

  // Check state on Landing page
  console.log("\nChecking state on Landing section...");
  let state = await page.evaluate(() => {
    const model = document.querySelector(".character-model");
    const style = window.getComputedStyle(model);
    return {
      scrollTop: window.scrollY,
      modelTransform: style.transform,
      modelOpacity: style.opacity,
      modelDisplay: style.display,
      modelPosition: style.position,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  });
  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: path.join(artifactDir, "verify_0_landing.png") });

  // Scroll down to About section
  console.log("\nScrolling to About section (scrollY = 900)...");
  await page.evaluate(() => {
    window.scrollTo(0, 900);
  });
  await page.waitForTimeout(2000);
  state = await page.evaluate(() => {
    const model = document.querySelector(".character-model");
    const style = window.getComputedStyle(model);
    return {
      scrollTop: window.scrollY,
      modelTransform: style.transform,
      modelOpacity: style.opacity,
      modelPosition: style.position,
    };
  });
  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: path.join(artifactDir, "verify_1_about.png") });

  // Scroll to transition between ABOUT and WHAT I DO
  console.log("\nScrolling to transition between ABOUT and WHAT I DO (scrollY = 1350)...");
  await page.evaluate(() => {
    window.scrollTo(0, 1350);
  });
  await page.waitForTimeout(2000);
  state = await page.evaluate(() => {
    const model = document.querySelector(".character-model");
    const style = window.getComputedStyle(model);
    return {
      scrollTop: window.scrollY,
      modelTransform: style.transform,
      modelOpacity: style.opacity,
      modelPosition: style.position,
    };
  });
  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: path.join(artifactDir, "verify_2_transition.png") });

  // Scroll to What I Do section
  console.log("\nScrolling to What I Do section (scrollY = 1800)...");
  await page.evaluate(() => {
    window.scrollTo(0, 1800);
  });
  await page.waitForTimeout(2000);
  state = await page.evaluate(() => {
    const model = document.querySelector(".character-model");
    const style = window.getComputedStyle(model);
    return {
      scrollTop: window.scrollY,
      modelTransform: style.transform,
      modelOpacity: style.opacity,
      modelPosition: style.position,
    };
  });
  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: path.join(artifactDir, "verify_3_whatido.png") });

  console.log("\nClosing browser...");
  await browser.close();
}

run().catch(console.error);
