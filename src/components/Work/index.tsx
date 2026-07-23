import { useState } from "react";
import "../styles/Work.css";
import { Project, categories } from "./ProjectData";
import CategorySection from "./CategorySection";
import ReadmeModal from "./ReadmeModal";

/**
 * "My Work" section.
 *
 * Composition only — all content comes from ProjectData.ts.
 *   Work → CategorySection → ProjectGrid → ProjectCard → (ReadmeModal | GithubButton)
 */
const Work = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
            onOpenReadme={setActiveProject}
          />
        ))}
      </div>

      {activeProject && (
        <ReadmeModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
};

export default Work;
