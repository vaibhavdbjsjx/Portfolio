import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
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

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean | null>(null);

  console.log(`[MainContainer Render] innerWidth=${window.innerWidth} outerWidth=${window.outerWidth} screen.width=${window.screen.width} devicePixelRatio=${window.devicePixelRatio} isDesktopView=${isDesktopView}`);

  useEffect(() => {
    let resizeTimeout: any;
    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setSplitText();
        const nextVal = window.innerWidth > 1024;
        setIsDesktopView(nextVal);
      }, 200);
    };

    // Set initial value immediately without debounce on first mount
    const initialVal = window.innerWidth > 1024;
    setIsDesktopView(initialVal);

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView === true && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{isDesktopView === false && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <Suspense fallback={<div>Loading....</div>}>
              <TechStack />
            </Suspense>
            <Certifications />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;