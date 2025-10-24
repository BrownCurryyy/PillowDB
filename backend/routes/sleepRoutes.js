import express from "express";

export default (db, sleepLogsModel, sleepDebtModel) => {
  const router = express.Router();

  router.get("/logs/:user_id", async (req, res) => {
    try {
      const logs = await sleepLogsModel.getLogsByUser(req.params.user_id);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/logs", async (req, res) => {
    const { user_id, date, total_sleep } = req.body;
    if (!user_id || !date || total_sleep === undefined)
      return res.status(400).json({ error: "Missing fields" });

    try {
      const log = await sleepLogsModel.addLog(user_id, date, total_sleep);
      res.json({ status: "ok", log });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/debt/:user_id", async (req, res) => {
    try {
      const debt = await sleepDebtModel.getDebtByUser(req.params.user_id);
      res.json({ debt });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
