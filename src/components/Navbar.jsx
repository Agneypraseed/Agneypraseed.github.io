import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

const Navbar = ({ darkMode, isHomePage, toggleDarkMode }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile } = useIsMobile();
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const useWhiteBg = !darkMode && !isHomePage;

    const linkStyle = {
        color: darkMode ? "rgba(255, 255, 255, 0.95)" : "#374151",
        textDecoration: "none",
        padding: isMobile ? "0.65rem 1rem" : "0.5rem 1rem",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        fontSize: isMobile ? "1rem" : "0.95rem",
        fontWeight: "500",
        cursor: "pointer",
        display: "block",
    };

    const activeLinkStyle = {
        ...linkStyle,
        background: darkMode
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.08)",
    };

    const hoverBg = darkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)";

    const navBg = useWhiteBg
        ? "rgba(255, 255, 255, 0.85)"
        : darkMode
            ? "rgba(30, 30, 30, 0.7)"
            : "rgba(255, 255, 255, 0.75)";

    const navBorder = darkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.08)";

    const links = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/projects", label: "Projects" },
        { to: "/blog", label: "Blog" },
    ];

    const mobileLinkStyle = {
        ...linkStyle,
        fontSize: "1.25rem",
        padding: "1rem 1.5rem",
    };

    const mobileActiveLinkStyle = {
        ...mobileLinkStyle,
        background: darkMode
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.08)",
    };

    // Mobile navbar colors matching the reference image
    const mobileNavBg = darkMode
        ? "rgba(30, 30, 30, 0.7)"
        : "rgba(245, 237, 224, 0.95)";
    const mobileNavBorder = darkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(200, 185, 165, 0.5)";
    const mobileDotsBoxBg = darkMode
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(255, 248, 238, 0.9)";
    const mobileDotsBoxBorder = darkMode
        ? "1px solid rgba(255, 255, 255, 0.15)"
        : "1px solid rgba(210, 195, 175, 0.5)";

    return (
        <>
            {/* Mobile navbar — pill bar with AP + three-dot menu */}
            {isMobile && (
                <nav
                    className="mobile-nav-pill"
                    style={{
                        position: "fixed",
                        top: "16px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "calc(100% - 32px)",
                        maxWidth: "500px",
                        zIndex: 1000,
                        padding: "0.55rem 0.6rem 0.55rem 1.25rem",
                        background: mobileNavBg,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderRadius: "50px",
                        border: mobileNavBorder,
                        boxShadow: darkMode
                            ? "0 8px 32px rgba(0, 0, 0, 0.25)"
                            : "0 4px 20px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* AP logo text */}
                    <span
                        style={{
                            fontSize: "1.15rem",
                            fontWeight: "700",
                            letterSpacing: "0.02em",
                            color: darkMode ? "rgba(255, 255, 255, 0.95)" : "#2d2a26",
                            userSelect: "none",
                        }}
                    >
                        AP
                    </span>

                    {/* Right side: dark mode toggle + three-dot menu */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>

                    {/* Dark mode toggle */}
                    {toggleDarkMode && (
                        <button
                            onClick={toggleDarkMode}
                            aria-label="Toggle dark mode"
                            style={{
                                background: mobileDotsBoxBg,
                                border: mobileDotsBoxBorder,
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.3s ease",
                                padding: 0,
                            }}
                        >
                            {darkMode ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                                        fill="#a78bfa"
                                        stroke="#a78bfa"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="5" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"/>
                                    <line x1="12" y1="1" x2="12" y2="3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="12" y1="21" x2="12" y2="23" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="1" y1="12" x2="3" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="21" y1="12" x2="23" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Three-dot menu button */}
                    <button
                        className="mobile-dots-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        style={{
                            background: mobileDotsBoxBg,
                            border: mobileDotsBoxBorder,
                            borderRadius: "20px",
                            padding: "0.5rem 0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill={darkMode ? "rgba(255,255,255,0.85)" : "#3d3832"}
                        >
                            <circle cx="4" cy="10" r="1.8" />
                            <circle cx="10" cy="10" r="1.8" />
                            <circle cx="16" cy="10" r="1.8" />
                        </svg>
                    </button>
                    </div>
                </nav>
            )}

            {/* Desktop navbar — pill with links */}
            {!isMobile && (
                <nav style={{
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    padding: "0.75rem 1.5rem",
                    background: navBg,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: "50px",
                    border: navBorder,
                    boxShadow: useWhiteBg
                        ? "0 4px 24px rgba(0, 0, 0, 0.06)"
                        : "0 8px 32px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}>
                    <div className="nav-links" style={{ display: "flex" }}>
                        {links.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.classList.contains("active")) {
                                        e.currentTarget.style.background = hoverBg;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.classList.contains("active")) {
                                        e.currentTarget.style.background = "transparent";
                                    }
                                }}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            )}

            {/* Mobile fullscreen overlay — rendered OUTSIDE the nav pill */}
            {isMobile && menuOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: darkMode
                            ? "#1a1a1a"
                            : "#ffffff",
                        zIndex: 999,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                    }}
                >
                    {links.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            style={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileLinkStyle}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.classList.contains("active")) {
                                    e.currentTarget.style.background = hoverBg;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.classList.contains("active")) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    );
};

export default Navbar;
