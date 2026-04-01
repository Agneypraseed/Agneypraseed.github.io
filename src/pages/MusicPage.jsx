import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";
import musicPlaylists from "../data/music";

// Extract playlist ID from Spotify URL
const getPlaylistId = (url) => {
    if (!url) return null;
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
};

/* ── Full detail view (for image grid click) ── */
const MusicDetailView = ({ playlist, darkMode, isMobile, onClose }) => {
    const contentRef = useRef(null);
    const playlistId = getPlaylistId(playlist.spotifyUrl);

    if (!playlist) return null;

    return (
        <div
            onClick={(e) => {
                if (contentRef.current && !contentRef.current.contains(e.target)) {
                    onClose();
                }
            }}
            style={{
                position: "relative",
                width: "100%",
                minHeight: isMobile ? "auto" : "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "2rem 1rem" : "3rem 2rem",
                overflow: "hidden",
                animation: "fadeInMusic 0.5s ease",
                cursor: "default",
            }}
        >
            {/* Back button */}
            <button
                onClick={onClose}
                style={{
                    alignSelf: "flex-start",
                    background: "none",
                    border: "none",
                    color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    padding: "0.5rem 0",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "'Courier New', Courier, monospace",
                    letterSpacing: "0.04em",
                    transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = darkMode ? "#fff" : "#000")}
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = darkMode
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.4)")
                }
            >
                <span style={{ fontSize: "1.1rem" }}>←</span> Back
            </button>

            {/* Content area */}
            <div
                ref={contentRef}
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: isMobile ? "2rem" : "4rem",
                    width: "100%",
                    maxWidth: "1200px",
                }}
            >
                {/* Spotify Player Area */}
                <div
                    style={{
                        width: isMobile ? "100%" : "600px",
                        height: isMobile ? "380px" : "420px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: darkMode
                            ? "0 20px 60px rgba(0,0,0,0.6)"
                            : "0 15px 50px rgba(0,0,0,0.15)",
                        flexShrink: 0,
                        background: darkMode ? "#2a2a2a" : "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {playlistId ? (
                        <iframe
                            title={playlist.title}
                            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${darkMode ? "0" : "1"}`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            style={{ borderRadius: "12px", background: "transparent" }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                padding: "2rem",
                                textAlign: "center",
                                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                            }}
                        >
                            <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎵</span>
                            <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                                Spotify URL pending
                            </span>
                        </div>
                    )}
                </div>

                {/* Text info */}
                <div
                    style={{
                        width: isMobile ? "100%" : "300px",
                        textAlign: isMobile ? "center" : "left",
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontSize: isMobile ? "1.6rem" : "2.2rem",
                            fontWeight: 400,
                            fontStyle: "italic",
                            color: darkMode ? "#fff" : "#1a1a1a",
                            margin: "0 0 1rem 0",
                            lineHeight: 1.3,
                        }}
                    >
                        {playlist.title}
                    </h2>
                    {playlist.description && (
                        <p
                            style={{
                                margin: 0,
                                fontSize: isMobile ? "0.9rem" : "1rem",
                                lineHeight: 1.7,
                                color: darkMode ? "rgba(255,255,255,0.65)" : "#4b5563",
                            }}
                        >
                            {playlist.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Image grid view ── */
const ImageGridView = ({ playlists, darkMode, isMobile }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    // Stop clicking outside from closing if currently transitioning out 
    if (selectedPlaylist) {
        return (
            <MusicDetailView
                playlist={selectedPlaylist}
                darkMode={darkMode}
                isMobile={isMobile}
                onClose={() => setSelectedPlaylist(null)}
            />
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: isMobile
                    ? "repeat(auto-fill, minmax(130px, 1fr))"
                    : "repeat(auto-fill, minmax(180px, 1fr))",
                gap: isMobile ? "1.2rem" : "2rem",
                width: "100%",
                maxWidth: "1100px",
            }}
        >
            {playlists.map((playlist) => (
                <div key={playlist.id}>
                    <div
                        onClick={() => setSelectedPlaylist(playlist)}
                        style={{
                            cursor: "pointer",
                            borderRadius: "10px",
                            overflow: "hidden",
                            boxShadow: darkMode
                                ? "0 8px 24px rgba(0,0,0,0.4)"
                                : "0 4px 16px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            background: darkMode ? "#2a2a2a" : "#f5f5f5",
                            aspectRatio: "1/1",
                            position: "relative",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.boxShadow = darkMode
                                ? "0 12px 32px rgba(0,0,0,0.6)"
                                : "0 8px 24px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = darkMode
                                ? "0 8px 24px rgba(0,0,0,0.4)"
                                : "0 4px 16px rgba(0,0,0,0.1)";
                        }}
                    >
                        <img
                            src={playlist.cover}
                            alt={playlist.title}
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
                            <span style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎵</span>
                            <span style={{ fontSize: "0.75rem" }}>{playlist.title}</span>
                        </div>
                        {/* Play overlay icon on hover */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                            }}
                            className="music-card-overlay"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: "#1DB954", // Spotify Green
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                }}
                            >
                                <div
                                    style={{
                                        borderLeft: "14px solid white",
                                        borderTop: "8px solid transparent",
                                        borderBottom: "8px solid transparent",
                                        marginLeft: "4px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Title and subtitle below image */}
                    <p
                        style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            fontWeight: 500,
                            color: darkMode ? "#fff" : "#1a1a1a",
                            margin: "0.8rem 0 0.2rem 0",
                            lineHeight: 1.2,
                        }}
                    >
                        {playlist.title}
                    </p>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                            margin: 0,
                            fontFamily: "'Courier New', Courier, monospace",
                            letterSpacing: "0.02em",
                        }}
                    >
                        PLAYLIST
                    </p>
                </div>
            ))}
        </div>
    );
};

/* ── Main page ── */
const MusicPage = ({ darkMode }) => {
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
                @keyframes fadeInMusic {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .music-card-overlay {
                    opacity: 0;
                    backdrop-filter: blur(2px);
                    -webkit-backdrop-filter: blur(2px);
                    transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
                }
                div:hover > .music-card-overlay {
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
                        Pretrain-music
                    </h1>
                </div>

                <ImageGridView playlists={musicPlaylists} darkMode={darkMode} isMobile={isMobile} />

                {/* Footer */}
                <div style={{ marginTop: "auto", paddingTop: "3rem" }}>
                    <Footer darkMode={darkMode} isHomePage={false} />
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
