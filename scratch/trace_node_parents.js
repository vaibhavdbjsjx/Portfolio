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

const fileBuf = fs.readFileSync("./public/models/character.glb");
const arrayBuffer = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

const loader = new GLTFLoader();
loader.parse(
  arrayBuffer,
  "",
  (gltf) => {
    const scene = gltf.scene;
    
    // Find some nodes we care about
    const metarig = scene.getObjectByName("metarig002");
    const face = scene.getObjectByName("Face002");
    
    console.log("TRACE FOR metarig002:");
    if (metarig) {
      let current = metarig;
      while (current) {
        console.log(`Node name="${current.name}" type="${current.type}":`);
        console.log(`  pos: (${current.position.x}, ${current.position.y}, ${current.position.z})`);
        console.log(`  rot: (${current.rotation.x}, ${current.rotation.y}, ${current.rotation.z})`);
        console.log(`  scale: (${current.scale.x}, ${current.scale.y}, ${current.scale.z})`);
        current = current.parent;
      }
    } else {
      console.log("metarig002 not found!");
    }
    
    console.log("\nTRACE FOR Face002:");
    if (face) {
      let current = face;
      while (current) {
        console.log(`Node name="${current.name}" type="${current.type}":`);
        console.log(`  pos: (${current.position.x}, ${current.position.y}, ${current.position.z})`);
        console.log(`  rot: (${current.rotation.x}, ${current.rotation.y}, ${current.rotation.z})`);
        console.log(`  scale: (${current.scale.x}, ${current.scale.y}, ${current.scale.z})`);
        current = current.parent;
      }
    } else {
      console.log("Face002 not found!");
    }
    
    process.exit(0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
