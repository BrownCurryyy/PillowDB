import express from "express";

export default (db, sleepLogsModel, usersModel) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      // Simple leaderboard: sum of total_sleep by user, descending
      const leaderboard = await db.all(`
        SELECT u.name, SUM(s.total_sleep) AS total_sleep
        FROM sleep_logs s
        JOIN users u ON s.user_id = u.user_id
        GROUP BY s.user_id
        ORDER BY total_sleep DESC
      `);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
