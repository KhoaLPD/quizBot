const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "data", "questions", "vehicles.json"); // Path chính xác bạn cung cấp

if (!fs.existsSync(FILE_PATH)) {
  console.error(`❌ File không tồn tại: ${FILE_PATH}`);
  process.exit(1);
}

let questions;
try {
  questions = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
  console.log(`✅ Đọc thành công ${questions.length} câu hỏi từ ${FILE_PATH}`);

  // Log summary: Category, sample question, unique check
  const categories = {};
  questions.forEach((q, index) => {
    const cat = q.category || "unknown";
    categories[cat] = (categories[cat] || 0) + 1;
    if (index < 3) {
      // Log 3 câu đầu sample
      console.log(
        `Câu ${index + 1}: "${q.question_text.substring(0, 60)}..." (Đáp án: ${
          q.correct_answer
        })`
      );
    }
  });

  console.log("\n📊 Phân loại category:");
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count} câu`);
  });

  // Check unique (category + text)
  const uniqueSet = new Set(
    questions.map((q) => `${q.category || ""}|${q.question_text}`)
  );
  console.log(
    `\n🔍 Unique check: ${uniqueSet.size}/${questions.length} (duplicate: ${
      questions.length - uniqueSet.size
    })`
  );
} catch (err) {
  console.error(`❌ Lỗi parse JSON: ${err.message}`);
}

console.log(
  "\n💡 Nếu OK, run 'node load-questions.js' để load vào DB (sẽ merge unique)."
);
