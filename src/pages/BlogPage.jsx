import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import AnimatedWaves from "../components/AnimatedWaves";
import useIsMobile from "../hooks/useIsMobile";

const BlogPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const quotes = [
        {
            text: "As long as life continues, make love with the present moment while giving your unique gift.",
            author: null
        },
        {
            text: "You sensed that you should be following a different path, a more ambitious one. You felt that you were destined for other things, but you had no idea how to achieve them, and in your misery you began to hate everything around you.",
            author: "Fyodor Dostoevsky"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setQuoteIndex((prev) => (prev + 1) % quotes.length);
                setFade(true); // fade in
            }, 600);
        }, 8000); // Rotate every 8 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                padding: isMobile ? "80px 16px 16px" : "100px 40px 20px",
                transition: "background-color 0.3s ease",
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
                    color: darkMode ? "#ffffff" : "#1a1a1a",
                    marginBottom: "0.75rem",
                    fontSize: isMobile ? "2rem" : "3rem",
                }}>
                    Blog
                </h1>
                <span style={{
                    display: "inline-block",
                    background: darkMode ? "rgba(255, 193, 7, 0.2)" : "rgba(255, 193, 7, 0.15)",
                    color: darkMode ? "#ffc107" : "#b8860b",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                    border: darkMode ? "1px solid rgba(255, 193, 7, 0.3)" : "1px solid rgba(255, 193, 7, 0.4)",
                }}>
                    🚧 Work in Progress
                </span>
                {/* <AnimatedWaves darkMode={darkMode} /> */}
                <p style={{ 
                    color: darkMode ? "rgba(255, 255, 255, 0.8)" : "#1a1a1a",
                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                    marginBottom: "1.5rem"
                }}>
                    ✍️ Coming Soon ✍️
                </p>
                <div style={{
                    opacity: fade ? 1 : 0,
                    transition: "opacity 0.6s ease-in-out",
                    minHeight: "180px", // Keeps layout stable as text switches
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "700px"
                }}>
                    <p style={{ 
                        color: darkMode ? "rgba(255, 255, 255, 0.6)" : "#6b7280",
                        fontSize: isMobile ? "0.95rem" : "1.1rem",
                        fontStyle: "italic",
                        lineHeight: "1.8",
                        padding: isMobile ? "0 1rem" : "0",
                        marginBottom: quotes[quoteIndex].author ? "0.75rem" : "3rem",
                        textAlign: "center"
                    }}>
                        "{quotes[quoteIndex].text}"
                    </p>
                    {quotes[quoteIndex].author && (
                        <p style={{ 
                            color: darkMode ? "rgba(255, 255, 255, 0.4)" : "#9ca3af",
                            fontSize: "0.95rem",
                            marginBottom: "3rem",
                            textAlign: "center"
                        }}>
                            — {quotes[quoteIndex].author}
                        </p>
                    )}
                </div>

                {/* Notes Link */}
                <a
                    href="https://quartz-6zw.pages.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: darkMode ? "#ffffff" : "#1a1a1a",
                        textDecoration: "none",
                        fontSize: isMobile ? "1.1rem" : "1.3rem",
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
            <Footer darkMode={darkMode} isHomePage={false} />
        </div>
    );
};

export default BlogPage;
