export default (db) => ({
  createUser: async (name, email, password, sleep_goal) => {
    return db.run(
      "INSERT INTO users (name,email,password,sleep_goal) VALUES (?,?,?,?)",
      [name, email, password, sleep_goal]
    );
  },

  getUserByEmail: async (email) => {
    return db.get("SELECT * FROM users WHERE email=?", [email]);
  },

  getAllUsers: async () => {
    return db.all("SELECT user_id, name, email, sleep_goal FROM users");
  }
});
