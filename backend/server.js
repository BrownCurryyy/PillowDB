import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import tipRoutes from "./routes/tipRoutes.js";
import leaderboardRoutes from "./routes/leaderboard.js";

import dbPromise from "./db.js";
import usersModel from "./models/userModel.js";
import sleepLogsModel from "./models/sleepLogModel.js";
import sleepDebtModel from "./models/sleepDebtModel.js";
import tipsModel from "./models/tipsModel.js";
import affirmationsModel from "./models/affirmationsModel.js";

const app = express();
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log("➡️  " + req.method + " " + req.url);
  next();
});

// Init DB and create tables
const db = await dbPromise;

await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  sleep_goal INTEGER
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS sleep_debt (
  debt_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sleep_debt INTEGER DEFAULT 0,
  total_debt INTEGER DEFAULT 0
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS sleep_logs (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_sleep INTEGER,
  sleep_time TEXT,
  date TEXT,
  debt_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(debt_id) REFERENCES sleep_debt(debt_id)
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS tips_and_tricks (
  tip_id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT,
  category TEXT
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS affirmations (
  user_id INTEGER,
  tip_id INTEGER,
  date TEXT,
  PRIMARY KEY(user_id, tip_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(tip_id) REFERENCES tips_and_tricks(tip_id)
);
`);

console.log("🗄️  Tables ensured in database");

// Mount routes with proper models
app.use("/auth", authRoutes);
app.use("/sleep", sleepRoutes(db, sleepLogsModel, sleepDebtModel));
app.use("/tip", tipRoutes(db, tipsModel, sleepLogsModel, usersModel));
app.use("/leaderboard", leaderboardRoutes(db, sleepLogsModel, usersModel));

app.get("/", (req, res) => res.send("Sleep Debt Tracker backend running 💤"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
