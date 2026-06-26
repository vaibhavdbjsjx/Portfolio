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

  // Use matchMedia for breakpoint detection - matches CSS media queries exactly
  const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  let canvas3d = canvasDiv.current.getBoundingClientRect();
  let width = canvas3d.width;
  let height = canvas3d.height;

  // On Windows Chrome with display scaling, getBoundingClientRect returns
  // scaled-down values. Detect this by checking if we're on a large physical
  // screen but getting a tiny viewport. Use screen dimensions as fallback.
  const physicalWidth = window.screen.width;
  const physicalHeight = window.screen.height;

  if (width === 0 || height === 0) {
    width = canvasDiv.current.clientWidth || physicalWidth;
    height = canvasDiv.current.clientHeight || (isMobile ? physicalHeight * 0.5 : physicalHeight * 0.8);
  }

  // If screen is physically large but reported height is tiny, use physical dimensions
  if (physicalWidth >= 1200 && height < 400) {
    width = physicalWidth;
    height = physicalHeight * 0.9;
  }

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const desktop = isDesktop;

  if (lastWasDesktop !== null && lastWasDesktop !== desktop) {
    const workTrigger = ScrollTrigger.getById("work");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger !== workTrigger) trigger.kill();
    });
    setCharTimeline(character, camera);
    setAllTimeline();
  } else {
    ScrollTrigger.refresh();
  }

  lastWasDesktop = desktop;
}
