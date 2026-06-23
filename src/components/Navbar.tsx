import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => { setIsOpen(!isOpen); };

  useEffect(() => {
    const initSmoother = () => {
      const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
      if (isDesktop) {
        if (!smoother) {
          smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.7,
            speed: 1.7,
            effects: true,
            autoResize: true,
            ignoreMobileResize: true,
          });
          smoother.scrollTop(0);
          const isLoadingScreenActive = !!document.querySelector(".loading-screen");
          if (isLoadingScreenActive) { smoother.paused(true); }
        }
      } else {
        if (smoother) {
          smoother.kill();
          smoother = undefined as any;
          ScrollTrigger.refresh();
        }
      }
    };
    initSmoother();
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        setIsOpen(false);
        if (window.matchMedia("(min-width: 1025px)").matches) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (smoother) { smoother.scrollTo(section, true, "top top"); }
        }
      });
    });
    let resizeTimeout: any;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initSmoother();
        if (smoother) { ScrollSmoother.refresh(true); }
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimeout);
      if (smoother) {
        smoother.kill();
        smoother = undefined as any;
        ScrollTrigger.refresh();
      }
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">VSG</a>
        <a href="mailto:Vaibhav.sg18@gmail.com" className="navbar-connect" data-cursor="disable">Vaibhav.sg18@gmail.com</a>
        <button className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu} aria-label="Toggle Navigation Menu" data-cursor="disable">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={isOpen ? "nav-menu-open" : ""}>
          <li><a data-href="#about" href="#about"><HoverLinks text="ABOUT" /></a></li>
          <li><a data-href="#work" href="#work"><HoverLinks text="WORK" /></a></li>
          <li><a data-href="#contact" href="#contact"><HoverLinks text="CONTACT" /></a></li>
        </ul>
      </div>
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
