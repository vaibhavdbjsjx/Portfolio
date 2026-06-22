const { test } = require("@playwright/test");

test("dump console", async ({ page }) => {
  page.on("console", (msg) => {
    console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`);
  });
  
  page.on("pageerror", (err) => {
    console.error("[BROWSER ERROR]", err.message);
  });

  const urls = ["http://localhost:5173/", "http://localhost:5174/", "http://localhost:4173/"];
  for (const url of urls) {
    try {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { timeout: 15000 });
      console.log("Navigation successful. Waiting for loading to finish...");
      await page.waitForTimeout(6000);
      break;
    } catch (err) {
      console.log(`Failed to load ${url}:`, err.message);
    }
  }
});
