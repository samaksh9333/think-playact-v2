require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection via AZURE_DB_CONN env var
const pool = new Pool({
  connectionString: process.env.AZURE_DB_CONN,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => res.send("Game API running!"));

// GET /api/classified_steam_games
// Optional query params:
//    page (1-based) and perPage — if provided, returns paged results with metadata
app.get("/api/classified_steam_games", async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const perPage = parseInt(req.query.perPage, 10);

  try {
    if (page > 0 && perPage > 0) {
      // Count total rows
      const countResult = await pool.query(
        `SELECT COUNT(*) AS total FROM classified_steam_games`
      );
      const totalRows = parseInt(countResult.rows[0].total, 10);

      // Fetch just this page
      const offset = (page - 1) * perPage;
      const dataSql = `
        SELECT *
          FROM classified_steam_games
         ORDER BY owners_lower DESC
         LIMIT $1 OFFSET $2
      `;
      const dataResult = await pool.query(dataSql, [perPage, offset]);

      return res.json({
        page,
        perPage,
        totalRows,
        data: dataResult.rows,
      });
    } else {
      // No pagination: return everything
      const result = await pool.query("SELECT * FROM classified_steam_games");
      return res.json(result.rows);
    }
  } catch (err) {
    console.error("DB error on classified_steam_games:", err.stack || err);
    return res
      .status(500)
      .json({ error: "DB error on classified_steam_games" });
  }
});

// GET /api/violence_counts
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

// GET /api/genre_emotion_summary
app.get("/api/genre_emotion_summary", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM genre_emotion_summary");
    res.json(rows);
  } catch (err) {
    console.error("DB error on genre_emotion_summary:", err.stack || err);
    res.status(500).json({ error: "DB error on genre_emotion_summary" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));
