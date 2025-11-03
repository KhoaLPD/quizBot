const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "data/database.sqlite");
const QUESTIONS_DIR = path.join(__dirname, "data/questions");

const db = new sqlite3.Database(DB_PATH);

function loadQuestionsFromJson(filename) {
  console.log(`Đang load file: ${filename}`);
  const filePath = path.join(QUESTIONS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File không tồn tại: ${filePath}`);
    return;
  }

  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO questions (category, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  questions.forEach((q) => {
    insertStmt.run(
      [
        q.category,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer,
        q.explanation || null,
        q.image_url || null,
      ],
      (err) => {
        if (err) {
          console.error(`Lỗi insert question: ${err.message}`);
        }
      }
    );
  });

  insertStmt.finalize();
  console.log(`✅ Đã load ${questions.length} questions từ ${filename}`);
}

db.serialize(() => {
  // Đảm bảo table tồn tại (không có difficulty)
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Load tất cả file JSON trong thư mục questions
  const jsonFiles = fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith(".json"));
  jsonFiles.forEach(loadQuestionsFromJson);

  console.log("✅ Hoàn tất load tất cả questions!");
});

db.close();
