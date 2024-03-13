import React from "react";

const Skill = ({ logo, title }) => (
    <div
        style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            marginRight: "2rem",
            marginBottom: "1rem",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
    >
        <img src={logo} alt={title} style={{ width: "32px", height: "32px", marginRight: "0.5rem" }} />
        <span>{title}</span>
    </div>
);

export default Skill;
