import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DarkModeToggle from "./components/DarkModeToggle";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import FootprintsPage from "./pages/FootprintsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

const AppContent = () => {
    const [darkMode, setDarkMode] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode) {
            setDarkMode(savedMode === "true");
        }
    }, []);

    const handleDarkModeToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.body.style.backgroundColor = "#1a1a1a";
            document.body.style.color = "#ffffff";
        } else {
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        }
    }, [darkMode]);

    return (
        <>
            <Navbar darkMode={darkMode} isHomePage={isHomePage} />
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={handleDarkModeToggle} isHomePage={isHomePage} />
            <Routes>
                <Route path="/" element={<HomePage darkMode={darkMode} />} />
                <Route path="/about" element={<AboutPage darkMode={darkMode} />} />
                <Route path="/projects" element={<ProjectsPage darkMode={darkMode} />} />
                <Route path="/blog" element={<BlogPage darkMode={darkMode} />} />
                <Route path="/footprints" element={<FootprintsPage darkMode={darkMode} />} />
                <Route path="*" element={<NotFoundPage darkMode={darkMode} />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
