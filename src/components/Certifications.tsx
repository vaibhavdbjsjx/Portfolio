import "./styles/Certifications.css";

const certifications = [
  {
    name: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    image: "/certificates/aws.jpg",
    url: "https://coursera.org/share/9abfeb563bdf39b73da060e3ea8a049b",
  },
  {
    name: "Data Analysis with Microsoft",
    issuer: "Microsoft",
    image: "/certificates/microsoft.jpg",
    url: "https://coursera.org/share/c67c550b4ad4aaa57eeaad4a6d505444",
  },
  {
    name: "IBM Machine Learning",
    issuer: "IBM",
    image: "/certificates/ibm.jpg",
    url: "https://coursera.org/share/90adfb0fee09afd5edf5873a11e29e54",
  },
  {
    name: "Google AI Essentials",
    issuer: "Google",
    image: "/certificates/google.jpg",
    url: "https://coursera.org/share/90adfb0fee09afd5edf5873a11e29e54",
  },
];

const Certifications = () => {
  return (
    <div className="certifications-section section-container" id="certifications">
      <h2>Certifications</h2>
      <div className="cert-grid">
        {certifications.map((cert, index) => (
          <div className="cert-card" key={index}>
            <div className="cert-image-container">
              <img src={cert.image} alt={cert.name} className="cert-image" />
            </div>
            <div className="cert-info">
              <h3>{cert.name}</h3>
              <p className="cert-issuer">Issued By: {cert.issuer}</p>
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-view-btn"
                data-cursor="disable"
              >
                View Certificate
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
