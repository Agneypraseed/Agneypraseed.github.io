/* eslint-disable react/prop-types */
export default function GlobePlaceReadout({ darkMode, location, onClear }) {
    return (
        <div className="footprints-route-place" data-theme={darkMode ? "dark" : "light"}>
            <span>{location}</span>
            {onClear && (
                <button
                    className="footprints-map-clear"
                    type="button"
                    aria-label="Clear city filter"
                    onClick={onClear}
                >
                    Clear
                </button>
            )}
        </div>
    );
}
