/* eslint-disable react/prop-types */
import { useState } from "react";
import SkillsGraph from "./SkillsGraph";
import { CATEGORIES, getSkillNodeId } from "./skillsGraphData";
import useIsMobile from "../hooks/useIsMobile";

const Skills = ({ darkMode }) => {
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
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "flex-start",
            flexDirection: isMobile ? "column" : "row",
            gap: "1rem",
            paddingBottom: isMobile ? "1.75rem" : "2.25rem",
            borderBottom: `1px solid ${darkMode ? "#3f3f46" : "#e4e4e7"}`,
          }}
        >
          <div>
            <p
              style={{
                color: "#dc2626",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                margin: "0 0 0.65rem",
              }}
            >
              Technical toolkit
            </p>
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
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: stackGraphLayout
              ? "1fr"
              : "minmax(0, 1fr) 255px",
            gap: stackGraphLayout ? "1.25rem" : "2.5rem",
            alignItems: "stretch",
            paddingTop: isMobile ? "1rem" : "1.5rem",
          }}
        >
          <div style={{ minWidth: 0, position: "relative" }}>
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
          </div>

          <aside
            aria-label="Skills by category"
            style={{
              display: "grid",
              gridTemplateColumns: stackGraphLayout
                ? "repeat(auto-fit, minmax(220px, 1fr))"
                : "1fr",
              alignContent: "start",
              gap: "1.4rem",
              padding: stackGraphLayout ? "0.5rem 0 0" : "1.25rem 0",
            }}
          >
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h3
                  style={{
                    color: darkMode ? cat.darkColor : cat.color,
                    fontSize: "0.66rem",
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
                        <button
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
                              isSelected ? "#dc2626" : "transparent"
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
                        </button>
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
