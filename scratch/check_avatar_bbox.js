import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fs from "fs";

global.window = global;
global.self = global;
global.Image = class Image {
  constructor() {
    this.height = 1;
    this.width = 1;
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
};
global.document = {
  createElement: (type) => {
    if (type === "img") return new global.Image();
    return {};
  }
};

const fileBuffer = fs.readFileSync("./public/models/character.glb");
const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);

const loader = new GLTFLoader();
loader.parse(
  arrayBuffer,
  "",
  (gltf) => {
    const character = gltf.scene;
    
    // Furniture meshes that get hidden
    const furnitureNames = ["Cube002", "Keyboard", "Plane", "ground", "Plane002", "Plane003"];

    console.log("--- Visible Meshes on Load ---");
    const visibleBox = new THREE.Box3();
    const avatarBox = new THREE.Box3();
    
    character.traverse((child) => {
      if (child.isMesh) {
        const isFurniture = furnitureNames.includes(child.name) || furnitureNames.includes(child.parent?.name);
        const box = new THREE.Box3().setFromObject(child);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log(`Mesh: "${child.name}" | parent: "${child.parent?.name}" | isFurniture: ${isFurniture}`);
        console.log(`  - Center: (${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)})`);
        console.log(`  - Size:   (${size.x.toFixed(3)}, ${size.y.toFixed(3)}, ${size.z.toFixed(3)})`);
        
        if (!isFurniture) {
          visibleBox.expandByObject(child);
          if (!child.name.includes("Plane004") && !child.name.includes("screenlight")) {
            avatarBox.expandByObject(child);
          }
        }
      }
    });

    console.log("\n--- Combined Bounding Boxes ---");
    
    const totalBox = new THREE.Box3().setFromObject(character);
    const totalCenter = totalBox.getCenter(new THREE.Vector3());
    console.log(`Total Model Box Center: (${totalCenter.x.toFixed(3)}, ${totalCenter.y.toFixed(3)}, ${totalCenter.z.toFixed(3)})`);
    console.log(`Total Model Box Size:   (${totalBox.max.x - totalBox.min.x}, ${totalBox.max.y - totalBox.min.y}, ${totalBox.max.z - totalBox.min.z})`);

    const visibleCenter = visibleBox.getCenter(new THREE.Vector3());
    console.log(`Visible Objects Box Center: (${visibleCenter.x.toFixed(3)}, ${visibleCenter.y.toFixed(3)}, ${visibleCenter.z.toFixed(3)})`);
    console.log(`Visible Objects Box Size:   (${visibleBox.max.x - visibleBox.min.x}, ${visibleBox.max.y - visibleBox.min.y}, ${visibleBox.max.z - visibleBox.min.z})`);

    const avatarCenter = avatarBox.getCenter(new THREE.Vector3());
    console.log(`Only Avatar Box Center: (${avatarCenter.x.toFixed(3)}, ${avatarCenter.y.toFixed(3)}, ${avatarCenter.z.toFixed(3)})`);
    console.log(`Only Avatar Box Size:   (${avatarBox.max.x - avatarBox.min.x}, ${avatarBox.max.y - avatarBox.min.y}, ${avatarBox.max.z - avatarBox.min.z})`);

    process.exit(0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
