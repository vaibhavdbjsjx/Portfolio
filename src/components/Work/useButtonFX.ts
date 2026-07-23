import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Options {
  /** How strongly the button drifts toward the cursor. 0 disables. */
  strength?: number;
  /** Emit a ripple from the click point. */
  ripple?: boolean;
}

/**
 * Shared micro-interaction layer for the premium action buttons.
 *
 *  • magnetic drift toward the pointer (gsap.quickTo — no per-frame allocation)
 *  • --mx / --my custom properties driving the hover illumination gradient
 *  • ripple element spawned at the click point
 *
 * Magnetic motion is limited to fine pointers and is skipped entirely for
 * users who prefer reduced motion; the illumination still tracks so the button
 * never feels dead.
 */
const useButtonFX = <T extends HTMLElement>({
  strength = 0.3,
  ripple = true,
}: Options = {}) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // quickTo keeps the magnetic follow on a single reused tween.
    const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      if (reduced || strength === 0) return;
      moveX((e.clientX - (r.left + r.width / 2)) * strength);
      moveY((e.clientY - (r.top + r.height / 2)) * strength);
    };

    const onLeave = () => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
      if (reduced || strength === 0) return;
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
    };

    const onDown = (e: PointerEvent) => {
      if (!ripple || reduced) return;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const dot = document.createElement("span");
      dot.className = "btn-ripple";
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - r.left - size / 2}px`;
      dot.style.top = `${e.clientY - r.top - size / 2}px`;
      el.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
    };

    if (finePointer) {
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    }
    el.addEventListener("pointerdown", onDown);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      gsap.killTweensOf(el);
    };
  }, [strength, ripple]);

  return ref;
};

export default useButtonFX;
