import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DarkModeToggle from "./components/DarkModeToggle";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import FootprintsPage from "./pages/FootprintsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
    const [darkMode, setDarkMode] = useState(false);

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
        <Router>
            <Navbar darkMode={darkMode} />
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={handleDarkModeToggle} />
            <Routes>
                <Route path="/" element={<HomePage darkMode={darkMode} />} />
                <Route path="/about" element={<AboutPage darkMode={darkMode} />} />
                <Route path="/projects" element={<ProjectsPage darkMode={darkMode} />} />
                <Route path="/blog" element={<BlogPage darkMode={darkMode} />} />
                <Route path="/footprints" element={<FootprintsPage darkMode={darkMode} />} />
                <Route path="*" element={<NotFoundPage darkMode={darkMode} />} />
            </Routes>
        </Router>
    );
};

export default App;
