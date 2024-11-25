import React from "react";

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
    return (
        <div className="header-controls" style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    id="darkModeToggle"
                    className="toggle-input"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                />
                <label htmlFor="darkModeToggle" className="toggle-label">
                    <span className="toggle-slider"></span>
                </label>
            </div>
        </div>
    );
};

export default DarkModeToggle;
