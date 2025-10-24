import express from "express";

export default (db, sleepLogsModel, sleepDebtModel) => {
  const router = express.Router();

  // GET logs
  router.get("/logs/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    try {
      const logs = await sleepLogsModel.getLogsByUser(user_id);
      res.json(logs);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST new sleep
  router.post("/logs", async (req, res) => {
    const { user_id, date, total_sleep } = req.body;
    if (!user_id || !date || total_sleep === undefined)
      return res.status(400).json({ error: "Missing fields" });

    try {
      const newLog = await sleepLogsModel.addLog(user_id, date, total_sleep);
      res.json({ status: "ok", log: newLog });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET debt
  router.get("/debt/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    try {
      const debt = await sleepDebtModel.getDebtByUser(user_id);
      res.json({ debt });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
};
