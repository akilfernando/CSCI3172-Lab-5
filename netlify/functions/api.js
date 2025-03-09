import express from "express";
import serverless from "serverless-http";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
let accessToken = "";

// Fetch access token from Spotify
async function getSpotifyToken() {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      },
    }
  );
  accessToken = response.data.access_token;
}

// Fetch recommended artists
router.get("/recommend", async (req, res) => {
  const { artist } = req.query;
  if (!artist) return res.status(400).json({ error: "Artist name is required" });

  try {
    if (!accessToken) await getSpotifyToken();

    // Search for the artist
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!searchResponse.data.artists.items.length)
      return res.status(404).json({ error: "Artist not found" });

    const artistId = searchResponse.data.artists.items[0].id;

    // Get recommended artists
    const recommendationResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json(recommendationResponse.data.artists.map(a => ({
      name: a.name,
      genre: a.genres[0] || "Unknown",
      image: a.images[0]?.url || "",
    })));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/api/", router);
export const handler = serverless(app);