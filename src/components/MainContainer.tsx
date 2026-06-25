import { lazy, PropsWithChildren, Suspense, useEffect, useRef, useState } from "react";
import About from "./About";
import Career from "./Career";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const TechStackLazy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} style={{ minHeight: "500px" }}>
      {isVisible && (<Suspense fallback={<div>Loading....</div>}><TechStack /></Suspense>)}
    </div>
  );
};

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.matchMedia("(min-width: 1025px)").matches
  );

  useEffect(() => {
    setSplitText();
    const mq = window.matchMedia("(min-width: 1025px)");
    const handleBreakpoint = (e: MediaQueryListEvent) => {
      setIsDesktopView(e.matches);
      setSplitText();
    };
    mq.addEventListener("change", handleBreakpoint);
    return () => mq.removeEventListener("change", handleBreakpoint);
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <TechStackLazy />
            <Certifications />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
