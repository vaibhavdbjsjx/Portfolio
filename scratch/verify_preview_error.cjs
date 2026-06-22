const { chromium } = require("@playwright/test");

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on("pageerror", (err) => {
    errors.push({
      message: err.message,
      stack: err.stack,
      name: err.name
    });
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  const url = "http://localhost:4173/";
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { timeout: 15000 });
    // Wait a few seconds for async imports/scripts to execute
    await page.waitForTimeout(5000);
  } catch (err) {
    console.error("Navigation failed:", err.message);
  }

  console.log("\n--- Audit Results ---");
  if (errors.length > 0) {
    console.log(`Found ${errors.length} runtime error(s).`);
    console.log("FIRST RUNTIME ERROR:");
    console.log(JSON.stringify(errors[0], null, 2));
  } else {
    console.log("No runtime pageerrors captured.");
  }
  
  await browser.close();
}

run().catch(console.error);
