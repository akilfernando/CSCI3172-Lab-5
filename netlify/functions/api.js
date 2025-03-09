import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";

const app = express();
const router = express.Router();

router.get("/search", async (req, res) => {
    const artist = req.query.artist;
    if (!artist) {
        return res.status(400).json({ error: "Artist name is required" });
    }

    try {
        const response = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${artist}&fmt=json`);
        const data = await response.json();
        
        if (!data.artists || data.artists.length === 0) {
            return res.status(404).json({ error: "Artist not found" });
        }

        res.json({
            artist: data.artists[0].name,
            country: data.artists[0].country || "Unknown",
            disambiguation: data.artists[0].disambiguation || "No description",
            id: data.artists[0].id,
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.use("/api/", router);

export const handler = serverless(app);