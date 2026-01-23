import { Link } from "react-router-dom";
import blue_bg from "../assets/blue_bg.png";

const NotFoundPage = ({ darkMode }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "transparent",
                backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "100px 40px 20px",
                textAlign: "center",
            }}
        >
            <h1 style={{ 
                color: "#ffffff",
                fontSize: "8rem",
                margin: "0",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                fontWeight: "700",
            }}>
                404
            </h1>
            <p style={{
                color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)",
                fontSize: "1.5rem",
                marginBottom: "2rem",
            }}>
                Oops! Page not found
            </p>
            <p style={{
                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)",
                fontSize: "1rem",
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
                    background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.8)",
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
