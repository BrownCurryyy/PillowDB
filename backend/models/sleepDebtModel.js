export default (db) => ({
  getDebtByUser: async (user_id) => {
    return db.get(
      "SELECT * FROM sleep_debt WHERE debt_id=(SELECT debt_id FROM sleep_logs WHERE user_id=? LIMIT 1)",
      [user_id]
    );
  }
});
