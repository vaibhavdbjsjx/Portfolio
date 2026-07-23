import { Fragment, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import gsap from "gsap";
import { Project } from "./ProjectData";
import { smoother } from "../Navbar";
import useButtonFX from "./useButtonFX";

interface Props {
  project: Project;
  onClose: () => void;
}

type Section =
  | { label: string; kind: "text"; value: string }
  | { label: string; kind: "list" | "tags"; value: string[] };

/** Only sections that actually have content get rendered. */
const buildSections = (project: Project): Section[] => {
  const r = project.readme;
  const all: Section[] = [
    { label: "Overview", kind: "text", value: r.overview },
    { label: "Problem Statement", kind: "text", value: r.problemStatement },
    { label: "Solution", kind: "text", value: r.solution },
    { label: "Features", kind: "list", value: r.features },
    { label: "Technologies Used", kind: "tags", value: r.technologies },
    { label: "Skills Gained", kind: "tags", value: r.skillsGained },
    { label: "Architecture", kind: "text", value: r.architecture },
    { label: "Challenges", kind: "list", value: r.challenges },
    { label: "Future Improvements", kind: "list", value: r.futureImprovements },
  ];

  return all.filter((s) =>
    s.kind === "text" ? s.value.trim() !== "" : s.value.length > 0
  );
};

/** Renders `inline code` spans. Values stay React text nodes — never innerHTML. */
const renderInline = (text: string) =>
  text.split(/(`[^`\n]+`)/g).map((chunk, i) =>
    chunk.length > 2 && chunk.startsWith("`") && chunk.endsWith("`") ? (
      <code className="readme-inline-code" key={i}>
        {chunk.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{chunk}</Fragment>
    )
  );

/**
 * Prose renderer for pasted README text.
 * Splits on ``` fences into code blocks, keeps paragraph breaks, and supports
 * `inline code`. Lets you paste real README content straight into ProjectData.
 */
const RichText = ({ value }: { value: string }) => {
  const parts = value.split("```");
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          // Drop a leading language hint (```ts) if present
          const body = part.replace(/^[a-zA-Z0-9+#-]*\n/, "").replace(/\s+$/, "");
          return (
            <pre className="readme-code" key={i} tabIndex={0}>
              <code>{body}</code>
            </pre>
          );
        }
        return part
          .split(/\n{2,}/)
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, j) => (
            <p className="readme-text" key={`${i}-${j}`}>
              {renderInline(para)}
            </p>
          ));
      })}
    </>
  );
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

const ReadmeModal = ({ project, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useButtonFX<HTMLButtonElement>({ strength: 0.22 });
  const isClosing = useRef(false);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const sections = buildSections(project);
  const titleId = `readme-title-${project.id}`;

  /** Plays the exit animation, then unmounts via the parent. */
  const close = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, {
        y: 18,
        scale: 0.975,
        opacity: 0,
        duration: 0.26,
        ease: "power2.in",
      })
      .to(overlayRef.current, { opacity: 0, duration: 0.22 }, "<0.03");
  }, [onClose]);

  // Entrance: overlay lifts in, panel settles, sections cascade
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.32, ease: "power2.out" }
    )
      .fromTo(
        panelRef.current,
        { y: 34, scale: 0.965, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.62, ease: "power4.out" },
        "<0.04"
      )
      .fromTo(
        scrollRef.current?.children ?? [],
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.055,
          clearProps: "transform,opacity",
        },
        "<0.18"
      );

    return () => {
      tl.kill();
    };
  }, []);

  // Lock page scrolling (ScrollSmoother on desktop, native on mobile)
  useEffect(() => {
    smoother?.paused(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      smoother?.paused(false);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Focus management: move focus in, restore on close
  useEffect(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    return () => {
      restoreFocusTo.current?.focus?.();
    };
  }, [closeBtnRef]);

  // ESC, focus trap, and keyboard scrolling of the content region
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }

      const scroller = scrollRef.current;
      // Page/Home/End scroll the panel body even when focus is on the button
      if (scroller && ["PageDown", "PageUp", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        const page = scroller.clientHeight * 0.9;
        const to =
          e.key === "PageDown"
            ? scroller.scrollTop + page
            : e.key === "PageUp"
            ? scroller.scrollTop - page
            : e.key === "Home"
            ? 0
            : scroller.scrollHeight;
        scroller.scrollTo({ top: to, behavior: "smooth" });
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [close]);

  return createPortal(
    <div
      className="readme-overlay"
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="readme-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="readme-head">
          <div className="readme-head-text">
            <span className="readme-eyebrow">Project</span>
            <h2 className="readme-title" id={titleId}>
              {project.title}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="readme-close"
            onClick={close}
            aria-label="Close"
            data-cursor="disable"
          >
            <FiX aria-hidden="true" />
          </button>
        </header>

        <div className="readme-scroll" ref={scrollRef} tabIndex={0}>
          {sections.length === 0 ? (
            <p className="readme-empty">README content has not been added yet.</p>
          ) : (
            sections.map((section) => (
              <section className="readme-section" key={section.label}>
                <h3 className="readme-section-title">{section.label}</h3>

                {section.kind === "text" && <RichText value={section.value} />}

                {section.kind === "list" && (
                  <ul className="readme-list">
                    {section.value.map((item, i) => (
                      <li key={i}>{renderInline(item)}</li>
                    ))}
                  </ul>
                )}

                {section.kind === "tags" && (
                  <ul className="readme-tags">
                    {section.value.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReadmeModal;
