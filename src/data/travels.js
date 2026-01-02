/**
 * TRAVEL PHOTOS CONFIGURATION
 * 
 * Folder Structure:
 *   src/assets/travels/[Country]/[City]/photo.jpg
 * 
 * To add a new photo:
 * 1. Create folder: src/assets/travels/Country/City/
 * 2. Put your photo(s) there
 * 3. Import below and add entry to travels array
 * 
 * Tips:
 * - Same "location" string = same marker on globe
 * - isFavorite: true = shows by default
 * - Find coordinates: Google "[city name] coordinates"
 */

// === GERMANY ===
import berlin1 from "../assets/travels/Germany/Berlin/20251204_190514.jpg";
import hamburg1 from "../assets/travels/Germany/Hamburg/20251229_165855.jpg";

const travels = [
    // --- Berlin ---
    {
        id: 1,
        location: "Berlin, Germany",
        lat: 52.5200,
        lng: 13.4050,
        date: "2025",
        image: berlin1,
        isFavorite: true,
    },
    // --- Hamburg ---
    {
        id: 2,
        location: "Hamburg, Germany",
        lat: 53.5511,
        lng: 9.9937,
        date: "2025",
        image: hamburg1,
        isFavorite: true,
    },
];

export default travels;
