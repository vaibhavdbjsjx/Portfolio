import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize, { syncRendererToContainer } from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { setCharTimeline, setAllTimeline, clearAllTimelines } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const [, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    let isCancelled = false;
    if (!canvasDiv.current) return;

    const scene = sceneRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
    } catch (e) {
      setLoading(100);
      return;
    }

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    // Aspect is a placeholder — the ResizeObserver below fires immediately on
    // observe() and sets the real value from the container's measured box.
    const camera = new THREE.PerspectiveCamera(14.5, 1, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    // Size the buffer from the container before first paint.
    syncRendererToContainer(renderer, camera, canvasDiv.current);

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer;
    let animationFrameId: number;
    let loadedCharacter: THREE.Object3D | null = null;

    /* ------------------------------------------------------------------
       Deterministic sizing.

       The container element is the only input. A ResizeObserver catches every
       box change — window resize, browser zoom, scrollbar appearing,
       ScrollSmoother re-layout, mobile URL-bar collapse — including the ones
       that fire no window "resize" event. Callbacks are coalesced into one
       rAF so a drag-resize costs at most one sync per frame.
       ------------------------------------------------------------------ */
    let syncFrame = 0;

    const runSync = () => {
      syncFrame = 0;
      if (isCancelled || !canvasDiv.current) return;
      if (loadedCharacter) {
        handleResize(renderer, camera, canvasDiv, loadedCharacter);
      } else {
        syncRendererToContainer(renderer, camera, canvasDiv.current);
      }
    };

    const scheduleSync = () => {
      if (!syncFrame) syncFrame = requestAnimationFrame(runSync);
    };

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(canvasDiv.current);

    /* devicePixelRatio changes (dragging to a different-DPI monitor, or
       browser zoom) do not necessarily change the element's CSS box, so
       ResizeObserver alone would miss them. Watch the resolution directly and
       re-arm after each change, since the query is DPR-specific. */
    let dprQuery: MediaQueryList | null = null;
    const onDprChange = () => {
      scheduleSync();
      watchDpr();
    };
    function watchDpr() {
      dprQuery?.removeEventListener("change", onDprChange);
      dprQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
      );
      dprQuery.addEventListener("change", onDprChange);
    }
    watchDpr();

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera, (percent: number) => {
      progress.setTarget(percent);
    });

    let isLandingVisible = true;
    let isAboutVisible = false;
    let isWhatIDoVisible = false;

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === "landingDiv") isLandingVisible = entry.isIntersecting;
        else if (entry.target.classList.contains("about-section")) isAboutVisible = entry.isIntersecting;
        else if (entry.target.classList.contains("whatIDO")) isWhatIDoVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });

    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) visibilityObserver.observe(landingDiv);
    const aboutEl = document.querySelector(".about-section");
    if (aboutEl) visibilityObserver.observe(aboutEl);
    const whatIDoEl = document.querySelector(".whatIDO");
    if (whatIDoEl) visibilityObserver.observe(whatIDoEl);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);

    loadCharacter().then((gltf) => {
      if (isCancelled) return;
      if (gltf) {
        const animations = setAnimations(gltf);
        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        const character = gltf.scene;
        setChar(character);
        scene.add(character);

        headBone = character.getObjectByName("spine.006") || character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;

        handleResize(renderer, camera, canvasDiv, character);

        progress.loaded().then(() => {
          if (isCancelled) return;
          handleResize(renderer, camera, canvasDiv, character);
          setTimeout(() => {
            if (isCancelled) return;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (isCancelled) return;
                handleResize(renderer, camera, canvasDiv, character);
                setCharTimeline(character, camera);
                setAllTimeline();
                ScrollTrigger.refresh();
                light.turnOnLights();
                animations.startIntro();
              });
            });
          }, 2500);
        });

        // The observer is already running; hand it the character so breakpoint
        // changes can rebuild the timeline from here on.
        loadedCharacter = character;
      }
    }).catch((err) => {
      console.error("Failed to load character:", err);
      if (!isCancelled) { setLoading(100); progress.clear(); }
    });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (e: MouseEvent) => handleMouseMove(e, (x, y) => (mouse = { x, y }));
    let debounce: number | undefined;
    const onTouchStart = (e: TouchEvent) => {
      const el = e.target as HTMLElement;
      debounce = setTimeout(() => {
        el?.addEventListener("touchmove", (te: TouchEvent) =>
          handleTouchMove(te, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };
    const onTouchEnd = () => {
      handleTouchEnd((x, y, ix, iy) => {
        mouse = { x, y };
        interpolation = { x: ix, y: iy };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isLandingVisible && !isAboutVisible && !isWhatIDoVisible) return;
      if (headBone) {
        handleHeadRotation(headBone, mouse.x, mouse.y, interpolation.x, interpolation.y, THREE.MathUtils.lerp);
        light.setPointLight(screenLight);
      }
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isCancelled = true;
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      dprQuery?.removeEventListener("change", onDprChange);
      if (syncFrame) cancelAnimationFrame(syncFrame);
      clearTimeout(debounce);
      clearAllTimelines();
      cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.dispose();
      if (canvasDiv.current) canvasDiv.current.removeChild(renderer.domElement);
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
