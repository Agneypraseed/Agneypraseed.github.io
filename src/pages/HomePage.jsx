import myAvatar from "../assets/avatar.jpg";
import blue_bg from "../assets/blue_bg.png";
import TypedText from "../components/TypedText";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import CanvasBackground from "../components/CanvasBackground";
import useIsMobile from "../hooks/useIsMobile";
import "./HomePage.css";

const desktopRoles = [
  {
    label: "FULL STACK DEVELOPER",
    className: "home-orbit__slot--developer",
  },
  {
    label: "AI RESEARCHER",
    className: "home-orbit__slot--researcher",
  },
];

const HomePage = ({ darkMode }) => {
  const { isMobile } = useIsMobile();

  return (
    <>
      <section
        className={`home-hero ${
          darkMode ? "home-hero--dark" : "home-hero--light"
        }`}
        aria-labelledby="home-hero-title"
        style={{
          backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
        }}
      >
        <CanvasBackground darkMode={darkMode} />

        <div className="home-hero__content">
          <div className="home-hero__intro">
            <p className="home-hero__eyebrow">HELLO WORLD! 👋</p>
            <h1 id="home-hero-title" className="home-hero__title">
              <span>I&apos;m</span>{" "}
              <strong className="home-hero__name">
                <TypedText
                  strings={["AGNEY", "अग्नेय", "アグネイ", "അഗ്നേയ്"]}
                  startDelay={300}
                  typeSpeed={100}
                  backSpeed={100}
                  backDelay={100}
                  loop={true}
                  cursorChar={""}
                  fontSize={isMobile ? 22 : 34}
                />
              </strong>
            </h1>

          </div>

          <div className="home-portrait-stage">
            <div
              className="home-portrait-stage__glow"
              aria-hidden="true"
            />
            <div
              className="home-portrait-stage__track"
              aria-hidden="true"
            />
            <img
              className="home-portrait-stage__image"
              src={myAvatar}
              alt="Illustrated portrait of Agney"
            />

            <div
              className="home-orbit"
              role="group"
              aria-label="Professional roles"
            >
              {desktopRoles.map(({ label, className }) => (
                <div
                  className={`home-orbit__slot ${className}`}
                  key={label}
                >
                  <div className="home-orbit__anchor">
                    <div className="home-orbit__counter">
                      <span className="home-orbit__card">{label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        id="skills-section"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          backgroundColor: darkMode ? "#171717" : "#fafaf9",
          transition: "background-color 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Skills darkMode={darkMode} />
        <Footer darkMode={darkMode} isHomePage={true} />
      </div>
    </>
  );
};

export default HomePage;
