const API = "http://localhost:3000"; // backend URL

// SIGNUP
async function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPass").value;
  const sleep_goal = parseInt(document.getElementById("signupGoal").value);

  const msgEl = document.getElementById("signupMsg");
  msgEl.textContent = "";
  msgEl.style.color = "red";

  if (!name || !email || !password || !sleep_goal) {
    msgEl.textContent = "All fields are required!";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, sleep_goal })
    });
    const data = await res.json();

    if (res.ok) {
      msgEl.style.color = "green";
      msgEl.textContent = "Signup successful! You can now login.";
      document.getElementById("signupName").value = "";
      document.getElementById("signupEmail").value = "";
      document.getElementById("signupPass").value = "";
      document.getElementById("signupGoal").value = "";
    } else {
      msgEl.textContent = data.error || "Signup failed";
    }
  } catch (err) {
    msgEl.textContent = "Server error, try again later.";
    console.error(err);
  }
}

// LOGIN
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  const msgEl = document.getElementById("loginMsg");
  msgEl.textContent = "";
  msgEl.style.color = "red";

  if (!email || !password) {
    msgEl.textContent = "Both fields are required!";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      msgEl.style.color = "green";
      msgEl.textContent = "Login successful!";
      // FIXED: match authRoutes response
      const user = { user_id: data.user_id, name: data.name };
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "dashboard.html"; // redirect to dashboard
    } else {
      msgEl.textContent = data.error || "Invalid credentials";
    }
  } catch (err) {
    msgEl.textContent = "Server error, try again later.";
    console.error(err);
  }
}
