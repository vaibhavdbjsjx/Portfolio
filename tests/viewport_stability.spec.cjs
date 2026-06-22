const { test } = require("@playwright/test");
const path = require("path");

test("capture viewport stability screenshots", async ({ page }) => {
  test.setTimeout(180000);
  
  const widths = [1024, 1280, 1366, 1440, 1536, 1920];
  const url = "http://localhost:5173/";
  
  for (const width of widths) {
    console.log(`\n=================== TESTING VIEWPORT WIDTH ${width}px ===================`);
    
    // Set viewport size
    await page.setViewportSize({ width, height: 800 });
    
    await page.goto(url);
    
    // Wait for character loading screen to finish and layout to settle
    await page.waitForTimeout(20000);
    
    // Get text positions relative to viewport to measure gap stability
    const metrics = await page.evaluate(() => {
      const getCenterOffset = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const screenCenter = window.innerWidth / 2;
        return {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          offsetFromCenter: rect.right - screenCenter // right side offset
        };
      };
      
      const intro = document.querySelector(".landing-intro");
      const info = document.querySelector(".landing-info");
      const screenCenter = window.innerWidth / 2;
      
      return {
        viewportWidth: window.innerWidth,
        screenCenter,
        intro: intro ? {
          left: intro.getBoundingClientRect().left,
          right: intro.getBoundingClientRect().right,
          width: intro.getBoundingClientRect().width,
          gapToCenter: screenCenter - intro.getBoundingClientRect().right
        } : null,
        info: info ? {
          left: info.getBoundingClientRect().left,
          right: info.getBoundingClientRect().right,
          width: info.getBoundingClientRect().width,
          gapToCenter: info.getBoundingClientRect().left - screenCenter
        } : null
      };
    });
    
    console.log(`Metrics for ${width}px:`, JSON.stringify(metrics, null, 2));
    
    const screenshotPath = path.join(
      "/Users/vaibhavsg/.gemini/antigravity-ide/brain/87028329-cca6-427e-b676-2fd266d2a2fb",
      `viewport_stability_${width}.png`
    );
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot for ${width}px to ${screenshotPath}`);
  }
});
