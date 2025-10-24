import express from "express";

export default (db, userModel) => {
  const router = express.Router();

  // Get all users
  router.get("/", async (req, res) => {
    try {
      console.log("➡️ GET /users hit");
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (e) {
      console.error("❌ Error fetching users:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Signup
  router.post("/signup", async (req, res) => {
    console.log("➡️ POST /signup hit with body:", req.body);
    const { name, email, password, sleep_goal } = req.body;

    // quick input validation
    if (!name || !email || !password || !sleep_goal) {
      console.warn("⚠️ Missing fields in signup");
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      await userModel.createUser(name, email, password, sleep_goal);
      console.log("✅ User created:", email);
      res.json({ status: "user created" });
    } catch (e) {
      console.error("❌ Signup error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    console.log("➡️ POST /login hit with body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    try {
      const user = await userModel.getUserByEmail(email);
      if (!user || user.password !== password) {
        console.warn("⚠️ Invalid credentials:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      console.log("✅ Login successful:", email);
      res.json({ status: "login successful", user });
    } catch (e) {
      console.error("❌ Login error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
};
