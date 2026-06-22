import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fs from "fs";

global.window = global;
global.self = global;
global.Image = class Image {
  constructor() {
    this.height = 1;
    this.width = 1;
  }
};

const arrayBuffer = fs.readFileSync("./public/models/character.glb").buffer;

const loader = new GLTFLoader();
loader.parse(
  arrayBuffer,
  "",
  (gltf) => {
    const scene = gltf.scene;
    console.log("GLTF SCENE ROOT:");
    console.log("  position:", scene.position.x, scene.position.y, scene.position.z);
    console.log("  rotation:", scene.rotation.x, scene.rotation.y, scene.rotation.z);
    console.log("  scale:", scene.scale.x, scene.scale.y, scene.scale.z);

    scene.traverse((child) => {
      // Print nodes with transforms
      const hasTransform = 
        child.position.lengthSq() > 0.0001 || 
        child.rotation.lengthSq() > 0.0001 || 
        Math.abs(child.scale.x - 1) > 0.0001 || 
        Math.abs(child.scale.y - 1) > 0.0001 || 
        Math.abs(child.scale.z - 1) > 0.0001;
      
      if (hasTransform) {
        console.log(`Node name="${child.name}" type="${child.type}" parent="${child.parent?.name || 'none'}":`);
        console.log(`  pos: (${child.position.x.toFixed(4)}, ${child.position.y.toFixed(4)}, ${child.position.z.toFixed(4)})`);
        console.log(`  rot: (${child.rotation.x.toFixed(4)}, ${child.rotation.y.toFixed(4)}, ${child.rotation.z.toFixed(4)})`);
        console.log(`  scale: (${child.scale.x.toFixed(4)}, ${child.scale.y.toFixed(4)}, ${child.scale.z.toFixed(4)})`);
      }
    });
  },
  (err) => {
    console.error("Parse error:", err);
  }
);
