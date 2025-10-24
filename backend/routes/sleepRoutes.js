import express from "express";

export default (db, sleepLogsModel, sleepDebtModel) => {
  const router = express.Router();

  router.get("/logs/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    try {
      const logs = await sleepLogsModel.getLogsByUser(user_id);
      res.json(logs);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

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
