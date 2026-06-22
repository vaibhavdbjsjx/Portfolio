const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const brainDir = "/Users/vaibhavsg/.gemini/antigravity-ide/brain/87028329-cca6-427e-b676-2fd266d2a2fb";
  const options = [0, 4, 5, 6];
  
  console.log("Analyzing screenshots at 725px...");
  
  for (const option of options) {
    const filename = `centering_option_${option}_725.png`;
    const filepath = path.join(brainDir, filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`File not found: ${filepath}`);
      continue;
    }
    
    const base64 = fs.readFileSync(filepath).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    
    const analysis = await page.evaluate(async (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          
          // Background color is #0b080c (r: 11, g: 8, b: 12)
          // We look for pixels that deviate significantly from background to find the character
          let minX = canvas.width;
          let maxX = 0;
          let sumX = 0;
          let count = 0;
          
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const idx = (y * canvas.width + x) * 4;
              const r = data[idx];
              const g = data[idx+1];
              const b = data[idx+2];
              
              // Simple check for deviation from #0b080c background
              // Also filter out the pink/blue background circles (they are mostly at the edges/bottom)
              // Let's filter out the very top left/right background circle by only looking at center areas
              // or checking color distance to pure pink #fb8dff (r: 251, g: 141, b: 255) and shadow blue
              const distToBg = Math.abs(r - 11) + Math.abs(g - 8) + Math.abs(b - 12);
              
              if (distToBg > 40) {
                // To avoid background circles, let's focus on the vertical range 200px to 600px where the character is centered
                if (y > 200 && y < 600) {
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  sumX += x;
                  count++;
                }
              }
            }
          }
          
          resolve({
            width: canvas.width,
            height: canvas.height,
            minX,
            maxX,
            centerX: count > 0 ? sumX / count : -1,
            count
          });
        };
        img.src = src;
      });
    }, dataUrl);
    
    const imageCenter = analysis.width / 2;
    const characterCenter = (analysis.minX + analysis.maxX) / 2;
    const deviation = characterCenter - imageCenter;
    
    console.log(`Option ${option}:`);
    console.log(`  Canvas Width: ${analysis.width}px`);
    console.log(`  Character Bbox: X = [${analysis.minX}, ${analysis.maxX}]`);
    console.log(`  Bbox Center: ${characterCenter.toFixed(1)}px (Deviation: ${deviation.toFixed(1)}px from center ${imageCenter}px)`);
    console.log(`  Weighted Center X: ${analysis.centerX.toFixed(1)}px`);
  }
  
  await browser.close();
}

run().catch(console.error);
