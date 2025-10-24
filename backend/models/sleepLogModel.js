export default `
CREATE TABLE IF NOT EXISTS sleep_logs (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_sleep INTEGER,
  sleep_time TEXT,
  date TEXT,
  debt_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(debt_id) REFERENCES sleep_debt(debt_id)
);
`;
