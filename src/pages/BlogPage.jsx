import blue_bg from "../assets/blue_bg.png";
import Footer from "../components/Footer";
import AnimatedWaves from "../components/AnimatedWaves";

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
                    color: "#ffffff",
                    marginBottom: "0.75rem",
                    fontSize: "3rem",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}>
                    Blog
                </h1>
                <span style={{
                    display: "inline-block",
                    background: "rgba(255, 193, 7, 0.2)",
                    color: "#ffc107",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                }}>
                    🚧 Work in Progress
                </span>
                <AnimatedWaves darkMode={darkMode} />
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
                    marginBottom: "3rem",
                }}>
                    — Robert Cormier
                </p>

                {/* Notes Link */}
                <a
                    href="https://quartz-6zw.pages.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "1.3rem",
                        fontWeight: "500",
                        opacity: 0.9,
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.gap = "0.75rem";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.gap = "0.5rem";
                    }}
                >
                    <span>Notes</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </a>
            </div>
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default BlogPage;
