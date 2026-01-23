import { useState } from "react";
import blue_bg from "../assets/blue_bg.png";
import Footer from "../components/Footer";
import TravelGlobe from "../components/TravelGlobe";
import travels from "../data/travels";

const FootprintsPage = ({ darkMode }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

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
                backgroundColor: darkMode ? "#1a1a1a" : "transparent",
                backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                padding: "100px 20px 20px",
            }}
        >
            {/* Title */}
            <h1 style={{ 
                color: darkMode ? "#ffffff" : "#ffffff",
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "2.5rem",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>
                Footprints
            </h1>
            <p style={{
                color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)",
                textAlign: "center",
                marginBottom: "2rem",
                fontSize: "1.1rem",
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
                            background: darkMode ? "rgba(0, 255, 136, 0.2)" : "rgba(0, 255, 136, 0.3)",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "50px",
                            color: darkMode ? "#00ff88" : "#006633",
                            fontWeight: "600",
                        }}>
                            <span>📍 {selectedLocation}</span>
                            <button
                                onClick={() => setSelectedLocation(null)}
                                style={{
                                    background: "rgba(255,255,255,0.2)",
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
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "2rem",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 1rem",
                    width: "100%",
                }}>
                    {photosToShow.map((travel) => (
                        <div
                            key={travel.id}
                            onClick={() => setSelectedImage(travel)}
                            style={{
                                background: "#ffffff",
                                padding: "12px 12px 50px 12px",
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
                                    top: "20px",
                                    right: "20px",
                                    background: "rgba(255,255,255,0.9)",
                                    borderRadius: "50%",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}>
                                    ⭐
                                </div>
                            )}
                            {/* Caption on white border */}
                            <div style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "12px",
                                right: "12px",
                                textAlign: "center",
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontWeight: "600", 
                                    fontSize: "0.9rem",
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
                    color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)",
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
                        padding: "2rem",
                    }}
                >
                    <img
                        src={selectedImage.image}
                        alt={selectedImage.location}
                        style={{
                            maxWidth: "90%",
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
                        <h2 style={{ margin: 0 }}>📍 {selectedImage.location}</h2>
                        <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>{selectedImage.date}</p>
                    </div>
                </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                <Footer darkMode={darkMode} />
            </div>
        </div>
    );
};

export default FootprintsPage;
