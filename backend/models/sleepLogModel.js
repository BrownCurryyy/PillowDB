export default (db) => ({
  addLog: async (user_id, date, total_sleep) => {
    return db.run(
      "INSERT INTO sleep_logs (user_id, date, total_sleep) VALUES (?,?,?)",
      [user_id, date, total_sleep]
    );
  },

  getLogsByUser: async (user_id) => {
    return db.all(
      "SELECT * FROM sleep_logs WHERE user_id=? ORDER BY date ASC",
      [user_id]
    );
  }
});
