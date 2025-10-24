import express from "express";

export default (db, sleepLogsModel, usersModel) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const leaderboard = await sleepLogsModel.getLeaderboard();
      res.json(leaderboard);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
};
