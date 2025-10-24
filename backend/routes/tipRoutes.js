import express from "express";

export default (db, tipsModel, sleepLogsModel, usersModel) => {
  const router = express.Router();

  router.get("/tips/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    try {
      const logs = await sleepLogsModel.getLogsByUser(user_id);
      // simple tip logic: if last debt > 2 hrs, give "bad" tip
      const lastLog = logs[logs.length - 1];
      const debt = Math.max(usersModel.sleep_goal - lastLog.total_sleep, 0);
      const tips = await tipsModel.getTips();
      const filteredTips = tips.filter(t => debt > 2 ? t.type === "bad" : t.type === "good");
      res.json(filteredTips);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
};
