import { FiGithub } from "react-icons/fi";

interface Props {
  /** Full repository URL. Empty string renders the disabled placeholder. */
  url: string;
  /** Project title, used to build an accessible label. */
  title: string;
}

/**
 * Bare GitHub icon — no button chrome, no container.
 *
 * Always rendered so every card reserves the same footprint for its two
 * actions. The moment a `github` URL is filled in inside ProjectData.ts this
 * flips from the disabled placeholder to a live link — no JSX changes needed,
 * and the layout is identical in both states.
 *
 * All hover motion is pure CSS (scale + rotate + glow) to stay on the
 * compositor at 60fps.
 */
const GithubButton = ({ url, title }: Props) => {
  const enabled = url.trim() !== "";

  if (!enabled) {
    return (
      <span
        className="pcard-gh is-disabled"
        role="img"
        aria-label={`Repository for ${title} is not available yet`}
        title="Repository coming soon"
      >
        <FiGithub aria-hidden="true" />
      </span>
    );
  }

  return (
    <a
      className="pcard-gh"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the ${title} repository on GitHub in a new tab`}
      title="View source on GitHub"
      data-cursor="disable"
    >
      <FiGithub aria-hidden="true" />
    </a>
  );
};

export default GithubButton;
