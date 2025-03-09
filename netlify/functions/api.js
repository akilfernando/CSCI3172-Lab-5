import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";

const api = express();
const router = express.Router();

// MusicBrainz API base URL
const BASE_URL = "https://musicbrainz.org/ws/2";

// Function to fetch data from MusicBrainz API
const fetchMusicData = async (endpoint, query) => {
    const url = `${BASE_URL}/${endpoint}?query=${query}&fmt=json`;
    const response = await fetch(url);
    return response.json();
};

// Search for artists
router.get("/search/artist", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const data = await fetchMusicData("artist", query);
        res.json(data.artists || []);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Search for albums
router.get("/search/album", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const data = await fetchMusicData("release-group", query);
        res.json(data["release-groups"] || []);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Search for songs
router.get("/search/song", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const data = await fetchMusicData("recording", query);
        res.json(data.recordings || []);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

api.use("/api/", router);
export const handler = serverless(api);