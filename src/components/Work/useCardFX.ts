import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Options {
  /** Max rotation in degrees on each axis. Keep small — this should be felt, not seen. */
  maxTilt?: number;
  /** How many pixels the card lifts on hover. */
  lift?: number;
}

/**
 * Premium card hover: pointer-tracked 3D tilt, a lift, and a soft cursor
 * spotlight, with a spring settle on leave.
 *
 * Performance notes:
 *  - Tilt/lift go through gsap.quickTo → one interpolator per property, reused
 *    on every move instead of allocating a tween per event.
 *  - The spotlight is two CSS custom properties written inside a rAF, so many
 *    mousemove events collapse into at most one style write per frame.
 *  - Only transform/opacity animate, so nothing hits layout.
 *
 * Disabled entirely for coarse pointers and prefers-reduced-motion.
 */
const useCardFX = <T extends HTMLElement>({
  maxTilt = 4.5,
  lift = 8,
}: Options = {}) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    gsap.set(el, { transformPerspective: 1000, transformOrigin: "center" });

    let frame = 0;
    let px = 50;
    let py = 50;

    const writeSpotlight = () => {
      frame = 0;
      el.style.setProperty("--cx", `${px}%`);
      el.style.setProperty("--cy", `${py}%`);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width; // 0..1
      const ny = (e.clientY - r.top) / r.height; // 0..1

      rotY((nx - 0.5) * 2 * maxTilt);
      rotX((0.5 - ny) * 2 * maxTilt);

      px = nx * 100;
      py = ny * 100;
      if (!frame) frame = requestAnimationFrame(writeSpotlight);
    };

    const onEnter = () => moveY(-lift);

    const onLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      // Spring settle back to rest
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.55)",
        overwrite: "auto",
      });
      el.style.setProperty("--cx", "50%");
      el.style.setProperty("--cy", "50%");
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(el);
    };
  }, [maxTilt, lift]);

  return ref;
};

export default useCardFX;
