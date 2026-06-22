const fs = require("fs");

function analyzeGlb(filePath) {
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546C67) return null;
  const chunkLength = buffer.readUInt32LE(12);
  const jsonBuffer = buffer.slice(20, 20 + chunkLength);
  return JSON.parse(jsonBuffer.toString("utf8"));
}

const originalGltf = analyzeGlb("./public/models/character_original.glb");
const currentGltf = analyzeGlb("./public/models/character.glb");

console.log("=== ORIGINAL GLTF ALL MESH NAMES ===");
if (originalGltf && originalGltf.meshes) {
  originalGltf.meshes.forEach((m, i) => {
    console.log(`Mesh [${i}]: name="${m.name}"`);
  });
}

console.log("\n=== CURRENT GLTF ALL MESH NAMES ===");
if (currentGltf && currentGltf.meshes) {
  currentGltf.meshes.forEach((m, i) => {
    console.log(`Mesh [${i}]: name="${m.name}"`);
  });
}

console.log("\n=== CURRENT GLTF ALL NODE NAMES ===");
if (currentGltf && currentGltf.nodes) {
  currentGltf.nodes.forEach((n, i) => {
    if (n.name) {
      console.log(`Node [${i}]: name="${n.name}" mesh=${n.mesh}`);
    }
  });
}
