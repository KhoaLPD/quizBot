const { logQuizCreated } = require("./src/utils/logger");
logQuizCreated({ quiz_id: "TEST_QZ_001", test: "success" });
console.log("Logger test success!");
