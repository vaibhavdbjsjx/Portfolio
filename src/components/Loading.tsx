import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  if (percent >= 100) {
    setTimeout(() => {
      setLoaded(true);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }, 600);
  }

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          // Safely unpause ScrollSmoother after dismissal when it is guaranteed to be initialized
          import("./Navbar").then((nav) => {
            if (nav.smoother) {
              nav.smoother.paused(false);
            }
          });
          setIsLoading(false);
        }, 900);
      }
    });
  }, [isLoaded]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          VSG
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> AI + FULL STACK DEVELOPER</span>
            <span> AI + FULL STACK DEVELOPER</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let currentPercent = 0;
  let targetPercent = 15; // Start at 15% immediately to show initial progress
  let lastReportedPercent = -1; // Track last reported value to avoid redundant React re-renders
  let animationFrameId: number;
  let loadedResolve: ((value: number) => void) | null = null;

  const update = () => {
    if (currentPercent < targetPercent) {
      // Smoothly slide towards the target percentage
      currentPercent += Math.min(2.5, (targetPercent - currentPercent) * 0.15 + 0.1);
      if (currentPercent >= 100) {
        currentPercent = 100;
      }
      
      const rounded = Math.round(currentPercent);
      if (rounded !== lastReportedPercent) {
        lastReportedPercent = rounded;
        setLoading(rounded);
      }
    }
    // Resolve loaded() promise via the animation frame loop to avoid extra setInterval polling
    if (loadedResolve && currentPercent >= 100) {
      const resolve = loadedResolve;
      loadedResolve = null;
      cancelAnimationFrame(animationFrameId);
      resolve(100);
      return;
    }
    animationFrameId = requestAnimationFrame(update);
  };
  animationFrameId = requestAnimationFrame(update);

  function setTarget(value: number) {
    // Map character download percentage (0-100) to the range 15-99%
    const mapped = 15 + Math.round((value / 100) * 84);
    if (mapped > targetPercent) {
      targetPercent = Math.min(99, mapped);
    }
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      targetPercent = 100;
      loadedResolve = resolve;
    });
  }

  function clear() {
    cancelAnimationFrame(animationFrameId);
    setLoading(100);
  }

  return { loaded, clear, setTarget };
};
