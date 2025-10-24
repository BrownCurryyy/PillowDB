import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({
  filename: "./db/database.sqlite",
  driver: sqlite3.Database,
});

console.log("🛠 Populating database with mock data...");

// USERS
const users = [
  ["Alice","alice@mail.com","pass123",7],
  ["Bob","bob@mail.com","pass123",6],
  ["Charlie","charlie@mail.com","pass123",8],
  ["Dana","dana@mail.com","pass123",7],
  ["Eli","eli@mail.com","pass123",6],
  ["Fay","fay@mail.com","pass123",8],
  ["Gabe","gabe@mail.com","pass123",7],
  ["Hana","hana@mail.com","pass123",6],
  ["Ivy","ivy@mail.com","pass123",7],
  ["Jake","jake@mail.com","pass123",8]
];

for (const u of users) {
  await db.run("INSERT INTO users (name,email,password,sleep_goal) VALUES (?,?,?,?)", u);
}

// SLEEP DEBT
for (let i = 0; i < users.length; i++) {
  await db.run("INSERT INTO sleep_debt (sleep_debt,total_debt) VALUES (0,0)");
}

// SLEEP LOGS (3 logs per user)
const allUsers = await db.all("SELECT user_id, sleep_goal FROM users");
for (const user of allUsers) {
  // debt_id = same as user index (1-based)
  const debt_id = user.user_id;
  for (let i = 1; i <= 3; i++) {
    const slept = Math.floor(Math.random()*5)+5; // 5–9 hours
    await db.run(
      "INSERT INTO sleep_logs (user_id,total_sleep,sleep_time,date,debt_id) VALUES (?,?,?,?,?)",
      [user.user_id, slept, "23:00", `2025-10-2${i}`, debt_id]
    );
  }
}

// TIPS
const tips = [
  ["Sleep in a dark room","Environment"],
  ["Avoid screens before bed","Habit"],
  ["Meditate 10 mins","Mind"],
  ["Keep consistent sleep schedule","Routine"],
  ["Limit caffeine","Diet"],
  ["Stretch before sleep","Exercise"],
  ["Read a book","Habit"],
  ["Keep room cool","Environment"],
  ["Write a sleep journal","Routine"],
  ["Listen to calm music","Mind"]
];

for (const t of tips) {
  await db.run("INSERT INTO tips_and_tricks (message, category) VALUES (?,?)", t);
}

// AFFIRMATIONS (link user 1–10 with tip 1–10)
for (let i = 1; i <= 10; i++) {
  await db.run(
    "INSERT INTO affirmations (user_id,tip_id,date) VALUES (?,?,?)",
    [i, i, "2025-10-23"]
  );
}

console.log("✅ Mock data inserted successfully!");
process.exit();
