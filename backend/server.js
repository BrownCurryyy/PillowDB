import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

import authRoutes from "./routes/authRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import tipRoutes from "./routes/tipRoutes.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import userRoutes from "./routes/userRoutes.js";

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

// Init DB and tables
const db = await dbPromise;
await db.exec(usersModel);
await db.exec(sleepDebtModel);
await db.exec(sleepLogsModel);
await db.exec(tipsModel);
await db.exec(affirmationsModel);

// Mount routes
app.use("/auth", authRoutes);
app.use("/sleep", sleepRoutes);
app.use("/tip", tipRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.use("/api/users", userRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req,res)=>res.send("Sleep Debt Tracker backend running 💤"));

app.listen(3000, ()=>console.log("✅ Server running on http://localhost:3000"));
