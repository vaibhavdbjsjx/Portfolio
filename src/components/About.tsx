import { useEffect, useRef } from "react";
import "./styles/About.css";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<{ x: number; y: number; radius: number; opacity: number; speed: number }[]>([]);

  useEffect(() => {
    // Create hidden canvas for displacement map
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");

    const ripples = ripplesRef.current;
    let animationFrameId: number;

    const animate = () => {
      if (!ctx || !canvas) return;

      // Fill neutral gray (128, 128, 128) - 0 displacement
      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(0, 0, 256, 256);

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity -= 0.015; // Slow fade for premium effect

        if (r.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        // Positive displacement (white)
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Negative displacement (black)
        ctx.strokeStyle = `rgba(0, 0, 0, ${r.opacity})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 6), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update SVG filter image
      const feImage = document.getElementById("fe-image-ripple") as SVGImageElement | null;
      if (feImage) {
        feImage.setAttribute("href", canvas.toDataURL("image/png"));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Map mouse position to canvas coordinates (0 to 256)
    const x = ((e.clientX - rect.left) / rect.width) * 256;
    const y = ((e.clientY - rect.top) / rect.height) * 256;

    // Only add a ripple if we moved enough
    const lastRipple = ripplesRef.current[ripplesRef.current.length - 1];
    if (!lastRipple || Math.hypot(lastRipple.x - x, lastRipple.y - y) > 12) {
      ripplesRef.current.push({
        x,
        y,
        radius: 2,
        opacity: 0.8,
        speed: 1.8,
      });
    }
  };

  return (
    <div className="about-section" id="about">
      <div 
        className="about-me" 
        ref={containerRef}
        onMouseMove={handleMouseMove}
      >
        <h3 className="title">About Me</h3>
        <div className="about-content ripple-text">
          <p className="para">
            I'm a Computer Science Engineering student passionate about AI, Full-Stack Development, Prompting, Web Development, UI/UX Design, and building practical digital solutions.
          </p>
          <p className="para">
            I love learning new things, exploring different domains, and taking on challenges that push me beyond my comfort zone. Whether it's a technology I've used before or something completely new, I enjoy figuring things out and making them work.
          </p>
          <p className="para">
            Please don't think I am only limited to these fields; I can do any task, any work…. just assign me the task... Me + AI…..💥 Boom, your work is done.
          </p>
          <div className="mindset-section">
            <h4 className="mindset-title">My mindset is simple:</h4>
            <ul className="mindset-list">
              <li>Learn Fast.</li>
              <li>Adapt Fast.</li>
              <li>Build Fast.</li>
              <li>Deliver Results.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SVG Liquid Ripple Filter */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id="liquid-ripple-filter" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
            <feImage id="fe-image-ripple" href="" result="ripple-map" x="0%" y="0%" width="100%" height="100%" preserveAspectRatio="none" />
            <feDisplacementMap in="SourceGraphic" in2="ripple-map" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default About;
