import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";
import psyduckImg from "../assets/psyduck.png";
import nanoCuratorDemo from "../assets/nano-curator-demo.mp4";

// Project data
const projects = [
    {
        id: 6,
        title: "Nano Curator",
        description: "An AI-powered personal stylist. Upload your photo and get curated outfit makeovers, haircut suggestions, and a sustainable fashion report.",
        tags: ["React", "TypeScript", "Gemini"],
        github: "https://github.com/Agneypraseed/Nano-Curator",
        video: nanoCuratorDemo,
    },
    {
        id: 1,
        title: "Neural Style Transfer",
        description: "Implemented artistic style transfer using CNNs. Combines content from one image with the style of another using VGG19 network and custom loss functions.",
        tags: ["Python", "TensorFlow", "CNN", "Computer Vision"],
        github: "https://github.com/Agneypraseed/DL",
    },
    {
        id: 2,
        title: "RNN & LSTM Language Model",
        description: "Built recurrent neural networks for sequence modeling including character-level language models and LSTM networks for text generation.",
        tags: ["Python", "TensorFlow", "RNN", "LSTM", "NLP"],
        github: "https://github.com/Agneypraseed/DL",
    },
    {
        id: 3,
        title: "Vision Transformer Image Captioning",
        description: "Developed an image captioning model using Vision Transformers (ViT) that generates natural language descriptions for images.",
        tags: ["Python", "PyTorch", "Transformers", "ViT", "NLP"],
        github: "https://github.com/Agneypraseed/Notebooks/blob/main/vision-transformer-image-captioning.ipynb",
    },
    {
        id: 4,
        title: "LangChain Agents with Gemini",
        description: "Built AI agents using LangChain and Crew library integrated with Google's Gemini model for autonomous task execution.",
        tags: ["Python", "LangChain", "Gemini", "AI Agents", "LLM"],
        github: "https://github.com/Agneypraseed/Notebooks/blob/main/LangChain_Agents_with_Crew_Lib_%2B_Gemini.ipynb",
    },
    {
        id: 5,
        title: "Transformer Architecture from Scratch",
        description: "Implemented the Transformer architecture from scratch following the 'Attention is All You Need' paper for NLP tasks.",
        tags: ["Python", "PyTorch", "Transformers", "Attention", "NLP"],
        github: "https://github.com/Agneypraseed/Notebooks/blob/main/transformer.ipynb",
    },
];

import catCursor from "../assets/paw-cursor-32.png";

// Clean video player — click to play/pause, no native controls
const VideoPlayer = ({ src, darkMode }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "0.75rem",
                backgroundColor: darkMode ? "#111" : "#000",
            }}
            onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) { v.play(); setIsPlaying(true); }
                else { v.pause(); setIsPlaying(false); }
            }}
        >
            <video
                ref={videoRef}
                preload="metadata"
                playsInline
                muted
                loop
                onEnded={() => setIsPlaying(false)}
                style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "10px",
                }}
            >
                <source src={src} type="video/mp4" />
            </video>
            {/* Play/Pause overlay */}
            <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isPlaying ? "transparent" : "rgba(0,0,0,0.2)",
                opacity: isPlaying ? 0 : 1,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
            }}>
                <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

const ProjectsPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();
    const prevDarkMode = useRef(darkMode);
    const [showPsyduck, setShowPsyduck] = useState(false);
    const [psyduckPos, setPsyduckPos] = useState({ top: "50%", left: "50%" });

    useEffect(() => {
        // Trigger on transition from Dark (true) to Light (false)
        if (prevDarkMode.current === true && darkMode === false) {
            // Pick a random spot that stays mostly visible on-screen
            const randomTop = Math.floor(Math.random() * 70 + 15) + "%";
            const randomLeft = Math.floor(Math.random() * 70 + 15) + "%";
            setPsyduckPos({ top: randomTop, left: randomLeft });
            
            setShowPsyduck(true);
            setTimeout(() => {
                setShowPsyduck(false);
            }, 2500); // Shows for 2.5 seconds
        }
        prevDarkMode.current = darkMode;
    }, [darkMode]);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                padding: isMobile ? "80px 12px 16px" : "100px 20px 20px",
                cursor: `url(${catCursor}) 16 16, auto`,
                transition: "background-color 0.3s ease",
            }}
        >
            {/* Title */}
            <h1 style={{ 
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0'
            }}>
                Projects
            </h1>
            <span style={{
                display: "inline-block",
                background: darkMode ? "rgba(255, 193, 7, 0.2)" : "rgba(255, 193, 7, 0.15)",
                color: darkMode ? "#ffc107" : "#b8860b",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "4px 12px",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: darkMode ? "1px solid rgba(255, 193, 7, 0.3)" : "1px solid rgba(255, 193, 7, 0.4)",
            }}>
                🚧 Work in Progress
            </span>

            {/* Project Cards Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
                gap: isMobile ? "1rem" : "1.5rem",
                maxWidth: "1100px",
                margin: "0 auto",
                padding: isMobile ? "0" : "0 1rem",
                width: "100%",
            }}>
                {projects.map((project) => (
                    <div
                        key={project.id}
                        style={{
                            background: darkMode ? "rgba(30, 30, 30, 0.7)" : "#ffffff",
                            backdropFilter: darkMode ? "blur(12px)" : "none",
                            WebkitBackdropFilter: darkMode ? "blur(12px)" : "none",
                            borderRadius: "16px",
                            border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e5e7eb",
                            boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)",
                            padding: isMobile ? "1.25rem" : "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = darkMode 
                                ? "0 12px 40px rgba(0, 0, 0, 0.25)" 
                                : "0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.06)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = darkMode 
                                ? "0 8px 32px rgba(0, 0, 0, 0.15)" 
                                : "0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)";
                        }}
                    >
                        {/* Title */}
                        <h3 style={{
                            color: darkMode ? "#ffffff" : "#1a1a1a",
                            margin: "0 0 0.75rem 0",
                            fontSize: isMobile ? "1.1rem" : "1.25rem",
                            fontWeight: "600",
                        }}>
                            {project.title}
                        </h3>

                        {/* Video demo if available */}
                        {project.video && (
                            <VideoPlayer src={project.video} darkMode={darkMode} />
                        )}

                        {/* Course badge if applicable */}
                        {project.course && (
                            <span style={{
                                display: "inline-block",
                                background: darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.1)",
                                color: darkMode ? "#c4b5fd" : "#7c3aed",
                                fontSize: "0.7rem",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                marginBottom: "0.75rem",
                                alignSelf: "flex-start",
                            }}>
                                📜 {project.course}
                            </span>
                        )}

                        {/* Description */}
                        <p style={{
                            color: darkMode ? "rgba(255, 255, 255, 0.7)" : "#4b5563",
                            fontSize: isMobile ? "0.85rem" : "0.9rem",
                            lineHeight: "1.5",
                            margin: "0 0 1rem 0",
                            flex: "1",
                        }}>
                            {project.description}
                        </p>

                        {/* Tags */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                        }}>
                            {project.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#f3f4f6",
                                        color: darkMode ? "rgba(255, 255, 255, 0.8)" : "#374151",
                                        fontSize: "0.75rem",
                                        padding: "4px 10px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* GitHub Button */}
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#1a1a1a",
                                color: "#ffffff",
                                textDecoration: "none",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = darkMode ? "rgba(255, 255, 255, 0.2)" : "#333";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = darkMode ? "rgba(255, 255, 255, 0.1)" : "#1a1a1a";
                            }}
                        >
                            <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                            View on GitHub
                        </a>
                    </div>
                ))}
            </div>

            {/* Psyduck Easter Egg Animation */}
            <div style={{
                position: "fixed",
                top: psyduckPos.top,
                left: psyduckPos.left,
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                pointerEvents: "none",
                opacity: showPsyduck ? 1 : 0,
                visibility: showPsyduck ? "visible" : "hidden",
                transition: "opacity 0.4s ease-in-out, visibility 0.4s",
                // A small rounded box like a sticker popping up
                backgroundColor: "#dbe8d6", // Match the pale gameboy green background
                padding: "8px",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                width: isMobile ? "140px" : "220px",
            }}>
                <img 
                    src={psyduckImg} 
                    alt="Psyduck" 
                    style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        objectFit: "contain",
                        transform: showPsyduck ? "rotate(3deg) scale(1)" : "rotate(-10deg) scale(0.8)",
                        transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    }}
                />
            </div>

            <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                <Footer darkMode={darkMode} isHomePage={false} />
            </div>
        </div>
    );
};

export default ProjectsPage;
