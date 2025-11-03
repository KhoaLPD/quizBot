const { initDatabase } = require("./src/utils/database");
const db = initDatabase();
db.close();
console.log("DB init success!");
