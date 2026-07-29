import useIsMobile from "../hooks/useIsMobile";

const DarkModeToggle = ({ darkMode, toggleDarkMode, isHomePage }) => {
    const { isMobile } = useIsMobile();
    const useWhiteBg = !darkMode && !isHomePage;
    const btnSize = isMobile ? "42px" : "50px";

    // On mobile, the dark mode toggle is inside the Navbar pill
    if (isMobile) return null;

    return (
        <div className="header-controls" style={{
            position: "fixed",
            top: isMobile ? 14 : 20,
            right: isMobile ? 14 : 20,
            zIndex: 100,
        }}>
            <button
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                style={{
                    background: darkMode 
                        ? "rgba(30, 30, 30, 0.6)" 
                        : useWhiteBg
                            ? "rgba(255, 255, 255, 0.9)"
                            : "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: darkMode 
                        ? "1px solid rgba(255, 255, 255, 0.1)" 
                        : useWhiteBg
                            ? "1px solid rgba(0, 0, 0, 0.1)"
                            : "1px solid rgba(255, 255, 255, 0.4)",
                    borderRadius: "50%",
                    width: btnSize,
                    height: btnSize,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition:
                        "transform 420ms var(--ease-out), background-color 200ms var(--ease-out), border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
                    boxShadow: darkMode 
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
                        : useWhiteBg
                            ? "0 4px 16px rgba(0, 0, 0, 0.06)"
                            : "0 8px 32px rgba(0, 0, 0, 0.1)",
                    "--toggle-rotation": darkMode ? "360deg" : "0deg",
                    transform: `rotate(${darkMode ? "360deg" : "0deg"}) scale(1)`,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `rotate(${darkMode ? "360deg" : "0deg"}) scale(1.04)`;
                    e.currentTarget.style.boxShadow = darkMode 
                        ? "0 8px 32px rgba(147, 112, 219, 0.4)" 
                        : "0 8px 32px rgba(255, 200, 50, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${darkMode ? "360deg" : "0deg"}) scale(1)`;
                    e.currentTarget.style.boxShadow = darkMode 
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
                        : useWhiteBg
                            ? "0 4px 16px rgba(0, 0, 0, 0.06)"
                            : "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
            >
                {darkMode ? (
                    <svg
                        width={isMobile ? "20" : "24"}
                        height={isMobile ? "20" : "24"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            color: "#a78bfa",
                            transition:
                                "color 180ms var(--ease-out), transform 220ms var(--ease-out)",
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
                    <svg
                        width={isMobile ? "20" : "24"}
                        height={isMobile ? "20" : "24"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            color: "#f59e0b",
                            transition:
                                "color 180ms var(--ease-out), transform 220ms var(--ease-out)",
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
