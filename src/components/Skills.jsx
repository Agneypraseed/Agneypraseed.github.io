import { useState } from "react";
import Skill from "./Skill";
import SkillsGraph, { CATEGORIES } from "./SkillsGraph";
import useIsMobile from "../hooks/useIsMobile";
import python from "../assets/skills/python.png";
import java from "../assets/skills/java.jpg";
import js from "../assets/skills/javascript.png";
import cpp from "../assets/skills/c++.png";
import bash from "../assets/skills/bash.png";
import docker from "../assets/skills/docker.png";
import git from "../assets/skills/git.png";
import mongodb from "../assets/skills/mongodb.jpeg";
import nodejs from "../assets/skills/nodejs.png";
import opencv from "../assets/skills/opencv.png";
import pytorch from "../assets/skills/pytorch.png";
import springboot from "../assets/skills/springboot.svg";

const Skills = ({ darkMode }) => {
    const [viewMode, setViewMode] = useState("cards"); // "cards" | "graph"
    const { isMobile } = useIsMobile();

    return (
        <div
            style={{
                padding: isMobile ? "1.5rem" : "2rem",
                margin: "2rem",
                backgroundColor: darkMode
                    ? "rgba(30, 30, 30, 0.6)"
                    : "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: darkMode
                    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                    : "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                width: isMobile ? "calc(100% - 2rem)" : "auto",
                maxWidth: "1000px",
            }}
        >
            {/* ── Header row: title + view toggle ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                }}
            >
                <h2
                    style={{
                        color: darkMode ? "#ffffff" : "#333333",
                        transition: "color 0.3s ease",
                        margin: 0,
                        fontSize: isMobile ? "1.3rem" : "1.5rem",
                    }}
                >
                    Skills
                </h2>

                {/* Toggle button */}
                <button
                    onClick={() =>
                        setViewMode((v) => (v === "cards" ? "graph" : "cards"))
                    }
                    aria-label={`Switch to ${viewMode === "cards" ? "graph" : "card"} view`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: darkMode
                            ? "1px solid rgba(255,255,255,0.15)"
                            : "1px solid rgba(0,0,0,0.12)",
                        background: darkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                        color: darkMode
                            ? "rgba(255,255,255,0.75)"
                            : "rgba(0,0,0,0.6)",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        fontFamily: "Inter, system-ui, sans-serif",
                        letterSpacing: "0.02em",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = darkMode
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = darkMode
                            ? "rgba(255,255,255,0.25)"
                            : "rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)";
                        e.currentTarget.style.borderColor = darkMode
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(0,0,0,0.12)";
                    }}
                >
                    {viewMode === "cards" ? (
                        /* Graph icon */
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="5" r="3" />
                            <circle cx="5" cy="19" r="3" />
                            <circle cx="19" cy="19" r="3" />
                            <line x1="12" y1="8" x2="5" y2="16" />
                            <line x1="12" y1="8" x2="19" y2="16" />
                        </svg>
                    ) : (
                        /* Grid icon */
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                        </svg>
                    )}
                    {viewMode === "cards" ? "Graph View" : "Card View"}
                </button>
            </div>

            {/* ── Content: Cards or Graph ── */}
            {viewMode === "cards" ? (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "0.5rem",
                    }}
                >
                    <Skill logo={java} title="Java" darkMode={darkMode} />
                    <Skill logo={python} title="Python" darkMode={darkMode} />
                    <Skill logo={pytorch} title="PyTorch" darkMode={darkMode} />
                    <Skill logo={springboot} title="Spring Boot" darkMode={darkMode} />
                    <Skill logo={js} title="JavaScript" darkMode={darkMode} />
                    <Skill logo={cpp} title="C++" darkMode={darkMode} />
                    <Skill logo={bash} title="Bash" darkMode={darkMode} />
                    <Skill logo={docker} title="Docker" darkMode={darkMode} />
                    <Skill logo={git} title="Git" darkMode={darkMode} />
                    <Skill logo={mongodb} title="MongoDB" darkMode={darkMode} />
                    <Skill logo={nodejs} title="Node.js" darkMode={darkMode} />
                    <Skill logo={opencv} title="OpenCV" darkMode={darkMode} />
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "1.5rem" : "2rem",
                        alignItems: isMobile ? "stretch" : "flex-start",
                    }}
                >
                    {/* Graph canvas */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <SkillsGraph darkMode={darkMode} />
                    </div>

                    {/* Legend sidebar */}
                    <div
                        style={{
                            minWidth: isMobile ? "auto" : "180px",
                            maxWidth: isMobile ? "100%" : "200px",
                            display: "flex",
                            flexDirection: isMobile ? "row" : "column",
                            flexWrap: isMobile ? "wrap" : "nowrap",
                            gap: isMobile ? "1.2rem" : "1.5rem",
                        }}
                    >
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} style={{ flex: isMobile ? "1 1 45%" : "none" }}>
                                <h4
                                    style={{
                                        color: darkMode ? cat.darkColor : cat.color,
                                        fontSize: "0.65rem",
                                        fontWeight: "700",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        marginBottom: "0.5rem",
                                        margin: 0,
                                        paddingBottom: "0.4rem",
                                        borderBottom: `2px solid ${darkMode ? cat.darkColor : cat.color}30`,
                                    }}
                                >
                                    {cat.label}
                                </h4>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "0.4rem 0 0 0",
                                    }}
                                >
                                    {cat.skills.map((skill) => (
                                        <li
                                            key={skill.name}
                                            style={{
                                                color: darkMode
                                                    ? "rgba(255,255,255,0.7)"
                                                    : "rgba(0,0,0,0.6)",
                                                fontSize: "0.8rem",
                                                lineHeight: "1.8",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {skill.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;
