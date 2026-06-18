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

  // Only destroy and recreate all ScrollTrigger timelines when crossing the
  // desktop/mobile breakpoint (1024px). For normal resizes (e.g. fullscreen,
  // window drag), just refresh existing triggers — this is instant vs the
  // 5-8 second freeze of a full rebuild.
  const isDesktop = window.innerWidth > 1024;
  if (lastWasDesktop !== null && lastWasDesktop !== isDesktop) {
    // Breakpoint crossed — must rebuild timelines since desktop/mobile have different animations
    const workTrigger = ScrollTrigger.getById("work");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger != workTrigger) {
        trigger.kill();
      }
    });
    setCharTimeline(character, camera);
    setAllTimeline();
  } else {
    // Same breakpoint — just refresh positions without destroying anything
    ScrollTrigger.refresh();
  }
  lastWasDesktop = isDesktop;
}
