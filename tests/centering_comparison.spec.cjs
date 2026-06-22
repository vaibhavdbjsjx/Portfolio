const { test } = require("@playwright/test");
const path = require("path");

test("capture centering comparison at 725px", async ({ page }) => {
  test.setTimeout(180000);
  
  const options = [0, 7, 8];
  const url = "http://localhost:5173/";
  
  // Set viewport width to exactly 725px (mobile layout)
  await page.setViewportSize({ width: 725, height: 812 });
  
  for (const option of options) {
    console.log(`\n=================== TESTING OPTION ${option} AT 725px ===================`);
    
    await page.addInitScript((opt) => {
      window.CENTER_TEST_OPTION = opt;
    }, option);
    
    page.on("console", (msg) => {
      console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`);
    });
    
    page.on("pageerror", (err) => {
      console.error("[BROWSER ERROR]", err.message);
    });
    
    await page.goto(url);
    
    // Wait for character loading screen to finish and layout to settle
    await page.waitForTimeout(25000);
    
    const screenshotPath = path.join(
      "/Users/vaibhavsg/.gemini/antigravity-ide/brain/87028329-cca6-427e-b676-2fd266d2a2fb",
      `centering_option_${option}_725.png`
    );
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot for option ${option} to ${screenshotPath}`);
  }
});
