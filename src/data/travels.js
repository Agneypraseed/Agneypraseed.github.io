/**
 * TRAVEL PHOTOS CONFIGURATION
 *
 * How to add photos:
 *   1. Drop photo into src/assets/travels/Country/City/
 *   2. If it's a NEW city, add one entry to cityCoordinates below
 *   3. That's it! Photos are auto-discovered.
 *
 * Favorites:
 *   Prefix filename with "fav_" to feature it on the default view.
 *   e.g. fav_20251204_190514.jpg → shown by default
 *        20251204_190514.jpg     → only shown when city is selected
 *
 * Folder Structure:
 *   src/assets/travels/[Country]/[City]/photo.jpg
 */

// === COORDINATES CONFIG ===
// One entry per city — only needed for globe markers
const cityCoordinates = {
    "Berlin, Germany": { lat: 52.52, lng: 13.405 },
    "Hamburg, Germany": { lat: 53.5511, lng: 9.9937 },
    "Dresden, Germany": { lat: 51.0504, lng: 13.7373 },
    "Leipzig, Germany": { lat: 51.3397, lng: 12.3731 },
};

// === AUTO-DISCOVER ALL PHOTOS ===
const photoModules = import.meta.glob(
    "../assets/travels/**/*.{jpg,jpeg,png,webp}",
    { eager: true, import: "default" }
);

const travels = Object.entries(photoModules).map(([path, image], index) => {
    // path format: ../assets/travels/Country/City/photo.jpg
    const parts = path.split("/");
    const filename = parts[parts.length - 1];
    const city = parts[parts.length - 2];
    const country = parts[parts.length - 3];
    const location = `${city}, ${country}`;
    const coords = cityCoordinates[location] || { lat: 0, lng: 0 };
    const isFavorite = filename.startsWith("fav_");

    return {
        id: index + 1,
        location,
        lat: coords.lat,
        lng: coords.lng,
        image,
        isFavorite,
        date: "",
    };
});

export default travels;
