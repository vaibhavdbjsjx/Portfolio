const { test } = require("@playwright/test");

test("check style", async ({ page }) => {
  const url = "http://localhost:5174/";
  await page.setViewportSize({ width: 1280, height: 720 });
  
  page.on("console", (msg) => {
    console.log(`[CONSOLE] ${msg.text()}`);
  });
  
  await page.goto(url);
  
  // Wait 12 seconds for model to load and timelines to compile
  await page.waitForTimeout(12000);
  
  const transform = await page.evaluate(() => {
    const el = document.querySelector(".character-model");
    return el ? window.getComputedStyle(el).transform : "NOT FOUND";
  });
  console.log("COMPUTED TRANSFORM:", transform);
});
