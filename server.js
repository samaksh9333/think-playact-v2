// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { Pool } = require("pg");

const app = express();

// 1) CORS + Private Network support
app.use(
  cors({
    origin: "https://thinkplayact.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(express.json());

// 2) Postgres pool
const pool = new Pool({
  connectionString: process.env.AZURE_DB_CONN,
  ssl: { rejectUnauthorized: false },
});

// 3) Health-check
app.get("/api", (req, res) => {
  res.send("🎮 Game API is up at /api!");
});

// 4) Steam games endpoint
app.get("/api/classified_steam_games", async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const perPage = parseInt(req.query.perPage, 10);

  try {
    if (page > 0 && perPage > 0) {
      const countResult = await pool.query(
        "SELECT COUNT(*) AS total FROM classified_steam_games"
      );
      const totalRows = parseInt(countResult.rows[0].total, 10);

      const offset = (page - 1) * perPage;
      const dataResult = await pool.query(
        `SELECT * 
           FROM classified_steam_games 
          ORDER BY owners_lower DESC 
          LIMIT $1 OFFSET $2`,
        [perPage, offset]
      );

      return res.json({
        page,
        perPage,
        totalRows,
        data: dataResult.rows,
      });
    }

    const allResult = await pool.query(
      "SELECT * FROM classified_steam_games ORDER BY owners_lower DESC"
    );
    res.json(allResult.rows);
  } catch (err) {
    console.error("DB error:", err.stack || err);
    res.status(500).json({ error: "DB error on classified_steam_games" });
  }
});

// 5) Violence counts
app.get("/api/violence_counts", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT violence_level, COUNT(*) AS count
        FROM classified_steam_games
       GROUP BY violence_level
    `);
    res.json(rows);
  } catch (err) {
    console.error("DB error on violence_counts:", err.stack || err);
    res.status(500).json({ error: "DB error on violence_counts" });
  }
});

// 6) Genre emotion summary
app.get("/api/genre_emotion_summary", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM genre_emotion_summary");
    res.json(rows);
  } catch (err) {
    console.error("DB error on genre_emotion_summary:", err.stack || err);
    res.status(500).json({ error: "DB error on genre_emotion_summary" });
  }
});

// 7) RAWG Proxy endpoint for age rating
app.get("/api/rawg-age-rating", async (req, res) => {
  const title = req.query.title;
  const apiKey = process.env.RAWG_API_KEY;

  if (!title || !apiKey) {
    return res.status(400).json({ error: "Missing title or API key" });
  }

  try {
    const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
      title
    )}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const rating = data?.results?.[0]?.esrb_rating?.name || "Not Rated";
    return res.json({ age_rating: rating });
  } catch (err) {
    console.error("RAWG error:", err);
    return res.status(500).json({ error: "Failed to fetch from RAWG" });
  }
});

// 8) Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🎮 API listening on port ${port} (endpoints under /api)`);
});
