require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { Pool } = require("pg");

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin || "*");
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// ✅ Access to private network
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(express.json());

// ✅ PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.AZURE_DB_CONN,
  ssl: { rejectUnauthorized: false },
});

// ✅ Health check
app.get("/api", (req, res) => {
  res.send("🎮 Game API is up at /api!");
});

// ✅ Get steam games
app.get("/api/steam_games", async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const perPage = parseInt(req.query.perPage, 10);

  try {
    if (page > 0 && perPage > 0) {
      const countResult = await pool.query(
        "SELECT COUNT(*) AS total FROM steam_games"
      );
      const totalRows = parseInt(countResult.rows[0].total, 10);
      const offset = (page - 1) * perPage;

      const dataResult = await pool.query(
        "SELECT * FROM steam_games ORDER BY appid ASC LIMIT $1 OFFSET $2",
        [perPage, offset]
      );

      return res.json({ page, perPage, totalRows, data: dataResult.rows });
    }

    const allResult = await pool.query(
      "SELECT * FROM steam_games ORDER BY appid ASC"
    );
    res.json(allResult.rows);
  } catch (err) {
    console.error("DB error on steam_games:", err.stack || err);
    res.status(500).json({ error: "DB error on steam_games" });
  }
});

// ✅ Genre-emotion summary
app.get("/api/genre_emotion_summary", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM genre_emotion_summary");
    res.json(rows);
  } catch (err) {
    console.error("DB error on genre_emotion_summary:", err.stack || err);
    res.status(500).json({ error: "DB error on genre_emotion_summary" });
  }
});

// ✅ RAWG API proxy
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
    res.json({ age_rating: rating });
  } catch (err) {
    console.error("RAWG error:", err);
    res.status(500).json({ error: "Failed to fetch from RAWG" });
  }
});

// ✅ POST: Insert tracker log (final correct version)
app.post("/api/tracker_logs", async (req, res) => {
  const {
    parent_email,
    mood,
    game_name,
    game_genre,
    play_date,
    play_duration_minutes,
  } = req.body;

  if (
    !parent_email ||
    !mood ||
    !game_name ||
    !game_genre ||
    !play_date ||
    play_duration_minutes == null
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      `INSERT INTO tracker_logs (parent_email, mood, game_name, game_genre, play_date, play_duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        parent_email,
        mood,
        game_name,
        game_genre,
        play_date,
        play_duration_minutes,
      ]
    );
    res.json({ message: "Tracker log recorded" });
  } catch (err) {
    console.error("DB error on tracker_logs insert:", err.stack || err);
    res.status(500).json({ error: "Failed to insert tracker log" });
  }
});

// ✅ GET: Fetch tracker logs
app.get("/api/tracker_logs", async (req, res) => {
  const { parent_email, period } = req.query;

  if (!parent_email) {
    return res.status(400).json({ error: "Missing parent_email" });
  }

  let interval = "";
  if (period === "week") {
    interval = "AND play_date >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (period === "month") {
    interval = "AND play_date >= CURRENT_DATE - INTERVAL '1 month'";
  }

  try {
    const result = await pool.query(
      `SELECT * FROM tracker_logs
       WHERE parent_email = $1 ${interval}
       ORDER BY play_date DESC`,
      [parent_email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB error on tracker_logs fetch:", err.stack || err);
    res.status(500).json({ error: "❌ Failed to fetch tracker logs" });
  }
});

// ✅ Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🎮 API listening on port ${port} (endpoints under /api)`);
});
