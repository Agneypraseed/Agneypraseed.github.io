import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import DarkModeToggle from "./components/DarkModeToggle";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import BooksPage from "./pages/BooksPage";
import VideosPage from "./pages/VideosPage";
import MusicPage from "./pages/MusicPage";
import SeriesHubPage from "./pages/SeriesHubPage";
import BlogPostPage from "./pages/BlogPostPage";
import CursorTrail from "./components/CursorTrail";
import { getPageMetadata, siteName } from "./site-seo";

// Load the travel globe only when its page is opened, keeping it off the home path.
const FootprintsPage = lazy(() => import("./pages/FootprintsPage"));

function setHeadTag(tag, attribute, key, valueAttribute, value) {
    const existing = document.head.querySelector(`${tag}[${attribute}="${key}"]`);
    if (!value) {
        existing?.remove();
        return;
    }

    const element = existing || document.createElement(tag);
    element.setAttribute(attribute, key);
    element.setAttribute(valueAttribute, value);
    if (!existing) document.head.append(element);
}

const AppContent = () => {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
    const { pathname } = useLocation();
    const isHomePage = pathname === "/";
    const lastTrackedPath = useRef(pathname);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    useEffect(() => {
        const { title, description, canonical, noindex, structuredData } = getPageMetadata(pathname);
        document.title = title;
        setHeadTag("meta", "name", "description", "content", description);
        setHeadTag("link", "rel", "canonical", "href", canonical);
        setHeadTag("meta", "name", "robots", "content", noindex ? "noindex" : null);
        setHeadTag("meta", "property", "og:site_name", "content", siteName);
        setHeadTag("meta", "property", "og:title", "content", title);
        setHeadTag("meta", "property", "og:description", "content", description);
        setHeadTag("meta", "property", "og:url", "content", canonical);

        const existing = document.getElementById("page-structured-data");
        if (structuredData) {
            const script = existing || document.createElement("script");
            script.id = "page-structured-data";
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(structuredData);
            if (!existing) document.head.append(script);
        } else {
            existing?.remove();
        }

        // GoatCounter handles the initial load. Count subsequent client-side page changes.
        if (lastTrackedPath.current !== pathname) {
            lastTrackedPath.current = pathname;
            window.goatcounter?.count({ path: pathname, title });
        }
    }, [pathname]);

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
            document.body.style.backgroundColor = "#F5F0E8";
            document.body.style.color = "";
        }
    }, [darkMode]);

    return (
        <>
            <CursorTrail />
            <Navbar darkMode={darkMode} isHomePage={isHomePage} toggleDarkMode={handleDarkModeToggle} />
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={handleDarkModeToggle} isHomePage={isHomePage} />
            <Routes>
                <Route path="/" element={<HomePage darkMode={darkMode} />} />
                <Route path="/about" element={<AboutPage darkMode={darkMode} />} />
                <Route path="/projects" element={<ProjectsPage darkMode={darkMode} />} />
                <Route path="/blog" element={<BlogPage darkMode={darkMode} />} />
                <Route path="/blog/:seriesId" element={<SeriesHubPage darkMode={darkMode} />} />
                <Route path="/blog/:seriesId/:slug" element={<BlogPostPage darkMode={darkMode} />} />
                <Route path="/footprints" element={
                    <Suspense fallback={<p role="status" style={{ padding: "8rem 1.5rem", textAlign: "center" }}>Loading footprints…</p>}>
                        <FootprintsPage darkMode={darkMode} />
                    </Suspense>
                } />
                <Route path="/books" element={<BooksPage darkMode={darkMode} />} />
                <Route path="/videos" element={<VideosPage darkMode={darkMode} />} />
                <Route path="/music" element={<MusicPage darkMode={darkMode} />} />
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
