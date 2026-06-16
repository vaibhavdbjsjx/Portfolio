import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SSLC Education</h4>
                <h5>Secondary School</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              Completed secondary education with SSLC score of 89.4%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>PUC Education</h4>
                <h5>Venkatramana PU College</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Completed Pre-University Course (PUC) with a score of 80.6%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Engineering (CSE)</h4>
                <h5>Canara Engineering College</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Specializing in Computer Science & Engineering, focusing on AI/ML engineering, full-stack web development, and scalable system architectures.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Android App Development Intern</h4>
                <h5>MindMatrix Technologies</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Developed native Android applications using Kotlin and Java. Integrated REST APIs, managed offline storage using Room ORM/SQLite, designed responsive UI workflows, and handled asynchronous operations with Kotlin Coroutines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
