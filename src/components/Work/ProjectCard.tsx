import { FiArrowUpRight } from "react-icons/fi";
import { Project, isPlaceholder } from "./ProjectData";
import ProjectImage from "./ProjectImage";
import GithubButton from "./GithubButton";
import useButtonFX from "./useButtonFX";
import useCardFX from "./useCardFX";

interface Props {
  project: Project;
  /** Opens the README modal for this project. */
  onOpenReadme: (project: Project) => void;
}

/**
 * A single project card: image, title, subtitle, and two actions.
 *
 * When a project has no title yet it renders as an empty reserved slot so the
 * grid keeps its shape without inventing any content.
 */
const ProjectCard = ({ project, onOpenReadme }: Props) => {
  const readmeRef = useButtonFX<HTMLButtonElement>({ strength: 0.26 });
  const cardRef = useCardFX<HTMLElement>({ maxTilt: 4.5, lift: 8 });

  if (isPlaceholder(project)) {
    return (
      <article className="pcard pcard-empty" aria-label="Empty project slot">
        <div className="pcard-media">
          <div className="pcard-img-empty" aria-hidden="true" />
        </div>
        <div className="pcard-body">
          <span className="pcard-slot-label">Slot available</span>
        </div>
      </article>
    );
  }

  return (
    <article
      className="pcard"
      ref={cardRef}
      aria-labelledby={`pcard-title-${project.id}`}
    >
      {/* Cursor spotlight + illuminated rim, driven by --cx/--cy from useCardFX */}
      <span className="pcard-spot" aria-hidden="true" />
      <span className="pcard-rim" aria-hidden="true" />

      <ProjectImage src={project.image} alt={`${project.title} preview`} />

      <div className="pcard-body">
        <div className="pcard-head">
          <h3 className="pcard-title" id={`pcard-title-${project.id}`}>
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="pcard-subtitle">{project.subtitle}</p>
          )}
        </div>

        <div className="pcard-actions">
          <button
            ref={readmeRef}
            type="button"
            className="pcard-readme-btn"
            onClick={() => onOpenReadme(project)}
            aria-haspopup="dialog"
            aria-label={`Read more about ${project.title}`}
            data-cursor="disable"
          >
            <span className="pcard-readme-label">Read Me</span>
            <FiArrowUpRight className="pcard-readme-icon" aria-hidden="true" />
          </button>

          {/* Always rendered — reserves space and self-activates once a URL exists */}
          <GithubButton url={project.github} title={project.title} />
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
