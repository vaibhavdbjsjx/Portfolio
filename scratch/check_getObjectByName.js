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
    const spine006 = character.getObjectByName("spine006");
    const spine_006 = character.getObjectByName("spine.006");
    const spine005 = character.getObjectByName("spine005");
    const spine_005 = character.getObjectByName("spine.005");
    
    console.log("getObjectByName result:");
    console.log(`- spine006 found: ${!!spine006}`);
    console.log(`- spine.006 found: ${!!spine_006}`);
    console.log(`- spine005 found: ${!!spine005}`);
    console.log(`- spine.005 found: ${!!spine_005}`);
    process.exit(0);
  },
  (err) => {
    console.error("Error parsing GLTF:", err);
    process.exit(1);
  }
);
