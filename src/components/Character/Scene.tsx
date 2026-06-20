import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
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
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let parentRect = canvasDiv.current.parentElement?.getBoundingClientRect();
      console.log("[Scene] getBoundingClientRect", rect);
      console.log(`[Scene] parentWidth=${parentRect?.width} parentHeight=${parentRect?.height}`);
      console.log(`[Scene] window.innerWidth=${window.innerWidth}`);

      let width = rect.width;
      let height = rect.height;
      if (width === 0 || height === 0) {
        width = canvasDiv.current.clientWidth || window.innerWidth;
        height = canvasDiv.current.clientHeight || (window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8);
      }
      const aspect = width / height;
      const scene = sceneRef.current;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: window.devicePixelRatio < 2, // Saves significant GPU load on retina screens without visual regression
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        });
      } catch (e) {
        console.error("WebGL Renderer initialization failed:", e);
        setLoading(100);
        return;
      }

      renderer.setSize(width, height);
      console.log(`[Scene] width=${width}`);
      console.log(`[Scene] height=${height}`);
      console.log(`[Scene] cameraAspect=${aspect}`);
      const maxPixelRatio = window.innerWidth <= 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(maxPixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();
      console.log(`[Scene] camera aspect ratio set: ${camera.aspect} zoom=${camera.zoom} cameraPositionX=${camera.position.x}`);

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera, (percent) => {
        progress.setTarget(percent);
      });

      let resizeListener: (() => void) | undefined;
      let resizeTimeout: any;
      let animationFrameId: number;

      let isLandingVisible = true;
      let isWhatIDoVisible = false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target.id === "landingDiv") {
              isLandingVisible = entry.isIntersecting;
            } else if (entry.target.classList.contains("whatIDO")) {
              isWhatIDoVisible = entry.isIntersecting;
            }
          });
        },
        { threshold: 0 }
      );

      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) observer.observe(landingDiv);
      const whatIDoElement = document.querySelector(".whatIDO");
      if (whatIDoElement) observer.observe(whatIDoElement);

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        console.warn("WebGL Context Lost");
        cancelAnimationFrame(animationFrameId);
      };
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);

      loadCharacter().then((gltf) => {
        if (isCancelled) return;
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;

          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            if (isCancelled) return;
            setTimeout(() => {
              if (isCancelled) return;
              // Ensure we compile timelines after loading screen is completely unmounted and layout has settled
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (isCancelled) return;
                  setCharTimeline(character, camera);
                  setAllTimeline();
                  light.turnOnLights();
                  animations.startIntro();
                });
              });
            }, 2500);
          });
          resizeListener = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
              handleResize(renderer, camera, canvasDiv, character);
            }, 150);
          };
          window.addEventListener("resize", resizeListener);
        }
      }).catch((err) => {
        console.error("Failed to load character:", err);
        if (!isCancelled) {
          setLoading(100);
          progress.clear();
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const isVisible = isLandingVisible || isWhatIDoVisible;
        if (!isVisible) {
          return;
        }
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        isCancelled = true;
        observer.disconnect();
        clearTimeout(debounce);
        clearTimeout(resizeTimeout);
        clearAllTimelines();
        cancelAnimationFrame(animationFrameId);
        scene.clear();
        renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
        renderer.dispose();
        if (resizeListener) {
          window.removeEventListener("resize", resizeListener);
        }
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
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
