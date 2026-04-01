import { useState } from "react";
import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";
import videos from "../data/videos";

/* ── Main page ── */
const VideosPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                transition: "background-color 0.3s ease",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>{`
                .video-card-overlay {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                div:hover > .video-card-overlay {
                    opacity: 1;
                }
            `}</style>

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    padding: isMobile ? "80px 20px 16px" : "100px 60px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: isMobile ? "2rem" : "3rem" }}>
                    <h1
                        style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontSize: isMobile ? "2.5rem" : "4rem",
                            fontWeight: 400,
                            color: darkMode ? "#ffffff" : "#1a1a1a",
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Pretrain-video
                    </h1>
                </div>

                {/* Image grid with titles below */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "repeat(auto-fill, minmax(120px, 1fr))"
                            : "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: isMobile ? "1.2rem" : "1.5rem",
                        width: "100%",
                        maxWidth: "1100px",
                    }}
                >
                    {videos.map((video) => (
                        <div key={video.id}>
                            <div
                                style={{
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    boxShadow: darkMode
                                        ? "0 4px 16px rgba(0,0,0,0.3)"
                                        : "0 2px 12px rgba(0,0,0,0.08)",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    background: darkMode ? "#2a2a2a" : "#f5f5f5",
                                    aspectRatio: "2/3",
                                    position: "relative",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                                    e.currentTarget.style.boxShadow = darkMode
                                        ? "0 8px 24px rgba(0,0,0,0.5)"
                                        : "0 6px 20px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                                    e.currentTarget.style.boxShadow = darkMode
                                        ? "0 4px 16px rgba(0,0,0,0.3)"
                                        : "0 2px 12px rgba(0,0,0,0.08)";
                                }}
                            >
                                <img
                                    src={video.cover}
                                    alt={video.title}
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "none",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        inset: 0,
                                        padding: "1rem",
                                        textAlign: "center",
                                        color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                                    }}
                                >
                                    <span style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎬</span>
                                    <span style={{ fontSize: "0.75rem" }}>{video.title}</span>
                                </div>
                            </div>
                            {/* Title below image */}
                            <p
                                style={{
                                    fontFamily: "'Georgia', 'Times New Roman', serif",
                                    fontSize: isMobile ? "0.75rem" : "0.85rem",
                                    fontWeight: 500,
                                    color: darkMode ? "rgba(255,255,255,0.75)" : "#333",
                                    margin: "0.5rem 0 0 0",
                                    textAlign: "center",
                                    lineHeight: 1.3,
                                }}
                            >
                                {video.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ marginTop: "auto", paddingTop: "3rem" }}>
                    <Footer darkMode={darkMode} isHomePage={false} />
                </div>
            </div>
        </div>
    );
};

export default VideosPage;
