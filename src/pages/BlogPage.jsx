import { useState, useEffect } from "react";
import Footer from "../components/Footer";
// import AnimatedWaves from "../components/AnimatedWaves";
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
            text: "You sensed that you should be following a different path, a more ambitious one, you felt that you were destined for other things but you had no idea how to achieve them and in your misery you began to hate everything around you.",
            author: "Fyodor Dostoyevsky"
        }
    ];

    useEffect(() => {
        let timeout;
        const interval = setInterval(() => {
            setFade(false); // fade out
            timeout = setTimeout(() => {
                setQuoteIndex((prev) => (prev + 1) % quotes.length);
                setFade(true); // fade in
            }, 600);
        }, 8000); // Rotate every 8 seconds

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [quotes.length]);

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
                    justifyContent: "flex-start",
                    width: "100%",
                    textAlign: "center",
                    paddingTop: "2rem",
                }}
            >
                <h1 style={{ 
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: '0',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    borderWidth: '0'
                }}>
                    Blog
                </h1>
                <div style={{
                    display: "grid",
                    gridTemplateAreas: "'stack'",
                    width: "100%",
                    maxWidth: "850px",
                    padding: isMobile ? "0 1rem" : "0",
                    marginBottom: "2rem"
                }}>
                    {quotes.map((quote, idx) => (
                        <div
                            key={idx}
                            style={{
                                gridArea: "stack",
                                opacity: quoteIndex === idx && fade ? 1 : 0,
                                transition: "opacity 0.6s ease-in-out",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                pointerEvents: quoteIndex === idx ? "auto" : "none",
                                zIndex: quoteIndex === idx ? 1 : 0
                            }}
                        >
                            <p style={{ 
                                color: darkMode ? "#98a385" : "#6c7a59",
                                fontSize: isMobile ? "0.95rem" : "1.05rem",
                                lineHeight: "1.7",
                                margin: "0",
                                textAlign: "left",
                                fontFamily: "Georgia, serif"
                            }}>
                                {quote.text}
                            </p>
                            {quote.author && (
                                <p style={{ 
                                    color: darkMode ? "#98a385" : "#6c7a59",
                                    fontSize: isMobile ? "0.95rem" : "1.05rem",
                                    margin: "0.3rem 0 0 0",
                                    textAlign: "left",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "4px",
                                    fontFamily: "Georgia, serif"
                                }}>
                                    {quote.author}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

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
                    color: darkMode ? "rgba(255, 255, 255, 0.8)" : "#4b5563",
                    fontSize: isMobile ? "1.1rem" : "1.3rem",
                    marginBottom: "2rem",
                    maxWidth: "600px",
                    lineHeight: "1.6"
                }}>
                    Essays, notes, and experiments will live here.
                </p>

                {/* Notes Link */}
                <a
                    href="https://quartz-6zw.pages.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit my external notes site"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: darkMode ? "#ffffff" : "#1a1a1a",
                        textDecoration: "none",
                        fontSize: isMobile ? "1.1rem" : "1.2rem",
                        fontWeight: "600",
                        opacity: 0.9,
                        transition: "all 0.2s ease",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        outline: "none",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.gap = "0.75rem";
                        e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.gap = "0.5rem";
                        e.currentTarget.style.background = "transparent";
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.gap = "0.75rem";
                        e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                        e.currentTarget.style.boxShadow = darkMode ? "0 0 0 2px rgba(255,255,255,0.3)" : "0 0 0 2px rgba(0,0,0,0.2)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.gap = "0.5rem";
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <span>My notes</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </a>
            </div>
            <Footer darkMode={darkMode} isHomePage={false} />
        </div>
    );
};

export default BlogPage;
