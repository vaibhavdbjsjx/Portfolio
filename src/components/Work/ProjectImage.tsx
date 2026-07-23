import { useState } from "react";

interface Props {
  src: string;
  alt: string;
}

/**
 * Fixed-ratio image frame (16:10).
 *
 * The wrapper owns the aspect ratio so the grid never shifts while images load
 * (no CLS).
 *
 * The whole image is always visible — the foreground uses `object-fit: contain`
 * so nothing is ever cropped. To avoid dead letterbox bars when a screenshot's
 * ratio differs from the frame's, a blurred, scaled copy of the same image fills
 * the space behind it. One <img> src, two presentations, no extra download.
 *
 * Load choreography: blurred placeholder → fade in → resolve to sharp → a single
 * shine sweep across the frame.
 */
const ProjectImage = ({ src, alt }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const showImage = src && !failed;
  const state = loaded ? "is-loaded" : "";

  return (
    <div className="pcard-media">
      {showImage ? (
        <>
          {/* Decorative fill behind the letterbox area */}
          <img
            className={`pcard-img-bg ${state}`}
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          {/* The real, never-cropped image */}
          <img
            className={`pcard-img ${state}`}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
          {/* One-shot shine sweep, triggered when the image resolves */}
          {loaded && <span className="pcard-shine" aria-hidden="true" />}
        </>
      ) : (
        // No image supplied yet — neutral frame, keeps the card's shape.
        <div className="pcard-img-empty" aria-hidden="true" />
      )}
    </div>
  );
};

export default ProjectImage;
