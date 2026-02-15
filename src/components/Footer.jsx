const Footer = ({ darkMode, isHomePage }) => {
    const currentYear = new Date().getFullYear();
    
    // On home page or dark mode: light text; on other pages in light mode: dark text
    const useWhiteBg = !darkMode && !isHomePage;

    return (
        <footer style={{
            textAlign: "center",
            padding: "1.5rem",
            backgroundColor: "transparent",
            color: useWhiteBg ? "rgba(0, 0, 0, 0.45)" : darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.9)",
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
        }}>
            © {currentYear} Agney
        </footer>
    );
};

export default Footer;
