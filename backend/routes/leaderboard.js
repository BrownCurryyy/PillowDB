import express from "express";
import dbPromise from "../db.js";

const router = express.Router();

// Get leaderboard by total debt
router.get("/", async (req,res)=>{
  const db = await dbPromise;
  const users = await db.all("SELECT user_id,name,sleep_goal FROM users");
  const leaderboard = [];
  for(const u of users){
    const logs = await db.all("SELECT total_sleep FROM sleep_logs WHERE user_id=?",[u.user_id]);
    let debt=0;
    logs.forEach(l=>debt+=Math.max(u.sleep_goal-l.total_sleep,0));
    leaderboard.push({user_id:u.user_id,name:u.name,totalDebt:debt});
  }
  leaderboard.sort((a,b)=>b.totalDebt-a.totalDebt);
  res.json(leaderboard);
});

export default router;
