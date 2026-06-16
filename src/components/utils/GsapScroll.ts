import * as THREE from "three";
import gsap from "gsap";

let activeTl1: gsap.core.Timeline | null = null;
let activeTl2: gsap.core.Timeline | null = null;
let activeTl3: gsap.core.Timeline | null = null;
let activeCareerTimeline: gsap.core.Timeline | null = null;
let activeCertTimeline: gsap.core.Timeline | null = null;
let activeIntervalId: any = null;

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (activeIntervalId) {
    clearInterval(activeIntervalId);
    activeIntervalId = null;
  }
  if (activeTl1) {
    activeTl1.scrollTrigger?.kill();
    activeTl1.kill();
    activeTl1 = null;
  }
  if (activeTl2) {
    activeTl2.scrollTrigger?.kill();
    activeTl2.kill();
    activeTl2 = null;
  }
  if (activeTl3) {
    activeTl3.scrollTrigger?.kill();
    activeTl3.kill();
    activeTl3 = null;
  }

  let intensity: number = 0;
  activeIntervalId = setInterval(() => {
    intensity = Math.random();
  }, 200);

  activeTl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });
  activeTl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });
  activeTl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  let screenLight: any, monitor: any;
  const furnitureNames = ["Cube002", "Keyboard", "Plane", "ground", "Plane002", "Plane003"];
  const furnitureNodes: THREE.Object3D[] = [];

  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.020") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
    if (furnitureNames.includes(object.name)) {
      object.visible = false;
      furnitureNodes.push(object);
    }
  });

  let neckBone = character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      activeTl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      activeTl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .to(neckBone!.rotation, { x: 0.6, delay: 2, duration: 3 }, 0)
        .to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
        .to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0)
        .set(furnitureNodes, { visible: true, immediateRender: false }, 1.5)
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
          0
        )
        .fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      activeTl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0)
        .set(furnitureNodes, { visible: false, immediateRender: false }, 2);
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }
}


export function setAllTimeline() {
  if (activeCareerTimeline) {
    activeCareerTimeline.scrollTrigger?.kill();
    activeCareerTimeline.kill();
    activeCareerTimeline = null;
  }
  if (activeCertTimeline) {
    activeCertTimeline.scrollTrigger?.kill();
    activeCertTimeline.kill();
    activeCertTimeline = null;
  }

  activeCareerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  activeCareerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    activeCareerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    activeCareerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }

  activeCertTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".certifications-section",
      start: "top 80%",
      end: "center center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  activeCertTimeline
    .fromTo(
      ".cert-card",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 },
      0
    );
}

export function clearAllTimelines() {
  if (activeIntervalId) {
    clearInterval(activeIntervalId);
    activeIntervalId = null;
  }
  if (activeTl1) {
    activeTl1.scrollTrigger?.kill();
    activeTl1.kill();
    activeTl1 = null;
  }
  if (activeTl2) {
    activeTl2.scrollTrigger?.kill();
    activeTl2.kill();
    activeTl2 = null;
  }
  if (activeTl3) {
    activeTl3.scrollTrigger?.kill();
    activeTl3.kill();
    activeTl3 = null;
  }
  if (activeCareerTimeline) {
    activeCareerTimeline.scrollTrigger?.kill();
    activeCareerTimeline.kill();
    activeCareerTimeline = null;
  }
  if (activeCertTimeline) {
    activeCertTimeline.scrollTrigger?.kill();
    activeCertTimeline.kill();
    activeCertTimeline = null;
  }
}
