import express from "express";
import dbPromise from "../db.js";

const router = express.Router();

// Get random tip
router.get("/", async (req,res)=>{
  const db = await dbPromise;
  const tip = await db.get("SELECT * FROM tips_and_tricks ORDER BY RANDOM() LIMIT 1");
  res.json(tip || { message:"No tips yet" });
});

export default router;
