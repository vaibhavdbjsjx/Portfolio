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

    console.log("CHARACTER POSITION:", character.position);

    // Find specific elements by name
    const headBone = character.getObjectByName("spine006");
    const screenlight = character.getObjectByName("screenlight");
    const monitor = character.getObjectByName("Plane004"); // Contains the monitor
    
    // Find all meshes to see desk/room elements
    character.traverse((child) => {
      if (child.isMesh) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        console.log(`MESH name="${child.name}" localPos=`, child.position, "worldPos=", worldPos);
      } else if (child.name === "spine006" || child.name === "spine005" || child.name === "screenlight") {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        console.log(`BONE/LIGHT name="${child.name}" localPos=`, child.position, "worldPos=", worldPos);
      }
    });

    process.exit(0);
  },
  (err) => {
    console.error("Error parsing GLTF:", err);
    process.exit(1);
  }
);
