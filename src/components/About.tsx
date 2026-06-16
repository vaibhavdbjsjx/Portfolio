import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <div className="about-content">
          <p className="para">
            I'm a Computer Science Engineering student passionate about AI, Full-Stack Development, Prompting, Web Development, UI/UX Design, and building practical digital solutions.
          </p>
          <p className="para">
            I love learning new things, exploring different domains, and taking on challenges that push me beyond my comfort zone. Whether it's a technology I've used before or something completely new, I enjoy figuring things out and making them work.
          </p>
          <p className="para accent-text">
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
    </div>
  );
};

export default About;
