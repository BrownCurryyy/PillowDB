// hashMockUsers.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

async function hashPasswords() {
  const db = await open({
    filename: "db/database.sqlite", // adjust to your DB path
    driver: sqlite3.Database
  });

  const users = await db.all("SELECT user_id, password FROM users");
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await db.run("UPDATE users SET password = ? WHERE user_id = ?", [hashed, u.user_id]);
    console.log(`✅ User ${u.user_id} password hashed`);
  }

  await db.close();
  console.log("🎉 All mock user passwords hashed!");
}

hashPasswords().catch(console.error);
