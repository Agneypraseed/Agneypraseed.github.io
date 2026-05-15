import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import SceneCardFan from "../components/SceneCardFan";
import useIsMobile from "../hooks/useIsMobile";
import videos from "../data/videos";

/* ── Full detail view (for image grid click) ── */
const VideoDetailView = ({ video, darkMode, isMobile, onClose }) => {
    // null = showing movie cover, or a scene id = showing that scene
    const [selectedSceneId, setSelectedSceneId] = useState(null);

    // Reset when a new video is selected
    useEffect(() => {
        setSelectedSceneId(null);
    }, [video?.id]);

    if (!video) return null;

    const scenes = video.scenes || [];
    const selectedScene = scenes.find(s => s.id === selectedSceneId);
    const mainImage = selectedScene ? selectedScene.image : video.cover;



    return (
        <div
            onClick={(e) => {
                // Only fire when clicking the wrapper itself, not children
                if (e.target === e.currentTarget) {
                    if (selectedSceneId !== null) {
                        setSelectedSceneId(null);
                    } else {
                        onClose();
                    }
                }
            }}
            style={{
                position: "relative",
                width: "100%",
                minHeight: isMobile ? "600px" : "900px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: isMobile ? "2rem 1rem" : "4rem 2rem",
                animation: "fadeInBook 0.5s ease",
                cursor: "default",
            }}
        >
            {/* Back button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (selectedSceneId !== null) {
                        setSelectedSceneId(null);
                    } else {
                        onClose();
                    }
                }}
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "20px",
                    background: "none",
                    border: "none",
                    color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    padding: "0.5rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "'Courier New', Courier, monospace",
                    letterSpacing: "0.04em",
                    transition: "color 0.2s",
                    zIndex: 50,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? "#fff" : "#000"}
                onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
            >
                <span style={{ fontSize: "1.1rem" }}>←</span> Back
            </button>

            {/* Main display card */}
            <div
                style={{
                    width: selectedSceneId !== null ? (isMobile ? "90vw" : "800px") : (isMobile ? "240px" : "340px"),
                    height: selectedSceneId !== null ? (isMobile ? "calc(90vw * 9/16)" : "450px") : (isMobile ? "360px" : "510px"),
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: darkMode
                        ? "0 20px 60px rgba(0,0,0,0.6)"
                        : "0 15px 50px rgba(0,0,0,0.15)",
                    background: darkMode ? "#2a2a2a" : "#f0f0f0",
                    position: "relative",
                    zIndex: 20,
                    border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                    marginTop: isMobile ? "2rem" : "3rem",
                    flexShrink: 0,
                    transition: "width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
                }}
            >
                {mainImage ? (
                    <img
                        key={mainImage}
                        src={mainImage}
                        alt=""
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            animation: "fadeInBook 0.3s ease",
                        }}
                    />
                ) : (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "center", height: "100%", padding: "2rem",
                        textAlign: "center", color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                    }}>
                        <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎬</span>
                    </div>
                )}
            </div>

            {/* Scene cards fan */}
            {scenes.length > 0 && (
                <div style={{
                    width: "100%",
                    marginTop: scenes.length <= 2 ? (isMobile ? "24px" : "36px") : (isMobile ? "50px" : "80px"),
                    paddingBottom: isMobile ? "16px" : "24px",
                }}>
                    <SceneCardFan
                        scenes={scenes}
                        darkMode={darkMode}
                        isMobile={isMobile}
                        onCardClick={(scene) => {
                            setSelectedSceneId(scene.id);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

/* ── Main page ── */
const VideosPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: darkMode ? "#1a1a1a" : "#F5F0E8",
                transition: "background-color 0.3s ease",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>{`
                @keyframes fadeInBook {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
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
                {!selectedVideo && (
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
                )}

                {/* Conditional Rendering: Detail View or Grid View */}
                {selectedVideo ? (
                    <VideoDetailView 
                        video={selectedVideo} 
                        darkMode={darkMode} 
                        isMobile={isMobile} 
                        onClose={() => setSelectedVideo(null)} 
                    />
                ) : (
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
                                    onClick={() => setSelectedVideo(video)}
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
                                        cursor: "pointer"
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
                )}

                {/* Footer */}
                <div style={{ marginTop: "auto", paddingTop: "3rem" }}>
                    <Footer darkMode={darkMode} isHomePage={false} />
                </div>
            </div>
        </div>
    );
};

export default VideosPage;
