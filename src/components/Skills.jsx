/* eslint-disable react/prop-types */
import { lazy, Suspense, useState } from "react";
import { CATEGORIES, getSkillNodeId } from "./skillsGraphData";
import useIsMobile from "../hooks/useIsMobile";

const SkillsGraph = lazy(() => import("./SkillsGraph"));

const Skills = ({ darkMode }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { isMobile, windowWidth } = useIsMobile();
  const stackGraphLayout = windowWidth <= 980;
  const foreground = darkMode ? "#fafaf9" : "#171717";
  const muted = darkMode ? "#a1a1aa" : "#71717a";
  const surface = darkMode ? "#171717" : "#fafaf9";

  return (
    <div
      style={{
        padding: isMobile ? "4rem 1.25rem 3rem" : "6rem 3rem 4.5rem",
        margin: 0,
        background: surface,
        color: foreground,
        transition: "background-color 0.3s ease, color 0.3s ease",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "min(100%, 1440px)", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            paddingBottom: isMobile ? "1.75rem" : "2.25rem",
            borderBottom: `1px solid ${darkMode ? "#3f3f46" : "#e4e4e7"}`,
          }}
        >
          <div>
            <h2
              style={{
                color: foreground,
                margin: 0,
                fontSize: isMobile ? "2.15rem" : "clamp(2.8rem, 4.4vw, 4.2rem)",
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              Skills
            </h2>
          </div>
          <div
            className="skills-view-switch"
            role="group"
            aria-label="Skills view"
            data-theme={darkMode ? "dark" : "light"}
            data-view={showGraph ? "graph" : "list"}
          >
            {["list", "graph"].map((view) => (
              <button
                key={view}
                type="button"
                className="skills-view-option"
                aria-pressed={showGraph === (view === "graph")}
                aria-controls="skills-content"
                onClick={() => setShowGraph(view === "graph")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {view === "list" ? (
                    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
                  ) : (
                    <>
                      <path d="m8 7 8 3M7 9l3 8m6-4-4 5" />
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="18" cy="11" r="3" />
                      <circle cx="11" cy="20" r="2" />
                    </>
                  )}
                </svg>
                {view === "list" ? "List" : "Graph"}
              </button>
            ))}
          </div>
        </div>

        <div
          id="skills-content"
          style={{
            display: "grid",
            gridTemplateColumns: !showGraph || stackGraphLayout
              ? "1fr"
              : "minmax(0, 1fr) 255px",
            gap: stackGraphLayout ? "1.25rem" : "2.5rem",
            alignItems: "stretch",
            paddingTop: isMobile ? "1rem" : "1.5rem",
          }}
        >
          {showGraph && <div style={{ minWidth: 0, position: "relative" }}>
            <div
              className="skills-gesture-hint"
              data-hidden={hasInteracted}
              aria-hidden={hasInteracted}
              style={{
                color: darkMode ? "#fafaf9" : "#171717",
                background: darkMode
                  ? "rgba(39, 39, 42, 0.72)"
                  : "rgba(250, 250, 249, 0.7)",
                borderColor: darkMode
                  ? "rgba(250, 250, 249, 0.16)"
                  : "rgba(23, 23, 23, 0.1)",
              }}
            >
              Drag to explore
            </div>
            <Suspense fallback={<p role="status" style={{ padding: "3rem 1rem", color: muted }}>Loading graph…</p>}>
              <SkillsGraph
              darkMode={darkMode}
              selectedNodeId={selectedNodeId}
              onInteract={() => setHasInteracted(true)}
              onSelectNode={(nodeId) => {
                setHasInteracted(true);
                setSelectedNodeId(nodeId);
              }}
              expanded={stackGraphLayout}
              />
            </Suspense>
          </div>}

          <aside
            aria-label="Skills by category"
            style={{
              display: "grid",
              gridTemplateColumns: !showGraph
                ? windowWidth <= 520 ? "1fr" : "repeat(2, minmax(0, 1fr))"
                : stackGraphLayout ? "repeat(auto-fit, minmax(220px, 1fr))"
                : "1fr",
              alignContent: "start",
              gap: showGraph ? "1.4rem" : "2.5rem 2rem",
              padding: !showGraph || stackGraphLayout ? "0.5rem 0 0" : "1.25rem 0",
            }}
          >
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h3
                  style={{
                    color: darkMode ? cat.darkColor : cat.color,
                    fontSize: showGraph ? "0.66rem" : "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    margin: 0,
                    paddingBottom: "0.65rem",
                    borderBottom: `1px solid ${
                      darkMode ? "#3f3f46" : "#e4e4e7"
                    }`,
                  }}
                >
                  {cat.label}
                </h3>
                <ul
                  style={{ listStyle: "none", padding: 0, margin: "0.45rem 0 0" }}
                >
                  {cat.skills.map((skill) => {
                    const nodeId = getSkillNodeId(cat.id, skill.name);
                    const isSelected = selectedNodeId === nodeId;

                    return (
                      <li key={skill.name}>
                        {showGraph ? <button
                          className="skill-list-button"
                          type="button"
                          onClick={() => {
                            setHasInteracted(true);
                            setSelectedNodeId(isSelected ? null : nodeId);
                          }}
                          style={{
                            "--skill-accent": darkMode
                              ? cat.darkColor
                              : cat.color,
                            width: "100%",
                            textAlign: "left",
                            border: "none",
                            borderLeft: `2px solid ${
                              isSelected ? (darkMode ? cat.darkColor : cat.color) : "transparent"
                            }`,
                            padding: "0.28rem 0.55rem",
                            margin: "0.02rem 0",
                            cursor: "pointer",
                            background: isSelected
                              ? darkMode
                                ? "rgba(250,250,249,0.07)"
                                : "rgba(23,23,23,0.05)"
                              : "transparent",
                            color: isSelected ? foreground : muted,
                            fontSize: "0.78rem",
                            lineHeight: 1.35,
                            fontWeight: isSelected ? 700 : 450,
                            fontFamily: "inherit",
                            transition:
                              "color 160ms var(--ease-out), background-color 160ms var(--ease-out), border-color 160ms var(--ease-out), transform 140ms var(--ease-out)",
                          }}
                          aria-pressed={isSelected}
                          aria-label={`Focus ${skill.name} in the 3D skills graph`}
                        >
                          {skill.name}
                        </button> : (
                          <span style={{
                            display: "block",
                            padding: "0.45rem 0.7rem",
                            color: muted,
                            fontSize: "0.9rem",
                            lineHeight: 1.3,
                          }}>
                            {skill.name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Skills;
