import React from "react";

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
    return (
        <div className="header-controls" style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
            <button
                className="bulb-button"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                style={{
                    background: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        filter: darkMode ? "brightness(1.2)" : "brightness(1)",
                        transition: "filter 0.3s ease",
                    }}
                >
                    <path
                        d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.15-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.81C7.21 13.15 6 11.22 6 9a6 6 0 0 1 6-6z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill={darkMode ? "currentColor" : "none"}
                    />
                </svg>
            </button>
        </div>
    );
};

export default DarkModeToggle;
