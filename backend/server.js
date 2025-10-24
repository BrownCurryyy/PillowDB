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

app.use((req, res, next) => {
  console.log("➡️  " + req.method + " " + req.url);
  next();
});

const db = await dbPromise;
await db.exec(usersModel);
await db.exec(sleepDebtModel);
await db.exec(sleepLogsModel);
await db.exec(tipsModel);
await db.exec(affirmationsModel);
console.log("🗄️  Tables ensured in database");

// Mount routes properly
app.use("/auth", authRoutes); // just router
app.use("/sleep", sleepRoutes(db, sleepLogsModel, sleepDebtModel));
app.use("/tip", tipRoutes(db, tipsModel, sleepLogsModel, usersModel));
app.use("/leaderboard", leaderboardRoutes(db, sleepLogsModel, usersModel));

app.get("/", (req, res) => res.send("Sleep Debt Tracker backend running 💤"));

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
