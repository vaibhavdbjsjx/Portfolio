import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const patches = [
  {
    file: 'node_modules/gsap-trial/ScrollSmoother.js',
    replace: [
      {
        target: 'o=0===(r?window.location.href',
        replacement: 'o=!0||0===(r?window.location.href'
      }
    ]
  },
  {
    file: 'node_modules/gsap-trial/dist/ScrollSmoother.js',
    replace: [
      {
        target: 'r=0===(t?window.location.href',
        replacement: 'r=!0||0===(t?window.location.href'
      }
    ]
  },
  {
    file: 'node_modules/gsap-trial/SplitText.js',
    replace: [
      {
        target: 'e=0===(u?window.location.href',
        replacement: 'e=!0||0===(u?window.location.href'
      }
    ]
  },
  {
    file: 'node_modules/gsap-trial/dist/SplitText.js',
    replace: [
      {
        target: 'e=0===(u?window.location.href',
        replacement: 'e=!0||0===(u?window.location.href'
      }
    ]
  }
];

patches.forEach(p => {
  const filePath = path.resolve(__dirname, p.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    p.replace.forEach(r => {
      if (content.includes(r.target)) {
        content = content.replace(r.target, r.replacement);
        modified = true;
        console.log(`Patched ${p.file}: ${r.target} -> ${r.replacement}`);
      } else if (content.includes(r.replacement)) {
        console.log(`Already patched ${p.file}`);
      } else {
        console.warn(`Target pattern not found in ${p.file}: ${r.target}`);
      }
    });
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } else {
    console.warn(`File not found: ${p.file}`);
  }
});
