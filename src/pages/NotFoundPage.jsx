import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

const NotFoundPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                padding: isMobile ? "80px 20px 20px" : "100px 40px 20px",
                textAlign: "center",
                transition: "background-color 0.3s ease",
            }}
        >
            <h1 style={{ 
                color: darkMode ? "#ffffff" : "#1a1a1a",
                fontSize: isMobile ? "4rem" : "8rem",
                margin: "0",
                fontWeight: "700",
            }}>
                404
            </h1>
            <p style={{
                color: darkMode ? "rgba(255,255,255,0.7)" : "#4b5563",
                fontSize: isMobile ? "1.2rem" : "1.5rem",
                marginBottom: "2rem",
            }}>
                Oops! Page not found
            </p>
            <p style={{
                color: darkMode ? "rgba(255,255,255,0.5)" : "#9ca3af",
                fontSize: isMobile ? "0.9rem" : "1rem",
                marginBottom: "2rem",
                maxWidth: "400px",
            }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#1a1a1a",
                    color: "#ffffff",
                    textDecoration: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                }}
            >
                ← Go Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
