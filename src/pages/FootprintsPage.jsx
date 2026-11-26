import { lazy, Suspense, useState } from "react";
import Footer from "../components/Footer";
import GlobePlaceReadout from "../components/GlobePlaceReadout";
import PhotoStrip from "../components/PhotoStrip";
import travels, { globeLocations, routeStartByCountry } from "../data/travels";
import useIsMobile from "../hooks/useIsMobile";
import "./FootprintsPage.css";

const TravelGlobe = lazy(() => import("../components/TravelGlobe"));
const RouteGlobe = lazy(() => import("../components/RouteGlobe"));

const FootprintsPage = ({ darkMode }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [globeMode, setGlobeMode] = useState("Routes");
    const { isMobile } = useIsMobile();

    // Show favorites by default, or all photos for a selected city
    const photosToShow = selectedLocation
        ? travels.filter(t => t.location === selectedLocation)
        : travels.filter(t => t.isFavorite);
    const handleLocationClick = (location) => {
        setSelectedLocation((current) => current === location ? null : location);
    };
    const clearLocation = () => setSelectedLocation(null);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                padding: isMobile ? "80px 12px 16px" : "100px 20px 20px",
                backgroundColor: darkMode ? "#1a1a1a" : "#F5F0E8",
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

            <div className="footprints-map-controls" data-theme={darkMode ? "dark" : "light"}>
                <div className="footprints-map-switch" role="group" aria-label="Globe mode">
                    {["Satellite", "Routes"].map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            aria-pressed={globeMode === mode}
                            onClick={() => setGlobeMode(mode)}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <Suspense fallback={<p className="footprints-route-status" role="status">Loading globe…</p>}>
                {globeMode === "Satellite" ? (
                    <div className="footprints-satellite-map">
                        <TravelGlobe
                            darkMode={darkMode}
                            locations={globeLocations}
                            onLocationClick={handleLocationClick}
                            selectedLocation={selectedLocation}
                        />
                        {selectedLocation && (
                            <GlobePlaceReadout darkMode={darkMode} location={selectedLocation} onClear={clearLocation} />
                        )}
                    </div>
                ) : (
                    <RouteGlobe
                        darkMode={darkMode}
                        locations={globeLocations}
                        routeStartByCountry={routeStartByCountry}
                        onLocationClick={handleLocationClick}
                        onClearLocation={clearLocation}
                        selectedLocation={selectedLocation}
                    />
                )}
            </Suspense>

            {/* Photo Strip */}
            {photosToShow.length > 0 && (
                <PhotoStrip
                    photos={photosToShow}
                    onPhotoClick={setSelectedImage}
                />
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
