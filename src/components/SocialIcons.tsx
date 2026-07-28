import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SocialIcons = () => {
  /**
   * Hide the floating icons while the Work section is on screen, restore them
   * on the way out (both directions). Opacity only — the container stays in
   * flow so nothing shifts, and pointer-events are disabled while faded so the
   * invisible icons never swallow clicks.
   */
  useEffect(() => {
    const icons = document.querySelector<HTMLElement>(".social-icons");
    const work = document.querySelector<HTMLElement>(".work-section");
    if (!icons || !work) return;

    const apply = (visible: boolean, animate = true) => {
      icons.style.pointerEvents = visible ? "auto" : "none";
      // overwrite:"auto" kills any in-flight tween first — no flicker on fast scrolls
      gsap.to(icons, {
        opacity: visible ? 1 : 0,
        duration: animate ? 0.45 : 0,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: work,
      start: "top 65%",
      end: "bottom 35%",
      // Fires on every active/inactive flip, so it is inherently reversible.
      onToggle: (self) => apply(!self.isActive),
    });

    // Sync initial state without animating (e.g. deep-link straight into Work)
    apply(!trigger.isActive, false);

    return () => {
      trigger.kill();
      gsap.killTweensOf(icons);
    };
  }, []);

  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/vaibhavdbjsjx" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/vaibhavvsg" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/_vaibhav_sg?igsh=MTVla3RkdWU4YXFoNA%3D%3D&utm_source=qr" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
    </div>
  );
};

export default SocialIcons;
