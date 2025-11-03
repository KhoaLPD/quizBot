const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "data/database.sqlite"); // Explicit từ root

// Check DB tồn tại
const fs = require("fs");
if (!fs.existsSync(DB_PATH)) {
  console.log("❌ DB chưa tồn tại! Chạy init trước (hoặc tạo empty DB).");
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  // Backup + recreate quizzes (xóa difficulty)
  db.run(`CREATE TABLE IF NOT EXISTS quizzes_backup AS SELECT * FROM quizzes`);
  db.run(`DROP TABLE IF EXISTS quizzes`);
  db.run(`CREATE TABLE quizzes (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    creator_username TEXT NOT NULL,
    category TEXT NOT NULL,
    questions_count INTEGER NOT NULL,
    time_per_question INTEGER NOT NULL,
    channel_id TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    finished_at DATETIME,
    deleted_at DATETIME
  )`);
  db.run(
    `INSERT INTO quizzes SELECT id, server_id, creator_id, creator_username, category, questions_count, time_per_question, channel_id, status, created_at, started_at, finished_at, deleted_at FROM quizzes_backup`
  );
  db.run(`DROP TABLE IF EXISTS quizzes_backup`);
  console.log("✅ Migration: Xóa difficulty khỏi quizzes hoàn tất!");
});

db.close((err) => {
  if (err) console.error("Lỗi close DB:", err);
  else console.log("✅ DB closed OK!");
});
