import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
        height = canvasDiv.current.clientHeight || (window.matchMedia("(max-width: 768px)").matches ? window.innerHeight * 0.5 : window.innerHeight * 0.8);
      }
      const aspect = width / height;
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
        console.error("WebGL Renderer initialization failed:", e);
        setLoading(100);
        return;
      }

      renderer.setSize(width, height);
      console.log(`[Scene] width=${width}`);
      console.log(`[Scene] height=${height}`);
      console.log(`[Scene] cameraAspect=${aspect}`);
      const maxPixelRatio = window.matchMedia("(max-width: 768px)").matches ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
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
      let activeCharacter: THREE.Object3D | null = null;
      let modelCenter: THREE.Vector3 | null = null;

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
      let isAboutVisible = false;
      let isWhatIDoVisible = false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target.id === "landingDiv") {
              isLandingVisible = entry.isIntersecting;
            } else if (entry.target.classList.contains("about-section")) {
              isAboutVisible = entry.isIntersecting;
            } else if (entry.target.classList.contains("whatIDO")) {
              isWhatIDoVisible = entry.isIntersecting;
            }
          });
        },
        { threshold: 0 }
      );

      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) observer.observe(landingDiv);
      const aboutElement = document.querySelector(".about-section");
      if (aboutElement) observer.observe(aboutElement);
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
          (window as any).debugCamera = camera;
          (window as any).debugCharacter = character;

          setChar(character);
          scene.add(character);

          headBone = character.getObjectByName("spine.006") || character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;

          const tempBox = new THREE.Box3().setFromObject(character);
          const tempCenter = new THREE.Vector3();
          tempBox.getCenter(tempCenter);
          const tempSize = new THREE.Vector3();
          tempBox.getSize(tempSize);
          console.log("CENTER X:", tempCenter.x, "Y:", tempCenter.y, "Z:", tempCenter.z);

          console.log("camera.position X:", camera.position.x, "Y:", camera.position.y, "Z:", camera.position.z);
          console.log("camera.rotation X:", camera.rotation.x, "Y:", camera.rotation.y, "Z:", camera.rotation.z);

          activeCharacter = character;
          modelCenter = tempCenter;

          const option = typeof (window as any).CENTER_TEST_OPTION === "number" ? (window as any).CENTER_TEST_OPTION : 7;
          console.log("CENTER_TEST_OPTION applied on load:", option);
          if (option === 4) {
            camera.lookAt(tempCenter);
          } else if (option === 5) {
            character.position.x = -tempCenter.x;
          } else if (option === 6) {
            camera.position.x = tempCenter.x;
          } else if (option === 7) {
            character.position.x = -0.3;
          } else if (option === 8) {
            character.position.x = -0.5;
          }

          console.log("[FORENSIC] --- START ---");
          console.log("CAMERA POSITION", camera.position);
          const camDir = new THREE.Vector3();
          camera.getWorldDirection(camDir);
          console.log("CAMERA DIRECTION", camDir);
          console.log("CAMERA ROTATION", camera.rotation);
          console.log("CAMERA QUATERNION", camera.quaternion);
          console.log("CAMERA ZOOM", camera.zoom);

          const charRootWorld = new THREE.Vector3();
          character.getWorldPosition(charRootWorld);
          console.log("CHARACTER ROOT WORLD", charRootWorld);

          const headBoneWorld = new THREE.Vector3();
          if (headBone) {
            headBone.getWorldPosition(headBoneWorld);
          }
          console.log("HEADBONE WORLD", headBoneWorld);

          const screenLightWorld = new THREE.Vector3();
          if (screenLight) {
            screenLight.getWorldPosition(screenLightWorld);
          }
          console.log("SCREENLIGHT WORLD", screenLightWorld);

          let monitorMesh: THREE.Object3D | null = null;
          let deskMesh: THREE.Object3D | null = null;

          character.traverse((child: any) => {
            if (child.isMesh) {
              console.log(`[FORENSIC Mesh] name="${child.name}" parent="${child.parent?.name}" pos=(${child.position.x}, ${child.position.y}, ${child.position.z})`);
              if (child.name === "screenlight") {
              } else if (child.parent && child.parent.name === "Plane004" && child.material && child.material.name === "Material.020") {
                monitorMesh = child;
              } else if (child.name.toLowerCase().includes("monitor")) {
                monitorMesh = child;
              }
              if (child.name === "Cube002" || child.name.toLowerCase().includes("desk") || child.name.toLowerCase().includes("table")) {
                deskMesh = child;
              }
            }
          });

          if (monitorMesh) {
            const monitorWorld = new THREE.Vector3();
            (monitorMesh as THREE.Object3D).getWorldPosition(monitorWorld);
            console.log("MONITOR WORLD", monitorWorld);
          } else {
            console.log("MONITOR WORLD NOT FOUND");
          }

          if (deskMesh) {
            const deskWorld = new THREE.Vector3();
            (deskMesh as THREE.Object3D).getWorldPosition(deskWorld);
            console.log("DESK WORLD", deskWorld);
          } else {
            console.log("DESK WORLD NOT FOUND");
          }

          character.traverse((child: any) => {
            if (child.isMesh) {
              const bbox = new THREE.Box3().setFromObject(child);
              const bCenter = new THREE.Vector3();
              bbox.getCenter(bCenter);
              console.log(`[FORENSIC BBox] name="${child.name}" center=(${bCenter.x}, ${bCenter.y}, ${bCenter.z}) size=(${bbox.max.x - bbox.min.x}, ${bbox.max.y - bbox.min.y}, ${bbox.max.z - bbox.min.z})`);
            }
          });

          const box = new THREE.Box3().setFromObject(character);
          const center = new THREE.Vector3();
          box.getCenter(center);
          console.log("BOUNDING BOX CENTER", center);
          console.log("BOUNDING BOX", box);
          console.log("[FORENSIC] --- END ---");

          handleResize(renderer, camera, canvasDiv, character);
          console.log("[FINAL RESIZE CHECK] after load:", {
            width: renderer.domElement.clientWidth,
            height: renderer.domElement.clientHeight,
            aspect: camera.aspect,
            canvasWidth: renderer.domElement.style.width,
            canvasHeight: renderer.domElement.style.height
          });
          progress.loaded().then(() => {
            if (isCancelled) return;
            handleResize(renderer, camera, canvasDiv, character);
            console.log("[FINAL RESIZE CHECK] after progress.loaded:", {
              width: renderer.domElement.clientWidth,
              height: renderer.domElement.clientHeight,
              aspect: camera.aspect,
              canvasWidth: renderer.domElement.style.width,
              canvasHeight: renderer.domElement.style.height
            });
            setTimeout(() => {
              if (isCancelled) return;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (isCancelled) return;
                  handleResize(renderer, camera, canvasDiv, character);
                  console.log("[FINAL RESIZE CHECK] before timelines:", {
                    width: renderer.domElement.clientWidth,
                    height: renderer.domElement.clientHeight,
                    aspect: camera.aspect,
                    canvasWidth: renderer.domElement.style.width,
                    canvasHeight: renderer.domElement.style.height
                  });
                  setCharTimeline(character, camera);
                  setAllTimeline();
                  ScrollTrigger.refresh();
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
        const isVisible = isLandingVisible || isAboutVisible || isWhatIDoVisible;
        if (!isVisible) {
          return;
        }

        const opt = typeof (window as any).CENTER_TEST_OPTION === "number" ? (window as any).CENTER_TEST_OPTION : 7;
        if (opt === 4 && modelCenter) {
          camera.lookAt(modelCenter);
        } else if (opt === 5 && activeCharacter && modelCenter) {
          activeCharacter.position.x = -modelCenter.x;
        } else if (opt === 6 && modelCenter) {
          camera.position.x = modelCenter.x;
        } else if (opt === 7 && activeCharacter) {
          activeCharacter.position.x = -0.3;
        } else if (opt === 8 && activeCharacter) {
          activeCharacter.position.x = -0.5;
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