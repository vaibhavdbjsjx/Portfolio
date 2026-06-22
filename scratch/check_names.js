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
    console.log("Searching bones/nodes in loaded Three.js hierarchy:");
    character.traverse((child) => {
      if (child.name.toLowerCase().includes("spine")) {
        console.log(`Found node: name="${child.name}" type="${child.type}"`);
      }
    });
    process.exit(0);
  },
  (err) => {
    console.error("Error parsing GLTF:", err);
    process.exit(1);
  }
);
