import myAvatar from "../assets/avatar.jpg";
import blue_bg from "../assets/blue_bg.png";
import TypedText from "../components/TypedText";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import CanvasBackground from "../components/CanvasBackground";
import useIsMobile from "../hooks/useIsMobile";

const HomePage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();

    return (
        <>
            <div
                style={{
                    position: "relative",
                    margin: 0,
                    height: "100vh",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    color: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(255, 255, 255, 0.87)",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "space-between",
                    backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: darkMode ? "#1a1a1a" : "rgba(255, 255, 255, 0.9)",
                    transition: "background-color 0.3s ease, background-image 0.3s ease",
                    overflow: "hidden",
                }}
            >
                <CanvasBackground darkMode={darkMode} />
                <div style={{ padding: "0 20px", overflow: "hidden", zIndex: 20 }}>
                    <div style={{
                        padding: isMobile ? "20px" : "120px",
                        textAlign: isMobile ? "center" : "left",
                    }}>
                        <h4>HELLO WORLD! 👋</h4>
                        I&apos;m{" "}
                        <strong style={{ color: "#66d4cf" }}>
                            <TypedText
                                strings={["AGNEY", "अग्नेय", "アグネイ", "അഗ്നെയ്"]}
                                startDelay={300}
                                typeSpeed={100}
                                backSpeed={100}
                                backDelay={100}
                                loop={true}
                                cursorChar={""}
                                fontSize={isMobile ? 22 : 34}
                            />
                        </strong>
                        <h3>
                            <TypedText
                                strings={["FULL STACK DEVELOPER", "Building Intelligent Systems"]}
                                startDelay={300}
                                typeSpeed={100}
                                backSpeed={100}
                                backDelay={100}
                                loop={true}
                                cursorChar={"|"}
                                fontSize={isMobile ? 24 : 54}
                            />
                        </h3>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: isMobile ? "center" : "flex-end",
                        marginRight: isMobile ? "0" : "340px",
                        overflow: "hidden",
                        zIndex: 20,
                    }}
                >
                    <img
                        src={myAvatar}
                        alt="home pic"
                        style={{
                            width: isMobile ? "140px" : "200px",
                            height: isMobile ? "140px" : "200px",
                            borderRadius: "50%",
                        }}
                    />
                </div>
            </div>
            <div
                id="skills-section"
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: darkMode ? "#1a1a1a" : "transparent",
                    backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "all 0.3s ease",
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
