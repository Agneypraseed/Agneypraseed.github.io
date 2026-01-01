import blue_bg from "../assets/blue_bg.png";
import blogWaves from "../assets/blog_waves.png";
import Footer from "../components/Footer";

const BlogPage = ({ darkMode }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "transparent",
                backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "100px 40px 20px",
            }}
        >
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <h1 style={{ 
                    color: darkMode ? "#ffffff" : "#333333",
                    marginBottom: "2rem",
                    fontSize: "3rem"
                }}>
                    Blog
                </h1>
                <img 
                    src={blogWaves} 
                    alt="Creative waves" 
                    style={{ 
                        width: "100%", 
                        maxWidth: "500px", 
                        marginBottom: "2rem",
                        opacity: darkMode ? 0.8 : 1,
                    }} 
                />
                <p style={{ 
                    color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.95)",
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem"
                }}>
                    ✍️ Coming Soon ✍️
                </p>
                <p style={{ 
                    color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.9)",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    lineHeight: "1.8",
                    maxWidth: "600px",
                }}>
                    "The beautiful thing about writing is that you don't have to get it right the first time, 
                    unlike, say, a brain surgeon."
                </p>
                <p style={{ 
                    color: darkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.95rem",
                    marginTop: "0.75rem",
                }}>
                    — Robert Cormier
                </p>
            </div>
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default BlogPage;
