import express from "express";
import dbPromise from "../db.js";

const router = express.Router();

// Add a sleep log
router.post("/log", async (req,res)=>{
  const { user_id,total_sleep,sleep_time,date,debt_id } = req.body;
  const db = await dbPromise;
  await db.run(
    "INSERT INTO sleep_logs (user_id,total_sleep,sleep_time,date,debt_id) VALUES (?,?,?,?,?)",
    [user_id,total_sleep,sleep_time,date,debt_id]
  );
  res.json({ status:"ok" });
});

// Get sleep debt for user dynamically
router.get("/debt/:user_id", async (req,res)=>{
  const { user_id } = req.params;
  const db = await dbPromise;
  const user = await db.get("SELECT sleep_goal FROM users WHERE user_id=?",[user_id]);
  if(!user) return res.status(404).json({error:"User not found"});
  const logs = await db.all("SELECT total_sleep FROM sleep_logs WHERE user_id=?",[user_id]);
  let totalDebt = 0;
  logs.forEach(l=> totalDebt += Math.max(user.sleep_goal - l.total_sleep,0));
  res.json({ user_id, totalDebt });
});

export default router;
