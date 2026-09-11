/* eslint-disable react/prop-types */
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";
import { series } from "../content/blog-registry";

const SeriesHubPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();
    const { seriesId } = useParams();

    const currentSeries = series.find((s) => s.id === seriesId);

    if (!currentSeries) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: darkMode ? "#1a1a1a" : "#F5F0E8",
                    color: darkMode ? "#fff" : "#1a1a1a",
                    transition: "background-color 0.3s ease",
                }}
            >
                <h1>Series not found</h1>
                <Link
                    to="/blog"
                    style={{
                        color: darkMode ? "#a78bfa" : "#6366f1",
                        marginTop: "1rem",
                    }}
                >
                    ← Back to Writing
                </Link>
            </div>
        );
    }

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
                    padding: isMobile
                        ? "80px 20px 20px"
                        : "120px 40px 40px",
                }}
            >
                {/* Back link */}
                <Link
                    to="/blog"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        color: darkMode
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.4)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        fontFamily:
                            "'Courier New', Courier, monospace",
                        letterSpacing: "0.04em",
                        transition: "color 0.2s",
                        marginBottom: "2rem",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = darkMode
                            ? "#fff"
                            : "#000")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = darkMode
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.4)")
                    }
                >
                    <span style={{ fontSize: "1.1rem" }}>←</span>{" "}
                    Writing
                </Link>

                {/* Series Title */}
                <h1
                    style={{
                        fontFamily:
                            "'Georgia', 'Times New Roman', serif",
                        fontSize: isMobile ? "2.5rem" : "3.5rem",
                        fontWeight: 400,
                        color: darkMode ? "#ffffff" : "#1a1a1a",
                        margin: "0 0 1rem 0",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {currentSeries.title}
                </h1>

                {/* Description */}
                <p
                    style={{
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        lineHeight: 1.7,
                        color: darkMode
                            ? "rgba(255,255,255,0.65)"
                            : "#4b5563",
                        marginBottom: "3rem",
                        maxWidth: "600px",
                    }}
                >
                    {currentSeries.description}
                </p>

                {/* Table of Contents label */}
                <p
                    style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: darkMode
                            ? "rgba(255,255,255,0.35)"
                            : "rgba(0,0,0,0.3)",
                        marginBottom: "1.5rem",
                        fontFamily:
                            "'Courier New', Courier, monospace",
                    }}
                >
                    Table of contents
                </p>

                {/* Chapters List */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                    }}
                >
                    {currentSeries.chapters.map((chapter) => (
                        <Link
                            key={chapter.slug}
                            to={`/blog/${seriesId}/${chapter.slug}`}
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: "1rem",
                                textDecoration: "none",
                                padding: "1rem 0",
                                borderBottom: darkMode
                                    ? "1px solid rgba(255,255,255,0.06)"
                                    : "1px solid rgba(0,0,0,0.06)",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.paddingLeft =
                                    "0.5rem";
                                e.currentTarget.style.backgroundColor =
                                    darkMode
                                        ? "rgba(255,255,255,0.03)"
                                        : "rgba(0,0,0,0.02)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.paddingLeft =
                                    "0";
                                e.currentTarget.style.backgroundColor =
                                    "transparent";
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.85rem",
                                    fontFamily:
                                        "'Courier New', Courier, monospace",
                                    color: darkMode
                                        ? "rgba(255,255,255,0.3)"
                                        : "rgba(0,0,0,0.25)",
                                    minWidth: "1.5rem",
                                }}
                            >
                                {chapter.chapter}.
                            </span>
                            <div>
                                <span
                                    style={{
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        color: darkMode
                                            ? "rgba(255,255,255,0.35)"
                                            : "rgba(0,0,0,0.3)",
                                        display: "block",
                                        marginBottom: "0.25rem",
                                        fontFamily:
                                            "'Courier New', Courier, monospace",
                                    }}
                                >
                                    Chapter {chapter.chapter}
                                </span>
                                <span
                                    style={{
                                        fontFamily:
                                            "'Georgia', 'Times New Roman', serif",
                                        fontSize: isMobile
                                            ? "1.1rem"
                                            : "1.25rem",
                                        fontWeight: 500,
                                        color: darkMode
                                            ? "#ffffff"
                                            : "#1a1a1a",
                                    }}
                                >
                                    {chapter.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
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

export default SeriesHubPage;
