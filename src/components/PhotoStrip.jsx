import { useRef, useEffect, useCallback, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

// Generate a stable pseudo-random rotation from an id
// ~40% of cards are straight, rest get varied tilts
const getRotation = (id) => {
    const seed = ((id * 9301 + 49297) % 233280) / 233280;
    // Some cards stay straight for natural variety
    if (seed < 0.4) return 0;
    // Others get tilts between -4 and +4 degrees
    const tiltSeed = ((id * 7621 + 31547) % 233280) / 233280;
    return (tiltSeed - 0.5) * 8;
};

const PhotoStrip = ({ photos, onPhotoClick, darkMode }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const { isMobile } = useIsMobile();

    // Drag state refs (not React state to avoid re-renders during drag)
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const animationFrame = useRef(null);
    const hasDragged = useRef(false);

    const cardWidth = isMobile ? 220 : 400;
    const cardGap = isMobile ? 20 : 32;
    const cardPadding = isMobile ? 8 : 14;
    const cardBottomPadding = isMobile ? 40 : 55;

    // Triple the photos for infinite illusion
    const tripled = [...photos, ...photos, ...photos];
    const singleSetWidth = photos.length * (cardWidth + cardGap);

    // Center on the middle set on mount and when photos change
    useEffect(() => {
        scrollLeft.current = -singleSetWidth;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${scrollLeft.current}px)`;
        }
    }, [singleSetWidth, photos]);

    // Recenter when scrolled too far (infinite loop)
    const recenter = useCallback(() => {
        if (scrollLeft.current > 0) {
            scrollLeft.current -= singleSetWidth;
        } else if (scrollLeft.current < -singleSetWidth * 2) {
            scrollLeft.current += singleSetWidth;
        }
    }, [singleSetWidth]);

    const updateTransform = useCallback(() => {
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${scrollLeft.current}px)`;
        }
    }, []);

    // Inertia animation
    const animateInertia = useCallback(() => {
        if (Math.abs(velocity.current) < 0.5) {
            velocity.current = 0;
            return;
        }
        scrollLeft.current += velocity.current;
        velocity.current *= 0.95; // friction
        recenter();
        updateTransform();
        animationFrame.current = requestAnimationFrame(animateInertia);
    }, [recenter, updateTransform]);

    // Pointer handlers
    const onPointerDown = useCallback((e) => {
        isDragging.current = true;
        hasDragged.current = false;
        startX.current = e.clientX;
        lastX.current = e.clientX;
        lastTime.current = Date.now();
        velocity.current = 0;
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        if (containerRef.current) {
            containerRef.current.style.cursor = "grabbing";
        }
        e.currentTarget.setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastX.current;
        const now = Date.now();
        const dt = now - lastTime.current;

        if (Math.abs(e.clientX - startX.current) > 5) {
            hasDragged.current = true;
        }

        if (dt > 0) {
            velocity.current = dx;
        }
        lastX.current = e.clientX;
        lastTime.current = now;
        scrollLeft.current += dx;
        recenter();
        updateTransform();
    }, [recenter, updateTransform]);

    const onPointerUp = useCallback(() => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (containerRef.current) {
            containerRef.current.style.cursor = "grab";
        }
        // Start inertia
        animationFrame.current = requestAnimationFrame(animateInertia);
    }, [animateInertia]);

    // Also support mouse wheel horizontal scroll
    const onWheel = useCallback((e) => {
        // Use deltaX for horizontal wheel, or deltaY if shift held
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        scrollLeft.current -= delta;
        recenter();
        updateTransform();
        e.preventDefault();
    }, [recenter, updateTransform]);

    // Attach wheel listener with passive: false
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [onWheel]);

    // Cleanup animation on unmount
    useEffect(() => {
        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, []);

    if (photos.length === 0) {
        return (
            <div style={{
                textAlign: "center",
                padding: "3rem",
                color: darkMode ? "rgba(255,255,255,0.6)" : "#9ca3af",
            }}>
                <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>🌍</p>
                <p style={{ fontSize: "1.1rem" }}>
                    No photos to show. Prefix files with <code>fav_</code> to feature them!
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
                overflow: "hidden",
                cursor: "grab",
                padding: isMobile ? "1rem 0" : "2rem 0",
                userSelect: "none",
                touchAction: "pan-y",
                width: "100%",
            }}
        >
            <div
                ref={trackRef}
                style={{
                    display: "flex",
                    gap: `${cardGap}px`,
                    willChange: "transform",
                    transition: isDragging.current ? "none" : undefined,
                }}
            >
                {tripled.map((travel, i) => {
                    const rotation = getRotation(travel.id + i);
                    return (
                        <div
                            key={`${travel.id}-${i}`}
                            onClick={() => {
                                if (!hasDragged.current) {
                                    onPhotoClick(travel);
                                }
                            }}
                            style={{
                                flex: `0 0 ${cardWidth}px`,
                                background: "#ffffff",
                                padding: `${cardPadding}px ${cardPadding}px ${cardBottomPadding}px ${cardPadding}px`,
                                borderRadius: "4px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 40px rgba(0, 0, 0, 0.1)",
                                transform: `rotate(${rotation}deg)`,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                position: "relative",
                                pointerEvents: "auto",
                            }}
                            onMouseEnter={(e) => {
                                if (!isDragging.current) {
                                    e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1.05)`;
                                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.25), 0 12px 50px rgba(0, 0, 0, 0.15)";
                                    e.currentTarget.style.zIndex = "10";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 40px rgba(0, 0, 0, 0.1)";
                                e.currentTarget.style.zIndex = "1";
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
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>
                            {/* Caption */}
                            <div style={{
                                position: "absolute",
                                bottom: isMobile ? "4px" : "10px",
                                left: `${cardPadding}px`,
                                right: `${cardPadding}px`,
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
                    );
                })}
            </div>
        </div>
    );
};

export default PhotoStrip;
