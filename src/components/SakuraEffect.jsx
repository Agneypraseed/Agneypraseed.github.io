import { useState, useEffect, memo } from "react";

// Generate a single petal's random properties
const createPetal = (id) => ({
    id,
    left: Math.random() * 100,                    // % from left
    delay: Math.random() * 10,                     // stagger start over 10 seconds
    duration: 6 + Math.random() * 8,               // 6–14 seconds fall time
    size: 6 + Math.random() * 10,                  // 6–16px (varied sizes)
    rotation: Math.random() * 360,                 // initial rotation
    drift: -80 + Math.random() * 160,              // horizontal drift in px
    opacity: 0.4 + Math.random() * 0.6,            // 0.4–1.0
    variant: Math.floor(Math.random() * 3),        // 0, 1, or 2 shape variant
    blur: Math.random() > 0.6 ? Math.random() * 3 : 0, // Depth of field blur
});

// SVG petal shapes — different orientations for variety
const PetalSVG = memo(({ size, variant, opacity, blur }) => {
    const colors = [
        { fill: "#FFB7C5", stroke: "#F48FB1" },   // classic pink
        { fill: "#FCC2D0", stroke: "#F8A4BB" },   // lighter pink
        { fill: "#FDDDE6", stroke: "#F8BBD0" },   // pale pink / white
    ];
    const { fill, stroke } = colors[variant] || colors[0];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : 'none'
            }}
        >
            {/* Petal shape */}
            <ellipse
                cx="12"
                cy="10"
                rx="5.5"
                ry="9"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.8"
                transform="rotate(15 12 12)"
            />
            {/* Highlight */}
            <ellipse
                cx="11"
                cy="8"
                rx="2"
                ry="4.5"
                fill="rgba(255,255,255,0.4)"
                transform="rotate(15 12 12)"
            />
        </svg>
    );
});

// Add display name for debugging
PetalSVG.displayName = "PetalSVG";

const SakuraEffect = ({ active }) => {
    const [petals, setPetals] = useState([]);

    useEffect(() => {
        if (!active) {
            setPetals([]);
            return;
        }

        // Create 60 petals for a continuous dense effect
        setPetals(Array.from({ length: 60 }, (_, i) => createPetal(i)));
    }, [active]);

    if (!active || petals.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 9999,
                overflow: "hidden",
            }}
        >
            <style>{`
                @keyframes sakuraFallInfinite {
                    0% {
                        transform: translate3d(0, -10vh, 0) rotate(var(--start-rot));
                        opacity: 0;
                    }
                    10% {
                        opacity: var(--petal-opacity);
                    }
                    80% {
                        opacity: var(--petal-opacity);
                    }
                    100% {
                        transform: translate3d(var(--drift), 110vh, 0) rotate(calc(var(--start-rot) + 360deg));
                        opacity: 0;
                    }
                }
                @keyframes sakuraSwayInfinite {
                    0%, 100% { transform: translateX(0px); }
                    33% { transform: translateX(15px); }
                    66% { transform: translateX(-15px); }
                }
            `}</style>

            {petals.map((petal) => (
                <div
                    key={petal.id}
                    style={{
                        position: "absolute",
                        left: `${petal.left}%`,
                        top: "-5vh",
                        "--start-rot": `${petal.rotation}deg`,
                        "--drift": `${petal.drift}px`,
                        "--petal-opacity": petal.opacity,
                        animation: `sakuraFallInfinite ${petal.duration}s ${petal.delay}s linear infinite`,
                        opacity: 0,
                    }}
                >
                    <div
                        style={{
                            animation: `sakuraSwayInfinite ${2 + Math.random() * 3}s ${petal.delay}s ease-in-out infinite`,
                        }}
                    >
                        <PetalSVG
                            size={petal.size}
                            variant={petal.variant}
                            opacity={petal.opacity}
                            blur={petal.blur}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SakuraEffect;
