require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { Pool } = require("pg");

const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "https://thinkplayact.netlify.app",
];
const netlifyPreviewRegex =
  /^https:\/\/[a-z0-9-]+--thinkplayact\.netlify\.app$/;

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin || "*"); // dynamically allow any origin
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Optional: Allow access to private network
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

// ✅ Get steam games (paginated or all)
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

// ✅ Violence level summary
app.get("/api/violence_counts", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT violence_level, COUNT(*) AS count
      FROM steam_games
      GROUP BY violence_level
    `);
    res.json(rows);
  } catch (err) {
    console.error("DB error on violence_counts:", err.stack || err);
    res.status(500).json({ error: "DB error on violence_counts" });
  }
});

// ✅ Genre-emotion summary (main Azure chart)
app.get("/api/genre_emotion_summary", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM genre_emotion_summary");
    res.json(rows);
  } catch (err) {
    console.error("DB error on genre_emotion_summary:", err.stack || err);
    res.status(500).json({ error: "DB error on genre_emotion_summary" });
  }
});

// ✅ RAWG proxy
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

// ✅ Insert mood log
app.post("/api/mood_logs", async (req, res) => {
  const { parent_email, mood, game_time_minutes, log_date } = req.body;

  if (!parent_email || !mood || game_time_minutes == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const logDate = log_date || new Date().toISOString().split("T")[0];

  try {
    await pool.query(
      `INSERT INTO mood_logs (parent_email, mood, game_time_minutes, log_date)
       VALUES ($1, $2, $3, $4)`,
      [parent_email, mood, game_time_minutes, logDate]
    );
    res.json({ message: "Mood log recorded" });
  } catch (err) {
    console.error("DB error on mood_logs insert:", err.stack || err);
    res.status(500).json({ error: "Failed to insert mood log" });
  }
});

// ✅ Fetch mood logs
app.get("/api/mood_logs", async (req, res) => {
  const { parent_email, period } = req.query;

  if (!parent_email) {
    return res.status(400).json({ error: "Missing parent_email" });
  }

  let interval = "";
  if (period === "week") {
    interval = "AND log_date >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (period === "month") {
    interval = "AND log_date >= CURRENT_DATE - INTERVAL '1 month'";
  }

  try {
    const result = await pool.query(
      `SELECT * FROM mood_logs
       WHERE parent_email = $1 ${interval}
       ORDER BY log_date DESC`,
      [parent_email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB error on mood_logs fetch:", err.stack || err);
    res.status(500).json({ error: "Failed to fetch mood logs" });
  }
});

// ✅ Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🎮 API listening on port ${port} (endpoints under /api)`);
});
