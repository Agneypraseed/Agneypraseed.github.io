import { useState } from "react";
import Footer from "../components/Footer";
import TravelGlobe from "../components/TravelGlobe";
import travels from "../data/travels";
import useIsMobile from "../hooks/useIsMobile";

const FootprintsPage = ({ darkMode }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const { isMobile } = useIsMobile();

    // Filter photos based on selected location, or show favorites if none selected
    const displayedPhotos = selectedLocation 
        ? travels.filter(t => t.location === selectedLocation)
        : travels.filter(t => t.isFavorite);

    // Show all if no favorites and no selection
    const photosToShow = displayedPhotos.length > 0 ? displayedPhotos : travels;

    const handleLocationClick = (location) => {
        setSelectedLocation(location === selectedLocation ? null : location);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                padding: isMobile ? "80px 12px 16px" : "100px 20px 20px",
                transition: "background-color 0.3s ease",
            }}
        >
            {/* Title */}
            <h1 style={{ 
                color: darkMode ? "#ffffff" : "#1a1a1a",
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: isMobile ? "1.8rem" : "2.5rem",
            }}>
                Footprints
            </h1>
            <p style={{
                color: darkMode ? "rgba(255,255,255,0.7)" : "#6b7280",
                textAlign: "center",
                marginBottom: "2rem",
                fontSize: isMobile ? "0.95rem" : "1.1rem",
            }}>
                Agney Around the World ✨
            </p>

            {/* Globe */}
            <TravelGlobe 
                darkMode={darkMode} 
                locations={travels} 
                onLocationClick={handleLocationClick}
                selectedLocation={selectedLocation}
            />

            {/* Location Filter Indicator */}
            {travels.length > 0 && (
                <div style={{
                    textAlign: "center",
                    marginBottom: "1.5rem",
                }}>
                    {selectedLocation ? (
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            background: darkMode ? "rgba(0, 255, 136, 0.2)" : "rgba(0, 200, 100, 0.1)",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "50px",
                            color: darkMode ? "#00ff88" : "#047857",
                            fontWeight: "600",
                            border: darkMode ? "none" : "1px solid rgba(0, 200, 100, 0.2)",
                        }}>
                            <span>📍 {selectedLocation}</span>
                            <button
                                onClick={() => setSelectedLocation(null)}
                                style={{
                                    background: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    color: "inherit",
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Photo Grid - Polaroid Style */}
            {travels.length > 0 ? (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(140px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: isMobile ? "1rem" : "2rem",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: isMobile ? "0" : "0 1rem",
                    width: "100%",
                }}>
                    {photosToShow.map((travel) => (
                        <div
                            key={travel.id}
                            onClick={() => setSelectedImage(travel)}
                            style={{
                                background: "#ffffff",
                                padding: isMobile ? "6px 6px 36px 6px" : "12px 12px 50px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 40px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                position: "relative",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.02) rotate(-1deg)";
                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.2), 0 12px 50px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 40px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            {/* Photo */}
                            <div style={{
                                aspectRatio: "1",
                                overflow: "hidden",
                                borderRadius: "2px",
                            }}>
                                <img
                                    src={travel.image}
                                    alt={travel.location}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            {/* Favorite badge */}
                            {travel.isFavorite && (
                                <div style={{
                                    position: "absolute",
                                    top: isMobile ? "12px" : "20px",
                                    right: isMobile ? "12px" : "20px",
                                    background: "rgba(255,255,255,0.9)",
                                    borderRadius: "50%",
                                    width: isMobile ? "22px" : "28px",
                                    height: isMobile ? "22px" : "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: isMobile ? "11px" : "14px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}>
                                    ⭐
                                </div>
                            )}
                            {/* Caption on white border */}
                            <div style={{
                                position: "absolute",
                                bottom: isMobile ? "4px" : "10px",
                                left: isMobile ? "6px" : "12px",
                                right: isMobile ? "6px" : "12px",
                                textAlign: "center",
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontWeight: "600", 
                                    fontSize: isMobile ? "0.7rem" : "0.9rem",
                                    color: "#333",
                                    fontFamily: "'Caveat', cursive, sans-serif",
                                }}>
                                    📍 {travel.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: darkMode ? "rgba(255,255,255,0.6)" : "#9ca3af",
                }}>
                    <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>🌍</p>
                    <p style={{ fontSize: "1.1rem" }}>Add photos to src/data/travels.js</p>
                </div>
            )}

            {/* Lightbox */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.9)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000,
                        cursor: "pointer",
                        padding: isMobile ? "1rem" : "2rem",
                    }}
                >
                    <img
                        src={selectedImage.image}
                        alt={selectedImage.location}
                        style={{
                            maxWidth: isMobile ? "95%" : "90%",
                            maxHeight: "70vh",
                            borderRadius: "12px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        }}
                    />
                    <div style={{ 
                        color: "white", 
                        textAlign: "center", 
                        marginTop: "1.5rem" 
                    }}>
                        <h2 style={{ margin: 0, fontSize: isMobile ? "1.2rem" : "1.5rem" }}>📍 {selectedImage.location}</h2>
                        <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>{selectedImage.date}</p>
                    </div>
                </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                <Footer darkMode={darkMode} isHomePage={false} />
            </div>
        </div>
    );
};

export default FootprintsPage;
