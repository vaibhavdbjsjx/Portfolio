import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

let lastWasDesktop: boolean | null = null;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;

  const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

  let canvas3d = canvasDiv.current.getBoundingClientRect();
  let width = canvas3d.width;
  let height = canvas3d.height;

  // On Windows laptops with 125%/150% display scaling, window.innerHeight
  // is scaled down (e.g. 293px instead of ~700px). We detect this by
  // checking if height is suspiciously small for a desktop screen.
  // window.screen.height is always the physical pixel height unaffected by scaling.
  const screenHeight = window.screen.height;
  const screenWidth = window.screen.width;

  if (width === 0 || height === 0) {
    width = canvasDiv.current.clientWidth || window.innerWidth;
    height = canvasDiv.current.clientHeight || (isDesktop ? screenHeight * 0.9 : window.innerHeight * 0.5);
  }

  // If we are on a desktop screen (screen width >= 1200) but height is tiny
  // (less than 400px), the viewport is being reported wrong due to OS scaling.
  // Use screen.height as the true reference instead.
  if (isDesktop && height < 400 && screenHeight > 600) {
    height = screenHeight * 0.9;
    width = screenWidth;
  }

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (lastWasDesktop !== null && lastWasDesktop !== isDesktop) {
    const workTrigger = ScrollTrigger.getById("work");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger != workTrigger) {
        trigger.kill();
      }
    });
    setCharTimeline(character, camera);
    setAllTimeline();
  } else {
    ScrollTrigger.refresh();
  }
  lastWasDesktop = isDesktop;
}
