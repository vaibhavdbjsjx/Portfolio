import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  let width = canvas3d.width;
  let height = canvas3d.height;
  if (width === 0 || height === 0) {
    width = canvasDiv.current.clientWidth || window.innerWidth;
    height = canvasDiv.current.clientHeight || (window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8);
  }
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}
