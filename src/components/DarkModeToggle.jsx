import React from "react";

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
    return (
        <div className="header-controls" style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
            <button
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                style={{
                    background: darkMode 
                        ? "rgba(30, 30, 30, 0.6)" 
                        : "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: darkMode 
                        ? "1px solid rgba(255, 255, 255, 0.1)" 
                        : "1px solid rgba(255, 255, 255, 0.4)",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.4s ease",
                    boxShadow: darkMode 
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
                        : "0 8px 32px rgba(0, 0, 0, 0.1)",
                    transform: darkMode ? "rotate(360deg)" : "rotate(0deg)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = darkMode ? "rotate(360deg) scale(1.1)" : "rotate(0deg) scale(1.1)";
                    e.currentTarget.style.boxShadow = darkMode 
                        ? "0 8px 32px rgba(147, 112, 219, 0.4)" 
                        : "0 8px 32px rgba(255, 200, 50, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = darkMode ? "rotate(360deg) scale(1)" : "rotate(0deg) scale(1)";
                    e.currentTarget.style.boxShadow = darkMode 
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
                        : "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
            >
                {darkMode ? (
                    // Moon icon for dark mode
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            color: "#a78bfa",
                            transition: "all 0.4s ease",
                        }}
                    >
                        <path
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    // Sun icon for light mode
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            color: "#f59e0b",
                            transition: "all 0.4s ease",
                        }}
                    >
                        <circle cx="12" cy="12" r="5" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default DarkModeToggle;
