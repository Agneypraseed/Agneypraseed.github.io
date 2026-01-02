import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

const TravelGlobe = ({ darkMode, locations = [], onLocationClick, selectedLocation }) => {
    const globeRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

    useEffect(() => {
        // Start focused on Western Europe (more zoomed in)
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
            globeRef.current.pointOfView({ lat: 50, lng: 10, altitude: 0.8 }, 0);
        }
    }, []);

    // Handle responsive sizing - make globe bigger
    useEffect(() => {
        const handleResize = () => {
            const size = Math.min(window.innerWidth * 0.85, 550);
            setDimensions({ width: size, height: size });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Get unique locations for markers
    const uniqueLocations = locations.reduce((acc, curr) => {
        if (!acc.find(l => l.location === curr.location)) {
            acc.push(curr);
        }
        return acc;
    }, []);

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center",
            marginBottom: "2rem",
        }}>
            <Globe
                ref={globeRef}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl={darkMode 
                    ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
                    : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                }
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor={darkMode ? "#4a9eff" : "#66d4cf"}
                atmosphereAltitude={0.15}
                pointsData={uniqueLocations}
                pointLat="lat"
                pointLng="lng"
                pointColor={(d) => selectedLocation === d.location ? "#00ff88" : "#ff6b6b"}
                pointRadius={(d) => selectedLocation === d.location ? 0.8 : 0.5}
                pointAltitude={0.01}
                pointLabel={(d) => `<div style="color: white; background: rgba(0,0,0,0.8); padding: 8px 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">📍 ${d.location}<br/><small style="opacity: 0.7;">Click to view photos</small></div>`}
                onPointClick={(point) => {
                    if (onLocationClick) {
                        onLocationClick(point.location);
                    }
                    // Zoom to clicked point (keep zoomed in)
                    if (globeRef.current) {
                        globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 0.6 }, 1000);
                    }
                }}
            />
        </div>
    );
};

export default TravelGlobe;
