import { useState, useEffect, useRef } from "react";

/**
 * SceneCardFan
 *
 * Props:
 *   scenes      – array of { id, image, label? }
 *   darkMode    – boolean
 *   isMobile    – boolean
 *   onCardClick – (scene) => void   (optional)
 *   cardWidth   – number (px) override
 *   cardHeight  – number (px) override
 */

/* ─── CSS injected once ─── */
const STYLE_ID = "scene-card-fan-styles";
const injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        @keyframes sceneCardFloat {
            0%   { transform: var(--fan-base-transform) translateY(0px); }
            50%  { transform: var(--fan-base-transform) translateY(-6px); }
            100% { transform: var(--fan-base-transform) translateY(0px); }
        }

        @keyframes sceneCardEnter {
            0%   { opacity: 0; transform: var(--fan-entry-from); }
            100% { opacity: 1; transform: var(--fan-base-transform); }
        }

        .scene-card-fan-item {
            animation:
                sceneCardEnter var(--enter-dur, 0.55s) cubic-bezier(0.34, 1.56, 0.64, 1) var(--enter-delay, 0s) both,
                sceneCardFloat  var(--float-dur, 4s)   ease-in-out       var(--float-delay, 0s) infinite;
        }

        .scene-card-fan-item:hover {
            animation: none !important;
            z-index: 50 !important;
        }

        /* Side-by-side (≤2) variants */
        @keyframes sceneCardEnterUp {
            0%   { opacity: 0; transform: translateY(30px) scale(0.92); }
            100% { opacity: 1; transform: translateY(0)    scale(1); }
        }

        @keyframes sceneCardFloatUp {
            0%   { transform: translateY(0px); }
            50%  { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
        }

        .scene-card-side {
            animation:
                sceneCardEnterUp var(--enter-dur, 0.55s) cubic-bezier(0.34, 1.56, 0.64, 1) var(--enter-delay, 0s) both,
                sceneCardFloatUp  var(--float-dur, 4s)   ease-in-out var(--float-delay, 0s) infinite;
        }

        .scene-card-side:hover {
            animation: none !important;
            transform: translateY(-12px) scale(1.05) !important;
        }
    `;
    document.head.appendChild(style);
};

/* ─── Fan math ─── */
const getFanTransform = (index, total, isMobile) => {
    const mid = (total - 1) / 2;
    const offset = index - mid;
    const rotate = offset * 8;
    const translateX = offset * (isMobile ? 38 : 65);
    // Inverted parabola: centre rises most
    const translateY = -(Math.pow(total - 1, 2) - Math.pow(offset, 2)) * (isMobile ? 4 : 6);
    const zIndex = total - Math.abs(Math.round(offset));
    return { rotate, translateX, translateY, zIndex };
};

/* ─── Clamp scale for tiny screens ─── */
const useContainerScale = (ref, baseWidth) => {
    const [scale, setScale] = useState(1);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new ResizeObserver(([entry]) => {
            const available = entry.contentRect.width;
            setScale(Math.min(1, available / baseWidth));
        });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, baseWidth]);
    return scale;
};

/* ═══════════════════════════════════════════════════════════════ */
const SceneCardFan = ({
    scenes = [],
    darkMode = false,
    isMobile = false,
    onCardClick,
    cardWidth,
    cardHeight,
}) => {
    const containerRef = useRef(null);

    // Default sizes
    const cw = cardWidth  ?? (isMobile ? 130 : 200);
    const ch = cardHeight ?? (isMobile ? 185 : 285);

    // How wide the fan fans out
    const totalFanWidth = scenes.length > 2
        ? cw + Math.abs((scenes.length - 1) / 2) * (isMobile ? 38 : 65) * 2
        : cw * scenes.length + 20 * (scenes.length - 1);

    const scale = useContainerScale(containerRef, totalFanWidth + 60);

    useEffect(() => { injectStyles(); }, []);

    if (scenes.length === 0) return null;

    /* ── Container heights ── */
    const fanAreaHeight = scenes.length <= 2
        ? ch + 20
        : ch + (isMobile ? 60 : 100);

    /* ── Shared card styles ── */
    const baseCard = {
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: darkMode
            ? "0 10px 30px rgba(0,0,0,0.55)"
            : "0 10px 30px rgba(0,0,0,0.18)",
        border: darkMode
            ? "1px solid rgba(255,255,255,0.10)"
            : "2px solid rgba(255,255,255,0.9)",
        cursor: onCardClick ? "pointer" : "default",
        background: darkMode ? "#222" : "#eee",
        transition: "box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        willChange: "transform",
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                overflow: "visible",
            }}
        >
            <div
                style={{
                    position: "relative",
                    height: `${fanAreaHeight}px`,
                    width: `${totalFanWidth}px`,
                    maxWidth: "100%",
                    transform: `scale(${scale})`,
                    transformOrigin: "bottom center",
                }}
            >
                {scenes.length <= 2 ? (
                    /* ── Side-by-side (1 or 2 cards) ── */
                    <div
                        style={{
                            display: "flex",
                            gap: isMobile ? "12px" : "20px",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            height: "100%",
                        }}
                    >
                        {scenes.map((scene, i) => {
                            const floatPhase = i * 0.8; // offset phase per card
                            return (
                                <div
                                    key={scene.id}
                                    className="scene-card-side"
                                    onClick={() => onCardClick?.(scene)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = darkMode
                                            ? "0 20px 50px rgba(0,0,0,0.75)"
                                            : "0 20px 50px rgba(0,0,0,0.28)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = darkMode
                                            ? "0 10px 30px rgba(0,0,0,0.55)"
                                            : "0 10px 30px rgba(0,0,0,0.18)";
                                    }}
                                    style={{
                                        ...baseCard,
                                        width: `${cw}px`,
                                        height: `${ch}px`,
                                        flexShrink: 0,
                                        "--enter-delay": `${i * 0.12}s`,
                                        "--enter-dur": "0.6s",
                                        "--float-dur": `${3.8 + i * 0.4}s`,
                                        "--float-delay": `${floatPhase}s`,
                                    }}
                                >
                                    {scene.image && (
                                        <img
                                            src={scene.image}
                                            alt={scene.label ?? ""}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Fan layout (3+ cards) ── */
                    scenes.map((scene, i) => {
                        const { rotate, translateX, translateY, zIndex } =
                            getFanTransform(i, scenes.length, isMobile);

                        // CSS custom property strings
                        const baseTransform = `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${rotate}deg)`;
                        const entryFrom    = `translateX(calc(-50% + ${translateX}px)) translateY(${translateY + 40}px) rotate(${rotate * 1.4}deg) scale(0.88)`;

                        return (
                            <div
                                key={scene.id}
                                className="scene-card-fan-item"
                                onClick={() => onCardClick?.(scene)}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget;
                                    el.style.transform = `${baseTransform} translateY(-16px) scale(1.06)`;
                                    el.style.zIndex = "50";
                                    el.style.boxShadow = darkMode
                                        ? "0 24px 48px rgba(0,0,0,0.75)"
                                        : "0 24px 48px rgba(0,0,0,0.28)";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget;
                                    el.style.transform = "";    // let animation reclaim
                                    el.style.zIndex = zIndex;
                                    el.style.boxShadow = darkMode
                                        ? "0 10px 30px rgba(0,0,0,0.55)"
                                        : "0 10px 30px rgba(0,0,0,0.18)";
                                }}
                                style={{
                                    ...baseCard,
                                    position: "absolute",
                                    left: "50%",
                                    bottom: "0",
                                    width: `${cw}px`,
                                    height: `${ch}px`,
                                    transformOrigin: "bottom center",
                                    zIndex,

                                    // CSS custom props consumed by the keyframes
                                    "--fan-base-transform": baseTransform,
                                    "--fan-entry-from":     entryFrom,
                                    "--enter-delay": `${i * 0.1}s`,
                                    "--enter-dur":   "0.65s",
                                    "--float-dur":   `${4 + i * 0.35}s`,
                                    "--float-delay": `${i * 0.6}s`,
                                }}
                            >
                                {scene.image && (
                                    <img
                                        src={scene.image}
                                        alt={scene.label ?? ""}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            pointerEvents: "none",
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SceneCardFan;
