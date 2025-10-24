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

  return router;
};
