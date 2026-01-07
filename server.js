const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== PostgreSQL Connection (Render) ===== */
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

/* ===== API ENDPOINT ===== */
app.get("/insert", async (req, res) => {
  const bpm = parseInt(req.query.bpm);
  const spo2 = parseInt(req.query.spo2);

  if (isNaN(bpm) || isNaN(spo2)) {
    return res.send("MISSING");
  }

  let severity = 1;
  if (bpm < 50 || bpm > 130 || spo2 < 90) severity = 3;
  else if (bpm > 100 || spo2 < 95) severity = 2;

  const sql =
    "INSERT INTO health_data (bpm, spo2, severity) VALUES ($1, $2, $3)";

  try {
    await db.query(sql, [bpm, spo2, severity]);
    res.send("OK");
  } catch (err) {
    console.error("Insert Error:", err);
    res.send("DB_ERROR");
  }
});

/* ===== SERVER ===== */
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
