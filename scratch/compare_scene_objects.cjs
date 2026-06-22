const { chromium } = require("@playwright/test");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("http://localhost:5173/");
  await page.waitForTimeout(10000); // Wait for character to load
  
  const originalCheck = await page.evaluate(() => {
    const char = window.debugCharacter;
    if (!char) return "No character found";
    
    const meshes = [];
    char.traverse((child) => {
      if (child.isMesh) {
        meshes.push({
          name: child.name,
          visible: child.visible,
          opacity: child.material ? child.material.opacity : null,
          color: child.material && child.material.color ? child.material.color.getHexString() : null,
          roughness: child.material ? child.material.roughness : null,
          metalness: child.material ? child.material.metalness : null,
          parent: child.parent ? child.parent.name : null
        });
      }
    });
    return meshes;
  });
  
  console.log("Current character scene meshes:");
  console.log(JSON.stringify(originalCheck, null, 2));
  
  await browser.close();
}

run().catch(console.error);
