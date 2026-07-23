import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

let lastWasDesktop: boolean | null = null;

const MAX_DPR_DESKTOP = 2;
const MAX_DPR_MOBILE = 1.5;

/**
 * Drawing-buffer density. Clamped for fill-rate, and re-read on every sync so
 * moving the window to a different-DPI monitor (or zooming) is picked up.
 * DPR only affects buffer resolution — never layout — because CSS owns the
 * canvas box.
 */
export const clampedDpr = (): number => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const cap = isMobile ? MAX_DPR_MOBILE : MAX_DPR_DESKTOP;
  return Math.min(window.devicePixelRatio || 1, cap);
};

/**
 * SINGLE SOURCE OF TRUTH for canvas size.
 *
 * The renderer is sized from the container element's own content box and
 * nothing else. Deliberately NOT used: window.screen (the physical monitor,
 * which diverges from the element under Windows display scaling, browser zoom,
 * and multi-monitor setups), window.innerWidth/Height, or any fixed numbers.
 *
 * `setSize(w, h, false)` leaves the canvas's CSS box to the stylesheet
 * (width/height: 100%). That means the canvas is *always* visually flush with
 * its container even if a resize notification is missed — a missed event can
 * only cost a frame of sharpness, never position. This is what makes centering
 * deterministic across devices.
 *
 * Returns false when the element has not been laid out yet (0×0). Callers wait
 * for the next observation rather than substituting invented dimensions.
 */
export const syncRendererToContainer = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  el: HTMLElement
): boolean => {
  const width = el.clientWidth;
  const height = el.clientHeight;
  if (width <= 0 || height <= 0) return false;

  renderer.setPixelRatio(clampedDpr());
  renderer.setSize(width, height, false);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  return true;
};

/**
 * Re-sizes the renderer/camera to the container, then keeps ScrollTrigger in
 * step. Crossing the desktop/mobile breakpoint rebuilds the character timeline
 * because its keyframes differ per layout; otherwise a refresh is enough.
 */
export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  const el = canvasDiv.current;
  if (!el) return;
  if (!syncRendererToContainer(renderer, camera, el)) return;

  const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

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
