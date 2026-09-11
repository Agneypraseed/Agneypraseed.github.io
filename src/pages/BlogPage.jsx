/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";
import { series, essays } from "../content/blog-registry";

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
            setFade(false);
            timeout = setTimeout(() => {
                setQuoteIndex((prev) => (prev + 1) % quotes.length);
                setFade(true);
            }, 600);
        }, 8000);

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
                backgroundColor: darkMode ? "#1a1a1a" : "#F5F0E8",
                transition: "background-color 0.3s ease",
            }}
        >
            <div
                style={{
                    flex: 1,
                    maxWidth: "720px",
                    width: "100%",
                    margin: "0 auto",
                    padding: isMobile ? "80px 20px 20px" : "120px 40px 40px",
                }}
            >
                {/* Rotating Quotes */}
                <div style={{
                    display: "grid",
                    gridTemplateAreas: "'stack'",
                    width: "100%",
                    marginBottom: "3rem",
                    minHeight: "80px",
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
                                fontFamily: "Georgia, serif",
                                fontStyle: "italic",
                            }}>
                                “{quote.text}”
                            </p>
                            {quote.author && (
                                <p style={{
                                    color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
                                    fontSize: "0.85rem",
                                    margin: "0.5rem 0 0 0",
                                    textAlign: "left",
                                    fontFamily: "'Courier New', Courier, monospace",
                                }}>
                                    — {quote.author}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                    marginBottom: "2.5rem",
                }} />

                {/* Series List */}
                {series.map((s) => (
                    <div key={s.id} style={{ marginBottom: "2.5rem" }}>
                        <Link
                            to={`/blog/${s.id}`}
                            style={{
                                textDecoration: "none",
                                display: "block",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateX(4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateX(0)";
                            }}
                        >
                            <h2 style={{
                                fontFamily: "'Georgia', 'Times New Roman', serif",
                                fontSize: isMobile ? "1.4rem" : "1.6rem",
                                fontWeight: 600,
                                color: darkMode ? "#ffffff" : "#1a1a1a",
                                margin: "0 0 0.5rem 0",
                                lineHeight: 1.3,
                            }}>
                                {s.title}
                            </h2>
                            <p style={{
                                fontSize: isMobile ? "0.9rem" : "0.95rem",
                                color: darkMode ? "rgba(255,255,255,0.55)" : "#4b5563",
                                margin: "0 0 0.75rem 0",
                                lineHeight: 1.6,
                            }}>
                                {s.description}
                            </p>
                            <span style={{
                                fontSize: "0.8rem",
                                fontFamily: "'Courier New', Courier, monospace",
                                color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
                                letterSpacing: "0.04em",
                            }}>
                                Table of contents · {s.chapters.length} chapter{s.chapters.length !== 1 ? "s" : ""}
                            </span>
                        </Link>
                    </div>
                ))}

                {/* Standalone Essays */}
                {essays.map((essay) => (
                    <div key={essay.slug} style={{ marginBottom: "2rem" }}>
                        <Link
                            to={`/blog/essays/${essay.slug}`}
                            style={{
                                textDecoration: "none",
                                display: "block",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateX(4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateX(0)";
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}>
                                <h2 style={{
                                    fontFamily: "'Georgia', 'Times New Roman', serif",
                                    fontSize: isMobile ? "1.2rem" : "1.3rem",
                                    fontWeight: 500,
                                    color: darkMode ? "#ffffff" : "#1a1a1a",
                                    margin: 0,
                                }}>
                                    {essay.title}
                                </h2>
                                <span style={{
                                    fontSize: "0.8rem",
                                    fontFamily: "'Courier New', Courier, monospace",
                                    color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
                                }}>
                                    {essay.date}
                                </span>
                            </div>
                            {essay.description && (
                                <p style={{
                                    fontSize: "0.9rem",
                                    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
                                    margin: "0.4rem 0 0 0",
                                    lineHeight: 1.5,
                                }}>
                                    {essay.description}
                                </p>
                            )}
                        </Link>
                    </div>
                ))}

                {/* Divider */}
                <div style={{
                    borderTop: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                    margin: "2rem 0 1.5rem",
                }} />

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
                        color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = darkMode ? "#fff" : "#000";
                        e.currentTarget.style.gap = "0.75rem";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
                        e.currentTarget.style.gap = "0.5rem";
                    }}
                >
                    <span>My notes</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </a>
            </div>

            <div
                style={{
                    maxWidth: "720px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "0 40px",
                }}
            >
                <Footer darkMode={darkMode} isHomePage={false} />
            </div>
        </div>
    );
};

export default BlogPage;
