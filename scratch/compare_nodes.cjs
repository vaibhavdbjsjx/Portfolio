const fs = require("fs");
const path = require("path");

// Simple gltf analyzer that parses the JSON structure of GLTF/GLB files
function analyzeGlb(filePath) {
  const buffer = fs.readFileSync(filePath);
  // Read GLB header
  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const totalLength = buffer.readUInt32LE(8);
  
  if (magic !== 0x46546C67) {
    console.error(`${filePath} is not a valid GLB file.`);
    return null;
  }
  
  // Read first chunk (JSON)
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.readUInt32LE(16);
  
  if (chunkType !== 0x4E4F534A) {
    console.error(`${filePath} first chunk is not JSON.`);
    return null;
  }
  
  const jsonBuffer = buffer.slice(20, 20 + chunkLength);
  const gltf = JSON.parse(jsonBuffer.toString("utf8"));
  return gltf;
}

const originalGltf = analyzeGlb("./public/models/character_original.glb");
const currentGltf = analyzeGlb("./public/models/character.glb");

console.log("=== ORIGINAL GLTF MATERIALS ===");
if (originalGltf && originalGltf.materials) {
  originalGltf.materials.forEach((m, i) => {
    console.log(`[${i}] name="${m.name}" emissive=${JSON.stringify(m.emissiveFactor)} pbr=${JSON.stringify(m.pbrMetallicRoughness)}`);
  });
}

console.log("\n=== CURRENT GLTF MATERIALS ===");
if (currentGltf && currentGltf.materials) {
  currentGltf.materials.forEach((m, i) => {
    console.log(`[${i}] name="${m.name}" emissive=${JSON.stringify(m.emissiveFactor)} pbr=${JSON.stringify(m.pbrMetallicRoughness)}`);
  });
}

console.log("\n=== ORIGINAL GLTF NODES/MESHES ===");
if (originalGltf && originalGltf.nodes) {
  originalGltf.nodes.forEach((n, i) => {
    if (n.name && (n.name.includes("Plane") || n.name.includes("screen") || n.name.includes("monitor") || n.name.includes("Cube"))) {
      console.log(`[${i}] name="${n.name}" mesh=${n.mesh} translation=${JSON.stringify(n.translation)} rotation=${JSON.stringify(n.rotation)} scale=${JSON.stringify(n.scale)}`);
    }
  });
}

console.log("\n=== CURRENT GLTF NODES/MESHES ===");
if (currentGltf && currentGltf.nodes) {
  currentGltf.nodes.forEach((n, i) => {
    if (n.name && (n.name.includes("Plane") || n.name.includes("screen") || n.name.includes("monitor") || n.name.includes("Cube"))) {
      console.log(`[${i}] name="${n.name}" mesh=${n.mesh} translation=${JSON.stringify(n.translation)} rotation=${JSON.stringify(n.rotation)} scale=${JSON.stringify(n.scale)}`);
    }
  });
}
