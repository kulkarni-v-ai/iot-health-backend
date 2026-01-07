const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== MySQL Connection (InfinityFree DB) ===== */
const db = mysql.createConnection({
  host: "sql105.infinityfree.com",
  user: "if0_40641265",
  password: "Omiie2205",
  database: "if0_40641265_iot_db"
});

/* Connect DB */
db.connect(err => {
  if (err) {
    console.error("DB Connection Error:", err);
    return;
  }
  console.log("MySQL Connected");
});

/* ===== API ENDPOINT ===== */
/* Example:
   https://your-app.onrender.com/insert?bpm=78&spo2=97
*/
app.get("/insert", (req, res) => {
  const bpm = parseInt(req.query.bpm);
  const spo2 = parseInt(req.query.spo2);

  if (isNaN(bpm) || isNaN(spo2)) {
    return res.send("MISSING");
  }

  /* Severity Logic */
  let severity = 1;
  if (bpm < 50 || bpm > 130 || spo2 < 90) {
    severity = 3;
  } else if (bpm > 100 || spo2 < 95) {
    severity = 2;
  }

  const sql =
    "INSERT INTO health_data (bpm, spo2, severity) VALUES (?, ?, ?)";

  db.query(sql, [bpm, spo2, severity], err => {
    if (err) {
      console.error("Insert Error:", err);
      return res.send("DB_ERROR");
    }
    res.send("OK");
  });
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
