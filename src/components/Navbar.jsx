import { NavLink } from "react-router-dom";

const Navbar = ({ darkMode, isHomePage }) => {
    // On home page or dark mode: white text on blue/dark bg
    // On other pages in light mode: dark text on white bg
    const useWhiteBg = !darkMode && !isHomePage;

    const linkStyle = {
        color: useWhiteBg ? "#374151" : "rgba(255, 255, 255, 0.95)",
        textDecoration: "none",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        fontSize: "0.95rem",
        fontWeight: "500",
        cursor: "pointer",
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

    return (
        <nav style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: useWhiteBg
                ? "rgba(255, 255, 255, 0.85)"
                : darkMode
                    ? "rgba(30, 30, 30, 0.7)"
                    : "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "50px",
            border: useWhiteBg
                ? "1px solid rgba(0, 0, 0, 0.08)"
                : darkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: useWhiteBg
                ? "0 4px 24px rgba(0, 0, 0, 0.06)"
                : "0 8px 32px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
        }}>
            <NavLink 
                to="/" 
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = hoverBg;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                    }
                }}
            >
                Home
            </NavLink>
            <NavLink 
                to="/about" 
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = hoverBg;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                    }
                }}
            >
                About
            </NavLink>
            <NavLink 
                to="/projects" 
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = hoverBg;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                    }
                }}
            >
                Projects
            </NavLink>
            <NavLink 
                to="/blog" 
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = hoverBg;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                    }
                }}
            >
                Blog
            </NavLink>
            <NavLink 
                to="/footprints" 
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = hoverBg;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                    }
                }}
            >
                Footprints
            </NavLink>
        </nav>
    );
};

export default Navbar;
