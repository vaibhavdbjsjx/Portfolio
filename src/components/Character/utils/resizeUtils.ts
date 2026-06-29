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

  // On Windows Chrome with 150% scaling:
  // window.screen.width = 1280 (physical)
  // window.innerWidth = 725 (scaled wrong)
  // matchMedia("min-width:1025px") = false (uses innerWidth)
  // BUT the actual screen is a desktop screen.
  // We detect this by checking physical screen width.
  // If physical screen >= 1200px, treat as desktop regardless.
  const physicallyDesktop = window.screen.width >= 1200;
  const isDesktop = physicallyDesktop || window.matchMedia("(min-width: 1025px)").matches;
  const isMobile = !physicallyDesktop && window.matchMedia("(max-width: 768px)").matches;

  // Use physical screen dimensions for canvas sizing on scaled screens
  let width = canvasDiv.current.getBoundingClientRect().width;
  let height = canvasDiv.current.getBoundingClientRect().height;

  if (width === 0 || height === 0 || (isDesktop && height < 400)) {
    width = isDesktop ? window.screen.width : (canvasDiv.current.clientWidth || window.innerWidth);
    height = isDesktop ? window.screen.height * 0.9 : (isMobile ? window.innerHeight * 0.5 : window.innerHeight * 0.8);
  }

  // If height is still too small for a desktop screen, force correct dimensions
  if (isDesktop && height < 400) {
    width = window.screen.width;
    height = window.screen.height * 0.9;
  }

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (lastWasDesktop !== null && lastWasDesktop !== isDesktop) {
    const workTrigger = ScrollTrigger.getById("work");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger !== workTrigger) trigger.kill();
    });
    setCharTimeline(character, camera);
    setAllTimeline();
  } else {
    ScrollTrigger.refresh();
  }

  lastWasDesktop = isDesktop;
}
