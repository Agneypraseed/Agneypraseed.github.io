const Footer = ({ darkMode }) => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer style={{
            textAlign: "center",
            padding: "1.5rem",
            backgroundColor: "transparent",
            color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.9)",
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
        }}>
            © {currentYear} Agney
        </footer>
    );
};

export default Footer;
