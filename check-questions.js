const { initDatabase } = require("./src/utils/database");
const db = initDatabase();

db.all("SELECT * FROM questions", (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Danh sách questions:");
    rows.forEach((row) => {
      console.log(
        `ID: ${row.id}, Category: ${
          row.category
        }, Text: ${row.question_text.substring(0, 50)}...`
      );
    });
  }
  db.close();
});
