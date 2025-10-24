const API = "http://localhost:3000";

// Signup
async function signup(){
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPass").value;
  const sleep_goal = parseInt(document.getElementById("signupGoal").value);
  const res = await fetch(`${API}/auth/signup`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({name,email,password,sleep_goal})
  });
  const data = await res.json();
  document.getElementById("signupMsg").innerText = JSON.stringify(data);
}

// Login
async function login(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;
  const res = await fetch(`${API}/auth/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email,password})
  });
  const data = await res.json();
  document.getElementById("loginMsg").innerText = JSON.stringify(data);
}

// Get Debt
async function getDebt(){
  const user_id = document.getElementById("debtUserId").value;
  const res = await fetch(`${API}/sleep/debt/${user_id}`);
  const data = await res.json();
  document.getElementById("debtResult").innerText = JSON.stringify(data);
}

// Random tip
async function getTip(){
  const res = await fetch(`${API}/tip`);
  const data = await res.json();
  document.getElementById("tipResult").innerText = JSON.stringify(data);
}

// Leaderboard
async function getLeaderboard(){
  const res = await fetch(`${API}/leaderboard`);
  const data = await res.json();
  document.getElementById("leaderboard").innerText = JSON.stringify(data,null,2);
}
