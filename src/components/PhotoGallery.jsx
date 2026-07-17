import { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import useIsMobile from "../hooks/useIsMobile";

const PLACEHOLDER_GRADIENT = (darkMode, isGhibli) =>
    isGhibli
        ? `linear-gradient(135deg, ${darkMode ? "#1a2e1a, #2a3d2a" : "#d4eed4, #e8f5e8"})`
        : `linear-gradient(135deg, ${darkMode ? "#2d2040, #1a2438" : "#e8dff0, #d4e4f7"})`;

const PhotoGallery = ({ darkMode, photos = [], sakuraActive, onSakuraToggle }) => {
    const { isMobile } = useIsMobile();
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const textPath1Ref = useRef(null);
    const textPath2Ref = useRef(null);

    // textLength must match exact path length so both copies tile with zero overlap/gaps
    useEffect(() => {
        const path = document.getElementById('rect-text-path');
        if (!path) return;
        const len = path.getTotalLength();
        [textPath1Ref, textPath2Ref].forEach(r => r.current?.setAttribute('textLength', len));
    }, []);

    // Default to 2 placeholder slots
    const items = photos.length > 0
        ? photos
        : [
            { src: null, alt: "Portrait", label: "Portrait" },
            { src: null, alt: "Ghibli Style", label: "Ghibli" },
        ];

    const currentItem = items[activeIndex];

    const closeLightbox = () => setLightboxOpen(false);
    const openLightbox = () => setLightboxOpen(true);

    const goNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [lightboxOpen, goNext, goPrev]);

    // Shared colors
    const cardBg = darkMode
        ? "rgba(30, 30, 30, 0.5)"
        : "rgba(255, 255, 255, 0.6)";
    const cardBorder = darkMode
        ? "1px solid rgba(255, 255, 255, 0.08)"
        : "1px solid rgba(0, 0, 0, 0.06)";
    const pillActiveBg = darkMode
        ? "rgba(139, 92, 246, 0.3)"
        : "rgba(99, 102, 241, 0.12)";
    const pillActiveColor = darkMode ? "#c4b5fd" : "#6366f1";
    const pillInactiveBg = "transparent";
    const pillInactiveColor = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
    const subtitleColor = darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";

    return (
        <>
            {/* Photo frame wrapper with spinning text */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}>
                {/* Outer container that holds photo + spinning ring */}
                <div style={{
                    position: "relative",
                    width: "100%",
                    /* The ring needs breathing room around the photo */
                    padding: isMobile ? "18px" : "16px",
                }}>
                    {/* Scrolling name text around the border */}
                    {(() => {
                        const nameText = "AGNEY PRASEED • ".repeat(12);
                        const textStyle = {
                            fontSize: "15px",
                            fontWeight: 800,
                            letterSpacing: "0.15em",
                            fill: darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.3)",
                        };
                        return (
                            <svg
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}
                                viewBox="0 0 408 528"
                            >
                                <defs>
                                    <path id="rect-text-path" d="M 204,13 L 369,13 Q 394,13 394,38 L 394,490 Q 394,515 369,515 L 39,515 Q 14,515 14,490 L 14,38 Q 14,13 39,13 Z" />
                                    <mask id="border-mask-rect">
                                        <rect width="408" height="528" fill="black" />
                                        <rect x="2" y="2" width="404" height="524" rx="30" fill="white" />
                                        <rect x="24" y="24" width="360" height="480" rx="20" fill="black" />
                                    </mask>
                                </defs>
                                <g mask="url(#border-mask-rect)">
                                    {/* Two copies needed: SVG clips text at path end, so when copy 1 scrolls
                                        forward leaving a gap at the start, copy 2 fills it. textLength (set via JS)
                                        ensures they tile perfectly with zero overlap. */}
                                    <text style={textStyle}>
                                        <textPath ref={textPath1Ref} href="#rect-text-path" lengthAdjust="spacing">
                                            {nameText}
                                            <animate attributeName="startOffset" from="0%" to="100%" dur="25s" repeatCount="indefinite" />
                                        </textPath>
                                    </text>
                                    <text style={textStyle}>
                                        <textPath ref={textPath2Ref} href="#rect-text-path" lengthAdjust="spacing">
                                            {nameText}
                                            <animate attributeName="startOffset" from="-100%" to="0%" dur="25s" repeatCount="indefinite" />
                                        </textPath>
                                    </text>
                                </g>
                            </svg>
                        );
                    })()}


                {/* Photo frame */}
                <div
                    onClick={openLightbox}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                        width: "100%",
                        aspectRatio: "3 / 4",
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        background: currentItem.src
                            ? "transparent"
                            : PLACEHOLDER_GRADIENT(darkMode, activeIndex === 1),
                        border: cardBorder,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: darkMode
                            ? isHovering
                                ? "0 16px 48px rgba(0, 0, 0, 0.4)"
                                : "0 8px 32px rgba(0, 0, 0, 0.25)"
                            : isHovering
                                ? "0 12px 40px rgba(0, 0, 0, 0.12)"
                                : "0 4px 20px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        transform: isHovering ? "translateY(-3px)" : "translateY(0)",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {currentItem.src ? (
                        <img
                            src={currentItem.src}
                            alt={currentItem.alt || "Photo"}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.4s ease",
                                transform: isHovering ? "scale(1.03)" : "scale(1)",
                            }}
                        />
                    ) : (
                        /* Placeholder */
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.75rem",
                        }}>
                            <svg
                                width={isMobile ? "36" : "44"}
                                height={isMobile ? "36" : "44"}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span style={{
                                fontSize: "0.8rem",
                                color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
                                fontWeight: "500",
                            }}>
                                {currentItem.label || currentItem.alt}
                            </span>
                        </div>
                    )}


                    
                    {/* Sakura button (Top Left) */}
                    {onSakuraToggle && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onSakuraToggle(); }}
                            style={{
                                position: "absolute",
                                left: "12px",
                                top: "12px",
                                background: sakuraActive
                                    ? "rgba(255, 183, 197, 0.45)"
                                    : "rgba(0, 0, 0, 0.45)",
                                border: sakuraActive 
                                    ? "1px solid rgba(255, 183, 197, 0.5)" 
                                    : "1px solid rgba(255, 255, 255, 0.2)",
                                color: sakuraActive ? "#fff" : "#FFB7C5",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                fontSize: "1.1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                zIndex: 10,
                                transition: "all 0.2s ease",
                                boxShadow: sakuraActive ? "0 0 12px rgba(255, 183, 197, 0.4)" : "0 4px 12px rgba(0,0,0,0.3)",
                            }}
                            aria-label="Toggle Sakura Effect"
                            title="Toggle Sakura Effect"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.background = sakuraActive 
                                    ? "rgba(255, 183, 197, 0.6)" 
                                    : "rgba(0, 0, 0, 0.65)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.background = sakuraActive
                                    ? "rgba(255, 183, 197, 0.45)"
                                    : "rgba(0, 0, 0, 0.45)";
                            }}
                        >
                            🌸
                        </button>
                    )}

                    {/* Swap button */}
                    {items.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            aria-label="Swap photo"
                            title="Swap photo"
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "12px",
                                background: "rgba(0, 0, 0, 0.45)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#fff",
                                zIndex: 10,
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1) rotate(180deg)";
                                e.currentTarget.style.background = "rgba(0, 0, 0, 0.65)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                                e.currentTarget.style.background = "rgba(0, 0, 0, 0.45)";
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="17 1 21 5 17 9" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <polyline points="7 23 3 19 7 15" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                        </button>
                    )}
                </div>
                </div>


            </div>

            {/* ── Lightbox overlay ── */}
            {lightboxOpen && ReactDOM.createPortal(
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 10000,
                        background: "rgba(0, 0, 0, 0.88)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: isMobile ? "4rem 1rem 2rem 1rem" : "3rem 2rem 2rem 2rem",
                        boxSizing: "border-box",
                        animation: "fadeInLightbox 0.3s ease forwards",
                    }}
                    onClick={closeLightbox}
                >
                    <style>{`
                        @keyframes fadeInLightbox {
                            from { opacity: 0; }
                            to   { opacity: 1; }
                        }
                    `}</style>

                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        aria-label="Close"
                        style={{
                            position: "absolute",
                            top: isMobile ? "16px" : "28px",
                            right: isMobile ? "16px" : "28px",
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#fff",
                            transition: "all 0.2s ease",
                            zIndex: 10001,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Image area - Strictly bounded flex container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            flex: 1,
                            width: "100%",
                            maxHeight: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            minHeight: 0,
                            minWidth: 0,
                            padding: isMobile ? "0 3rem" : "0 5rem", /* Give space for the arrows */
                            boxSizing: "border-box",
                        }}
                    >
                        {currentItem.src ? (
                            <img
                                src={currentItem.src}
                                alt={currentItem.alt || "Photo"}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    width: "auto",
                                    height: "auto",
                                    objectFit: "contain",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6)",
                                    display: "block",
                                }}
                            />
                        ) : (
                            <div style={{
                                width: isMobile ? "280px" : "380px",
                                height: isMobile ? "370px" : "500px",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: "16px",
                                background: PLACEHOLDER_GRADIENT(true, activeIndex === 1),
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1rem",
                                boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6)",
                            }}>
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", fontWeight: "500" }}>
                                    {currentItem.label || "Photo"}
                                </span>
                            </div>
                        )}

                        {/* Navigation arrows - pinned to the sides of the strictly bounded flex container */}
                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                    aria-label="Previous"
                                    style={{
                                        position: "absolute",
                                        left: isMobile ? "8px" : "24px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "rgba(0, 0, 0, 0.35)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        borderRadius: "50%",
                                        width: isMobile ? "40px" : "56px",
                                        height: isMobile ? "40px" : "56px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: "#fff",
                                        transition: "all 0.2s ease",
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        zIndex: 10,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.55)";
                                        e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.35)";
                                        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                                    aria-label="Next"
                                    style={{
                                        position: "absolute",
                                        right: isMobile ? "8px" : "24px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "rgba(0, 0, 0, 0.35)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        borderRadius: "50%",
                                        width: isMobile ? "40px" : "56px",
                                        height: isMobile ? "40px" : "56px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: "#fff",
                                        transition: "all 0.2s ease",
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        zIndex: 10,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.55)";
                                        e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.35)";
                                        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            , document.body)}
        </>
    );
};

export default PhotoGallery;
