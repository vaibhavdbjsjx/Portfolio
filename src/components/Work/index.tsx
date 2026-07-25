import { useEffect, useState } from "react";
import "../styles/Work.css";
import { Project, categories, projects, isPlaceholder } from "./ProjectData";
import CategorySection from "./CategorySection";
import ReadmeModal from "./ReadmeModal";
import { smoother } from "../Navbar";

/**
 * Reads a project id from a deep link. Supports both a clean path
 * (`/mywork/hiringbuddy`, needs the Netlify SPA redirect) and a hash
 * (`/#mywork/hiringbuddy`, works with no server config).
 */
const getDeepLinkId = (): string | null => {
  const fromPath = window.location.pathname.match(/\/mywork\/([a-z0-9-]+)/i);
  if (fromPath) return fromPath[1].toLowerCase();
  const fromHash = window.location.hash.match(/mywork\/([a-z0-9-]+)/i);
  if (fromHash) return fromHash[1].toLowerCase();
  return null;
};

/**
 * "My Work" section.
 *
 * Composition only — all content comes from ProjectData.ts.
 *   Work → CategorySection → ProjectGrid → ProjectCard → (ReadmeModal | GithubButton)
 *
 * Deep links: visiting /mywork/<id> (e.g. from the résumé PDF) scrolls here and
 * auto-opens that project's Read Me once the intro loader has cleared.
 */
const Work = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Keep the URL in sync so an open modal is itself shareable/refreshable.
  const openProject = (project: Project | null) => {
    setActiveProject(project);
    try {
      if (project) {
        window.history.replaceState(null, "", `/mywork/${project.id}`);
      } else if (/\/mywork\//i.test(window.location.pathname)) {
        window.history.replaceState(null, "", "/");
      }
    } catch {
      /* history not available — non-fatal */
    }
  };

  // Open the deep-linked project once the page is interactive.
  useEffect(() => {
    const id = getDeepLinkId();
    if (!id) return;
    const project = projects.find((p) => p.id === id && !isPlaceholder(p));
    if (!project) return;

    let cancelled = false;
    let tries = 0;

    const openWhenReady = () => {
      if (cancelled) return;
      // Wait for the loading screen to dismiss (it sits above everything).
      if (document.querySelector(".loading-screen") && tries < 120) {
        tries++;
        window.setTimeout(openWhenReady, 150);
        return;
      }
      const workEl = document.getElementById("work");
      const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
      if (isDesktop && smoother && workEl) {
        try {
          smoother.scrollTo(workEl, false, "top top");
        } catch {
          workEl.scrollIntoView();
        }
      } else if (workEl) {
        workEl.scrollIntoView();
      }
      setActiveProject(project);
    };

    openWhenReady();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2 className="work-heading">
          My <span>Work</span>
        </h2>

        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            onOpenReadme={openProject}
          />
        ))}
      </div>

      {activeProject && (
        <ReadmeModal
          project={activeProject}
          onClose={() => openProject(null)}
        />
      )}
    </div>
  );
};

export default Work;
