import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";

// Spotify playlists
const SPOTIFY_PLAYLISTS = [
    {
        name: "My Playlist",
        url: "https://open.spotify.com/playlist/0BqG6ObQuIwlpIWXDe6bTA",
    },
];

// Extract playlist ID from Spotify URL
const getPlaylistId = (url) => {
    if (!url) return null;
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
};

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

                {/* Spotify playlists */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2.5rem",
                        width: "100%",
                        maxWidth: "800px",
                    }}
                >
                    {SPOTIFY_PLAYLISTS.map((playlist, index) => {
                        const playlistId = getPlaylistId(playlist.url);
                        if (!playlistId) return null;

                        return (
                            <div key={playlistId || index}>
                                {SPOTIFY_PLAYLISTS.length > 1 && playlist.name && (
                                    <h2
                                        style={{
                                            fontFamily: "'Georgia', 'Times New Roman', serif",
                                            fontSize: isMobile ? "1.2rem" : "1.5rem",
                                            fontWeight: 400,
                                            fontStyle: "italic",
                                            color: darkMode ? "rgba(255,255,255,0.7)" : "#333",
                                            margin: "0 0 0.8rem 0",
                                        }}
                                    >
                                        {playlist.name}
                                    </h2>
                                )}
                                <div
                                    style={{
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        boxShadow: darkMode
                                            ? "0 8px 32px rgba(0,0,0,0.4)"
                                            : "0 4px 20px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <iframe
                                        title={playlist.name || `Playlist ${index + 1}`}
                                        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${darkMode ? "0" : "1"}`}
                                        width="100%"
                                        height={isMobile ? "480" : "580"}
                                        frameBorder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                        style={{ borderRadius: "12px" }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div style={{ marginTop: "auto", paddingTop: "3rem" }}>
                    <Footer darkMode={darkMode} isHomePage={false} />
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
