const fs = require("fs");
const THREE = require("three");
const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader.js");

// Setup headless mock DOM
global.window = global;
global.self = global;
global.Image = class Image {
  constructor() {
    this.height = 1;
    this.width = 1;
    setTimeout(() => { if (this.onload) this.onload(); }, 0);
  }
};
global.document = {
  createElement: (type) => {
    if (type === "img") return new global.Image();
    return {};
  }
};

function loadAndAnalyze(filePath, label) {
  return new Promise((resolve) => {
    const fileBuffer = fs.readFileSync(filePath);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );

    const loader = new GLTFLoader();
    loader.parse(
      arrayBuffer,
      "",
      (gltf) => {
        const root = gltf.scene;

        // 1. Root Object Transform
        const pos = root.position;
        const rot = root.rotation;
        const scale = root.scale;

        // 2. Bounding Box & Pivot Analysis
        const bbox = new THREE.Box3().setFromObject(root);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());

        // 3. Node, Mesh, Bone Counts & Hierarchy
        let nodeCount = 0;
        let meshCount = 0;
        let boneCount = 0;
        const meshNames = [];
        const boneNames = [];
        const spineNeckHeadBones = [];

        root.traverse((child) => {
          nodeCount++;
          if (child.isMesh) {
            meshCount++;
            meshNames.push(child.name);
          }
          if (child.isBone) {
            boneCount++;
            boneNames.push(child.name);

            const lowerName = child.name.toLowerCase();
            if (lowerName.includes("spine") || lowerName.includes("neck") || lowerName.includes("head")) {
              spineNeckHeadBones.push({
                name: child.name,
                position: child.position.clone(),
                rotation: child.rotation.clone(),
                scale: child.scale.clone()
              });
            }
          }
        });

        // 4. Check for non-zero rotations in bones or baked offsets
        const nonZeroBones = [];
        root.traverse((child) => {
          if (child.isBone) {
            if (
              Math.abs(child.rotation.x) > 0.0001 ||
              Math.abs(child.rotation.y) > 0.0001 ||
              Math.abs(child.rotation.z) > 0.0001
            ) {
              nonZeroBones.push({
                name: child.name,
                rotation: [child.rotation.x, child.rotation.y, child.rotation.z]
              });
            }
          }
        });

        const report = {
          label,
          rootTransform: {
            position: [pos.x, pos.y, pos.z],
            rotation: [rot.x, rot.y, rot.z],
            scale: [scale.x, scale.y, scale.z]
          },
          bbox: {
            min: [bbox.min.x, bbox.min.y, bbox.min.z],
            max: [bbox.max.x, bbox.max.y, bbox.max.z],
            size: [size.x, size.y, size.z],
            center: [center.x, center.y, center.z]
          },
          counts: {
            nodes: nodeCount,
            meshes: meshCount,
            bones: boneCount
          },
          specialBones: spineNeckHeadBones,
          nonZeroBones,
          meshNames: meshNames.slice(0, 15), // top 15 meshes
          boneNames: boneNames.slice(0, 15) // top 15 bones
        };
        resolve(report);
      },
      (err) => {
        console.error("Parse error on " + filePath, err);
        resolve(null);
      }
    );
  });
}

async function run() {
  const original = await loadAndAnalyze(
    "./public/models/character_original.glb",
    "Original Model (White)"
  );
  
  // Note: load the current colorful character from the backup copy directory
  const current = await loadAndAnalyze(
    "/Users/vaibhavsg/Documents/Portfolio-Website copy/public/models/character.glb",
    "Current Colorful Model"
  );

  console.log(JSON.stringify({ original, current }, null, 2));
}

run();
