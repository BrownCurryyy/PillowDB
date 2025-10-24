export default `
CREATE TABLE IF NOT EXISTS sleep_debt (
  debt_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sleep_debt INTEGER DEFAULT 0,
  total_debt INTEGER DEFAULT 0
);
`;
