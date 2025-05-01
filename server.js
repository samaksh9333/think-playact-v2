// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// === CORS setup ===
// In development you might allow everything; in production lock this down to your frontend URL.
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // let our custom middleware still add the private-network header
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Add the Private-Network header for Chrome 130+ preflights
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(express.json());

// === PostgreSQL setup ===
const pool = new Pool({
  connectionString: process.env.AZURE_DB_CONN,
  ssl: { rejectUnauthorized: false },
});

// === Routes ===
// Health check
app.get("/api", (req, res) => {
  res.send("🎮 Game API is up and running under /api!");
});

// Fetch classified Steam games, optional ?page & ?perPage
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
        `
          SELECT *
            FROM classified_steam_games
           ORDER BY owners_lower DESC
           LIMIT $1 OFFSET $2
        `,
        [perPage, offset]
      );

      return res.json({
        page,
        perPage,
        totalRows,
        data: dataResult.rows,
      });
    } else {
      // no pagination
      const result = await pool.query(
        "SELECT * FROM classified_steam_games ORDER BY owners_lower DESC"
      );
      return res.json(result.rows);
    }
  } catch (err) {
    console.error("DB error on classified_steam_games:", err.stack || err);
    return res
      .status(500)
      .json({ error: "DB error on classified_steam_games" });
  }
});

// Violence counts
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

// Genre emotion summary
app.get("/api/genre_emotion_summary", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM genre_emotion_summary");
    res.json(rows);
  } catch (err) {
    console.error("DB error on genre_emotion_summary:", err.stack || err);
    res.status(500).json({ error: "DB error on genre_emotion_summary" });
  }
});

// === Start server ===
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on port ${port} (endpoints under /api)`);
});
