const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");
const config = require("../../config.json"); // Load config cho level

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transports chung
const createTransport = (filename) =>
  new DailyRotateFile({
    filename: path.join(logDir, filename),
    datePattern: "YYYY-MM-DD",
    maxFiles: config.logging.max_files || "7d",
    maxSize: config.logging.max_file_size || "10m",
    level: config.logging.level || "info",
  });

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  createTransport("errors-%DATE%.log"),
  createTransport("quiz_created-%DATE%.log"),
  createTransport("quiz_started-%DATE%.log"),
  createTransport("quiz_answers-%DATE%.log"),
  createTransport("quiz_scores-%DATE%.log"),
  createTransport("quiz_completed-%DATE%.log"), // Thêm cho completed
];

// Single logger
const logger = winston.createLogger({
  level: config.logging.level || "info",
  format: logFormat,
  transports,
});

// Functions (dùng chung logger)
function logQuizCreated(data) {
  logger.info("QUIZ_CREATED", data);
}

function logQuizStarted(data) {
  logger.info("QUIZ_STARTED", data);
}

function logAnswer(data) {
  logger.info("ANSWER_SUBMITTED", data);
}

function logScore(data) {
  logger.info("SCORE_CALCULATED", data);
}

function logQuizCompleted(data) {
  // Thêm function theo workflow
  logger.info("QUIZ_COMPLETED", data);
}

function logError(error_message, context = {}) {
  logger.error("ERROR", { message: error_message, ...context });
}

module.exports = {
  logger,
  logQuizCreated,
  logQuizStarted,
  logAnswer,
  logScore,
  logQuizCompleted,
  logError,
};
