const { chromium } = require("@playwright/test");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 725, height: 812 });
  
  const url = "http://localhost:5173/";
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  
  // Wait for loading screen and animations to fully complete
  await page.waitForTimeout(25000);
  
  const transforms = await page.evaluate(() => {
    const cam = window.debugCamera;
    const char = window.debugCharacter;
    if (!cam || !char) {
      return { error: "Camera or character not found!" };
    }
    
    // Function to get world position using matrixWorld elements directly
    const getWorldPos = (obj) => {
      if (!obj) return null;
      obj.updateMatrixWorld(true);
      const elements = obj.matrixWorld.elements;
      if (!elements || elements.length < 16) return null;
      return { x: elements[12], y: elements[13], z: elements[14] };
    };
    
    const spine = char.getObjectByName("spine");
    const spine005 = char.getObjectByName("spine005") || char.getObjectByName("spine.005");
    const spine006 = char.getObjectByName("spine006") || char.getObjectByName("spine.006");
    const face = char.getObjectByName("Face002");
    
    return {
      camera: {
        position: { x: cam.position.x, y: cam.position.y, z: cam.position.z },
        rotation: { x: cam.rotation.x, y: cam.rotation.y, z: cam.rotation.z }
      },
      character: {
        position: { x: char.position.x, y: char.position.y, z: char.position.z },
        worldPos: getWorldPos(char)
      },
      bones: {
        spine: getWorldPos(spine),
        spine005: getWorldPos(spine005),
        spine006: getWorldPos(spine006),
        face: getWorldPos(face)
      }
    };
  });
  
  console.log("Final settled transforms & bone world positions:");
  console.log(JSON.stringify(transforms, null, 2));
  
  await browser.close();
}

run().catch(console.error);
