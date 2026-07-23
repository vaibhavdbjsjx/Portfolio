import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Project } from "./ProjectData";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  projects: Project[];
  onOpenReadme: (project: Project) => void;
}

/**
 * Responsive CSS Grid of project cards.
 *
 * Cards reveal once as they enter the viewport: a soft fade, small lift and a
 * touch of scale, staggered across the row. No pinning, no horizontal motion.
 */
const ProjectGrid = ({ projects, onOpenReadme }: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>(".pcard", gridRef.current);
      if (cards.length === 0) return;

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 42, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: gridRef, dependencies: [projects.length] }
  );

  return (
    <div className="work-grid" ref={gridRef}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpenReadme={onOpenReadme}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
