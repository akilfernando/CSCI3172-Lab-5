// Import necessary modules
import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";

// Create an instance of express and a router for API endpoints
const api = express();
const router = express.Router();

// MusicBrainz API base URL
const BASE_URL = "https://musicbrainz.org/ws/2";

// Function to fetch data from MusicBrainz API
const fetchMusicData = async (endpoint, query) => {
    // Build the full URL for the MusicBrainz API request
    const url = `${BASE_URL}/${endpoint}?query=${query}&fmt=json`;
    
    // Fetch data from MusicBrainz API and return the parsed JSON response
    const response = await fetch(url);
    return response.json();
};

// Route for searching artists
router.get("/search/artist", async (req, res) => {
    // Get the search query from the request
    const { query } = req.query;

    // If no query is provided, return a 400 error with a message
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        // Fetch artist data from the MusicBrainz API
        const data = await fetchMusicData("artist", query);

        // Map through the artist data and format the response
        const artists = data.artists?.map(artist => ({
            name: artist.name,
            area: artist.area ? artist.area.name : "Unknown", // Provide "Unknown" if area is not available
            genres: artist.tags ? artist.tags.map(tag => tag.name).join(", ") : "No genres available"
        }));

        // Return the formatted artists data as JSON
        res.json(artists || []);
    } catch (error) {
        // If there is an error, return a 500 server error
        res.status(500).json({ error: "Server error" });
    }
});

// Route for searching albums
router.get("/search/album", async (req, res) => {
    // Get the search query from the request
    const { query } = req.query;

    // If no query is provided, return a 400 error with a message
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        // Fetch album data from the MusicBrainz API
        const data = await fetchMusicData("release-group", query);

        // Return the album data as JSON (release-groups)
        res.json(data["release-groups"] || []);
    } catch (error) {
        // If there is an error, return a 500 server error
        res.status(500).json({ error: "Server error" });
    }
});

// Route for searching songs
router.get("/search/song", async (req, res) => {
    // Get the search query from the request
    const { query } = req.query;

    // If no query is provided, return a 400 error with a message
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        // Fetch song data from the MusicBrainz API
        const data = await fetchMusicData("recording", query);

        // Return the song data as JSON (recordings)
        res.json(data.recordings || []);
    } catch (error) {
        // If there is an error, return a 500 server error
        res.status(500).json({ error: "Server error" });
    }
});

// Use the router for all API routes under /api/
api.use("/api/", router);

// Export the handler for serverless deployment
export const handler = serverless(api);