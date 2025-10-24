export default (db) => ({
  addAffirmation: async (user_id, tip_id, date) => {
    return db.run(
      "INSERT INTO affirmations (user_id, tip_id, date) VALUES (?,?,?)",
      [user_id, tip_id, date]
    );
  },
  getAffirmationsByUser: async (user_id) => {
    return db.all("SELECT * FROM affirmations WHERE user_id=?", [user_id]);
  }
});
