export default `
CREATE TABLE IF NOT EXISTS tips_and_tricks (
  tip_id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT,
  category TEXT
);
`;
