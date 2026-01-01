import blue_bg from "../assets/blue_bg.png";
import Footer from "../components/Footer";

const FootprintsPage = ({ darkMode }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "transparent",
                backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "100px 20px 20px",
            }}
        >
            <div
                style={{
                    background: darkMode ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
                    padding: "3rem",
                    textAlign: "center",
                    maxWidth: "600px",
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <h1 style={{ 
                    color: darkMode ? "#ffffff" : "#333333",
                    marginBottom: "1rem",
                    fontSize: "2.5rem"
                }}>
                    Footprints
                </h1>
                <p style={{ 
                    color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    fontSize: "1.2rem",
                    marginBottom: "1rem"
                }}>
                    🌍 Coming Soon 🌍
                </p>
                <p style={{ 
                    color: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
                    fontSize: "0.95rem"
                }}>
                    Adventures and destinations from around the world.
                </p>
            </div>
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default FootprintsPage;
