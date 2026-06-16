import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    title: "HiringBuddy",
    category: "AI Recruitment Platform",
    tech: "Python, FastAPI, React, AI",
    image: "/images/hiringbuddy.jpg",
  },
  {
    title: "ML DeepShield",
    category: "AI Security & Threat Detection",
    tech: "Machine Learning, Python, AI, Cybersecurity",
    image: "/images/deepshield.jpg",
  },
  {
    title: "IPL Match Prediction",
    category: "Analytics System",
    tech: "Machine Learning, Python, Analytics",
    image: "/images/ipl_prediction.jpg",
  },
  {
    title: "Solar Monitor",
    category: "AI Powered Solar Energy Monitor App",
    tech: "Flutter, Dart, Hive, AI",
    description:
      "Cross-platform solar monitoring application with predictive analytics, energy consumption tracking, and intelligent power-saving recommendations.",
    image: "/images/surya_shakti.jpg",
  },
];

const Work = () => {
  useGSAP(() => {
    const workSection = document.querySelector(".work-section");
    const workFlex = document.querySelector(".work-flex") as HTMLElement;
    const workContainer = document.querySelector(".work-container") as HTMLElement;

    if (!workSection || !workFlex || !workContainer) return;

    let mm = gsap.matchMedia();

    const getTranslateX = () => {
      const boxes = workFlex.querySelectorAll(".work-box");
      let totalBoxesWidth = 0;

      // Determine responsive default fallback dimensions
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1400 && window.innerWidth > 768;
      const defaultCardWidth = isMobile ? 350 : (isTablet ? 450 : 600);
      const defaultPaddingRight = isMobile ? 45 : (isTablet ? 75 : 120);
      const defaultMarginLeft = isMobile ? -30 : (isTablet ? -50 : -80);

      boxes.forEach((box) => {
        totalBoxesWidth += box.getBoundingClientRect().width || defaultCardWidth;
      });

      const computedFlex = window.getComputedStyle(workFlex);
      const paddingRight = parseFloat(computedFlex.paddingRight) || defaultPaddingRight;
      const marginLeft = parseFloat(computedFlex.marginLeft) || defaultMarginLeft;
      const containerWidth = workContainer.clientWidth || window.innerWidth;

      return totalBoxesWidth + paddingRight - containerWidth + marginLeft;
    };

    mm.add("(min-width: 992px)", () => {
      let timeline: gsap.core.Timeline;
      const timer = setTimeout(() => {
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".work-section",
            start: "top top",
            end: () => `+=${getTranslateX()}`,
            scrub: true,
            pin: true,
            id: "work",
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(".work-flex", {
          x: () => -getTranslateX(),
          ease: "none",
        });

        // Recalculate ScrollTrigger positions once pinning spacer is created
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (timeline) {
          timeline.kill();
        }
        ScrollTrigger.getById("work")?.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tech}</p>
              </div>
              <WorkImage image={project.image || "/images/placeholder.webp"} alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
