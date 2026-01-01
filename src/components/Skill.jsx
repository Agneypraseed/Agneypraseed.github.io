import React from "react";

const Skill = ({ logo, title, darkMode }) => (
    <div
        style={{
            backgroundColor: darkMode ? "#2d2d2d" : "#fff",
            padding: "1rem",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            marginRight: "2rem",
            marginBottom: "1rem",
            boxShadow: darkMode ? "2px 2px 4px rgba(0, 0, 0, 0.5)" : "2px 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        }}
    >
        <img src={logo} alt={title} style={{ width: "32px", height: "32px", marginRight: "0.5rem" }} />
        <span style={{ color: darkMode ? "#ffffff" : "#000000", transition: "color 0.3s ease" }}>{title}</span>
    </div>
);

export default Skill;
