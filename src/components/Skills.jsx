/* eslint-disable react/prop-types */
import { useState } from "react";
import SkillsGraph from "./SkillsGraph";
import SkillsGraph2D from "./SkillsGraph2D";
import { CATEGORIES, getSkillNodeId } from "./skillsGraphData";
import useIsMobile from "../hooks/useIsMobile";
const Skills = ({ darkMode }) => {
  const [viewMode, setViewMode] = useState("3d"); // "3d" | "2d"
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const { isMobile, windowWidth } = useIsMobile();
  const stackGraphLayout = windowWidth <= 1120;

  return (
    <div
      style={{
        padding: isMobile ? "1.25rem" : "2rem",
        margin: isMobile ? "1rem auto" : "2rem auto",
        background: darkMode
          ? "linear-gradient(135deg, rgba(23,23,23,0.58), rgba(39,39,42,0.34)), radial-gradient(circle at 12% 8%, rgba(255,255,255,0.12), transparent 32%), radial-gradient(circle at 88% 18%, rgba(161,161,170,0.14), transparent 34%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.34)), radial-gradient(circle at 12% 8%, rgba(255,255,255,0.95), transparent 34%), radial-gradient(circle at 88% 18%, rgba(228,228,231,0.52), transparent 36%)",
        backdropFilter: "blur(22px) saturate(1.35)",
        WebkitBackdropFilter: "blur(22px) saturate(1.35)",
        borderRadius: "20px",
        border: darkMode
          ? "1px solid rgba(255, 255, 255, 0.16)"
          : "1px solid rgba(255, 255, 255, 0.82)",
        boxShadow: darkMode
          ? "0 24px 70px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06)"
          : "0 24px 70px rgba(100, 100, 180, 0.16), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(255,255,255,0.42)",
        transition: "all 0.3s ease",
        width: isMobile ? "calc(100% - 1rem)" : "min(94vw, 1320px)",
        maxWidth: "1320px",
        boxSizing: "border-box",
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
          onClick={() => setViewMode((v) => (v === "3d" ? "2d" : "3d"))}
          aria-label={`Switch to ${viewMode === "3d" ? "2D" : "3D"} skills graph view`}
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
            color: darkMode ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)",
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
          {viewMode === "3d" ? "2D View" : "3D View"}
        </button>
      </div>

      {/* ── Content: 3D or 2D graph ── */}
      <div
        style={{
          display: "flex",
          flexDirection: stackGraphLayout ? "column" : "row",
          gap: stackGraphLayout ? "1.5rem" : "2rem",
          alignItems: "stretch",
        }}
      >
        {/* Graph canvas */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {viewMode === "3d" ? (
            <SkillsGraph
              darkMode={darkMode}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              expanded={stackGraphLayout}
            />
          ) : (
            <SkillsGraph2D darkMode={darkMode} />
          )}
        </div>

        {/* Legend sidebar */}
        <div
          style={{
            minWidth: stackGraphLayout ? "auto" : "220px",
            maxWidth: stackGraphLayout ? "100%" : "240px",
            display: "grid",
            gridTemplateColumns: stackGraphLayout
              ? "repeat(auto-fit, minmax(210px, 1fr))"
              : "1fr",
            gap: stackGraphLayout ? "1rem" : "1.25rem",
            maxHeight: stackGraphLayout ? "none" : "620px",
            overflowY: stackGraphLayout ? "visible" : "auto",
            paddingRight: stackGraphLayout ? 0 : "0.35rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
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
                {cat.skills.map((skill) => {
                  const nodeId = getSkillNodeId(cat.id, skill.name);
                  const isSelected = selectedNodeId === nodeId;

                  return (
                    <li key={skill.name}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedNodeId(isSelected ? null : nodeId)
                        }
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.22rem 0.45rem",
                          margin: "0.08rem 0",
                          cursor: "pointer",
                          background: isSelected
                            ? darkMode
                              ? `${cat.darkColor}24`
                              : `${cat.color}16`
                            : "transparent",
                          color: isSelected
                            ? darkMode
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(0,0,0,0.82)"
                            : darkMode
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(0,0,0,0.6)",
                          fontSize: "0.8rem",
                          lineHeight: "1.45",
                          fontWeight: isSelected ? "700" : "400",
                          fontFamily: "Inter, system-ui, sans-serif",
                          transition: "all 0.2s ease",
                        }}
                        aria-pressed={isSelected}
                        aria-label={`Focus ${skill.name} in the 3D skills graph`}
                      >
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
