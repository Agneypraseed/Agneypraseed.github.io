import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

const Navbar = ({ darkMode, isHomePage }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile } = useIsMobile();
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const useWhiteBg = !darkMode && !isHomePage;

    const linkStyle = {
        color: useWhiteBg ? "#374151" : "rgba(255, 255, 255, 0.95)",
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
        background: useWhiteBg
            ? "rgba(0, 0, 0, 0.08)"
            : darkMode
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(255, 255, 255, 0.25)",
    };

    const hoverBg = useWhiteBg
        ? "rgba(0, 0, 0, 0.05)"
        : darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.15)";

    const navBg = useWhiteBg
        ? "rgba(255, 255, 255, 0.85)"
        : darkMode
            ? "rgba(30, 30, 30, 0.7)"
            : "rgba(255, 255, 255, 0.2)";

    const navBorder = useWhiteBg
        ? "1px solid rgba(0, 0, 0, 0.08)"
        : darkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.3)";

    const links = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/projects", label: "Projects" },
        { to: "/blog", label: "Blog" },
        { to: "/footprints", label: "Footprints" },
    ];

    return (
        <nav style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            padding: isMobile ? "0.6rem 1rem" : "0.75rem 1.5rem",
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
            {/* Hamburger button — mobile only */}
            <button
                className="hamburger-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                style={{ color: useWhiteBg ? "#374151" : "#fff" }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {menuOpen ? (
                        <>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                    )}
                </svg>
            </button>

            {/* Nav links — desktop visible, mobile: toggled */}
            <div
                className={`nav-links${menuOpen ? " open" : ""}`}
                style={isMobile && menuOpen ? {
                    background: navBg,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: navBorder,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                } : {}}
            >
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
    );
};

export default Navbar;
