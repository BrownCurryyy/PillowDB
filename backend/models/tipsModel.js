export default (db) => ({
  getAllTips: async () => db.all("SELECT * FROM tips_and_tricks"),
  getTipsForUser: async (user_id) => db.all(
    `SELECT t.* FROM tips_and_tricks t
     LEFT JOIN affirmations a ON t.tip_id = a.tip_id AND a.user_id=?
     WHERE a.tip_id IS NULL`, [user_id]
  ),
  addTip: async (message, category) => {
    return db.run("INSERT INTO tips_and_tricks (message, category) VALUES (?,?)", [message, category]);
  }
});
