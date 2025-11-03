const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "data/database.sqlite");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Open DB fail:", err.code);
    process.exit(1);
  }
  console.log("✅ DB opened OK!");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS quiz_participants_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    UNIQUE(quiz_id, user_id)
  )`);

  db.run(
    `INSERT INTO quiz_participants_new SELECT * FROM quiz_participants`,
    (err) => {
      if (err) console.error("Insert error:", err);
    }
  );

  db.run(`DROP TABLE IF EXISTS quiz_participants`);
  db.run(`ALTER TABLE quiz_participants_new RENAME TO quiz_participants`);
  console.log("✅ Added UNIQUE constraint!");
});

db.close((err) => {
  if (err) {
    console.log("⚠️ Close DB fail (ignore):", err.code);
  } else {
    console.log("✅ DB closed OK!");
  }
});
