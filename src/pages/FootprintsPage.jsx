import { useState } from "react";
import Footer from "../components/Footer";
import TravelGlobe from "../components/TravelGlobe";
import PhotoStrip from "../components/PhotoStrip";
import travels from "../data/travels";
import useIsMobile from "../hooks/useIsMobile";

const FootprintsPage = ({ darkMode }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const { isMobile } = useIsMobile();

    // Show favorites by default, or all photos for a selected city
    const photosToShow = selectedLocation
        ? travels.filter(t => t.location === selectedLocation)
        : travels.filter(t => t.isFavorite);

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

            {/* Photo Strip */}
            <PhotoStrip
                photos={photosToShow}
                onPhotoClick={setSelectedImage}
                darkMode={darkMode}
            />

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
