import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:Vaibhav.sg18@gmail.com" data-cursor="disable">
                Vaibhav.sg18@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+916360254763" data-cursor="disable">
                +91 63602 54763
              </a>
            </p>
            <h4>Location</h4>
            <p>
              <span style={{ color: "white", fontSize: "1rem", fontFamily: "var(--font-family)" }}>
                Udupi, Kundapur, India
              </span>
            </p>
          </div>
          <div className="contact-box footer-photo-box">
            <div className="footer-photo-container">
              <div className="mobile-island"></div>
              <img src="/images/vaibhav.jpg" alt="Vaibhav S G" className="footer-photo" />
            </div>
            <h2>
              Designed and Developed <br /> by <span>Vaibhav S G</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
