import { lazy, Suspense, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

/**
 * The contact globe pulls in @react-three/fiber + drei + three (~1.1 MB).
 * Importing it statically put that whole stack in the ENTRY chunk, so the
 * browser modulepreloaded it before the hero could paint. Loading it lazily —
 * and only once the section is near the viewport — keeps Three.js out of the
 * critical path entirely.
 */
const EarthCanvas = lazy(() => import("./EarthCanvas"));

const LazyGlobe = () => {
  const holderRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holderRef} className="contact-globe">
      {show && (
        <Suspense fallback={null}>
          <EarthCanvas />
        </Suspense>
      )}
    </div>
  );
};

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setFeedback(null);
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setLoading(false);
        setSent(true);
        setFeedback("Message sent successfully");
        alert("Message sent successfully");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => {
          setSent(false);
          setFeedback(null);
        }, 5000);
      })
      .catch((err: unknown) => {
        setLoading(false);
        setSent(false);
        console.error(err);
        setFeedback("Failed to send message");
        alert("Failed to send message");
        setTimeout(() => {
          setFeedback(null);
        }, 5000);
      });
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">

          <div className="contact-left">
            <div className="contact-info-block">
              <h4>Email</h4>
              <p><a href="mailto:Vaibhav.sg18@gmail.com" data-cursor="disable">Vaibhav.sg18@gmail.com</a></p>
              <h4>Phone</h4>
              <p><a href="tel:+916360254763" data-cursor="disable">+91 63602 54763</a></p>
              <h4>Location</h4>
              <p>Udupi, Kundapur, India</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="What's your good name?"
                />
              </div>
              <div className="contact-form-group">
                <label>Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="What's your email address?"
                />
              </div>
              <div className="contact-form-group">
                <label>Your Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What do you want to say?"
                />
              </div>
              <button type="submit" className="contact-send-btn" disabled={loading}>
                {loading ? "Sending..." : sent ? "Message Sent!" : "Send"}
              </button>
              {feedback && (
                <p className={sent ? "contact-success" : "contact-error"}>
                  {feedback}
                </p>
              )}
            </form>
          </div>

          <div className="contact-right">
            <LazyGlobe />
            <div className="contact-credit">
              <h2>Designed and Developed <br /> by <span>Vaibhav S G</span></h2>
              <h5><MdCopyright /> 2026</h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
