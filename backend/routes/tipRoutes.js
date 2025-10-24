import express from "express";

export default (db, tipsModel, sleepLogsModel, usersModel) => {
  const router = express.Router();

  router.get("/tips/:user_id", async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const tips = await tipsModel.getTipsForUser(user_id); // only new tips
      res.json(tips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
