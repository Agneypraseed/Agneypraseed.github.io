import React from "react";
import useIsMobile from "../hooks/useIsMobile";

const Skill = ({ logo, title, darkMode }) => {
    const { isMobile } = useIsMobile();

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                padding: isMobile ? "0.6rem 0.8rem" : "1rem",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                marginRight: isMobile ? "0.5rem" : "2rem",
                marginBottom: isMobile ? "0.5rem" : "1rem",
                boxShadow: darkMode ? "2px 2px 4px rgba(0, 0, 0, 0.5)" : "2px 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
        >
            <img src={logo} alt={title} style={{
                width: isMobile ? "24px" : "32px",
                height: isMobile ? "24px" : "32px",
                marginRight: "0.5rem",
            }} />
            <span style={{
                color: darkMode ? "#ffffff" : "#000000",
                transition: "color 0.3s ease",
                fontSize: isMobile ? "0.8rem" : "1rem",
            }}>
                {title}
            </span>
        </div>
    );
};

export default Skill;
