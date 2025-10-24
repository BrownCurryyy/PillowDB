import express from "express";
import bcrypt from "bcrypt";
import dbPromise from "../db.js";

const router = express.Router();

// Signup
router.post("/signup", async (req,res)=>{
  const { name,email,password,sleep_goal } = req.body;
  const db = await dbPromise;
  const hashed = await bcrypt.hash(password, 10);
  try{
    const result = await db.run(
      "INSERT INTO users (name,email,password,sleep_goal) VALUES (?,?,?,?)",
      [name,email,hashed,sleep_goal]
    );
    res.json({ status:"ok", user_id: result.lastID });
  }catch(e){
    res.status(400).json({error:"Email already exists"});
  }
});

// Login
router.post("/login", async (req,res)=>{
  const { email,password } = req.body;
  const db = await dbPromise;
  const user = await db.get("SELECT * FROM users WHERE email=?", [email]);
  if(!user) return res.status(404).json({error:"User not found"});
  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(401).json({error:"Wrong password"});
  res.json({status:"ok", user_id: user.user_id, name: user.name});
});

export default router;
