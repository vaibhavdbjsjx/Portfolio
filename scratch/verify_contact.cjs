const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(20000);

  // Scroll to the contact section using scrollIntoView
  await page.evaluate(() => {
    const contactSection = document.querySelector(".contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ block: "start" });
    }
  });
  await page.waitForTimeout(2000);

  // Now take the viewport screenshot
  await page.screenshot({ path: "scratch/contact_viewport_top.png" });
  console.log("Contact viewport top screenshot saved.");

  // Scroll down more to see the form and globe
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/contact_viewport_mid.png" });
  console.log("Contact viewport mid screenshot saved.");

  // Scroll to bottom for credit
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/contact_viewport_bottom.png" });
  console.log("Contact viewport bottom screenshot saved.");

  await browser.close();
}

run().catch(console.error);
