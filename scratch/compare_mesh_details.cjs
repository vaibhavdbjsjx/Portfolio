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

function inspectNodeAndMesh(gltf, nodeName, label) {
  console.log(`\n=== [${label}] inspecting "${nodeName}" ===`);
  const node = gltf.nodes.find(n => n.name === nodeName);
  if (!node) {
    console.log(`Node "${nodeName}" not found`);
    return;
  }
  console.log(`Node:`, JSON.stringify(node));
  if (node.mesh !== undefined) {
    const mesh = gltf.meshes[node.mesh];
    console.log(`Mesh: name="${mesh.name}"`);
    mesh.primitives.forEach((p, i) => {
      console.log(`  Primitive [${i}]: materialIndex=${p.material} mode=${p.mode}`);
      if (p.material !== undefined) {
        const mat = gltf.materials[p.material];
        console.log(`    Material [${p.material}]:`, JSON.stringify(mat));
      }
    });
  }
}

inspectNodeAndMesh(originalGltf, "Plane.004", "ORIGINAL");
inspectNodeAndMesh(currentGltf, "Plane.004", "CURRENT");

inspectNodeAndMesh(originalGltf, "screenlight", "ORIGINAL");
inspectNodeAndMesh(currentGltf, "screenlight", "CURRENT");
