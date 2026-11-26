import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { getPageMetadata } from "./site-seo.js";
import "./index.css";

// Old bookmarks encoded routes in the fragment at the site root.
const currentUrl = new URL(window.location.href);
const rootEntry = currentUrl.pathname === "/" || currentUrl.pathname === "/index.html";
const legacyPath = rootEntry && /^#\/(?![\\/])/.test(currentUrl.hash)
    ? currentUrl.hash.slice(1)
    : null;
const pageUrl = legacyPath ? new URL(legacyPath, currentUrl.origin) : currentUrl;

if (pageUrl.origin === currentUrl.origin) {
    const { canonical } = getPageMetadata(pageUrl.pathname);
    if (canonical) pageUrl.pathname = new URL(canonical).pathname;
    if (legacyPath && !pageUrl.search) pageUrl.search = currentUrl.search;
    if (pageUrl.href !== window.location.href) {
        window.history.replaceState(window.history.state, "", pageUrl.href);
    }
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
