export default `
CREATE TABLE IF NOT EXISTS affirmations (
  user_id INTEGER,
  tip_id INTEGER,
  date TEXT,
  PRIMARY KEY(user_id, tip_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(tip_id) REFERENCES tips_and_tricks(tip_id)
);
`;
