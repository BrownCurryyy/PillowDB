const API = "http://localhost:3000";
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) window.location.href = "index.html";

// Greet + logout
document.getElementById("userGreeting").innerText = `Hello, ${user.name}!`;
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

const sleepMsgEl = document.getElementById("sleepMsg");
document.getElementById("addSleepBtn").addEventListener("click", async () => {
  const date = document.getElementById("sleepDate").value;
  const hours = parseFloat(document.getElementById("sleepHours").value);
  sleepMsgEl.textContent = "";
  if (!date || !hours) {
    sleepMsgEl.textContent = "Date and hours required!";
    return;
  }

  try {
    const res = await fetch(`${API}/sleep/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, date, total_sleep: hours })
    });

    if (res.ok) {
      sleepMsgEl.style.color = "lightgreen";
      sleepMsgEl.textContent = "Sleep added!";
      document.getElementById("sleepDate").value = "";
      document.getElementById("sleepHours").value = "";
      await initDashboard();
      await loadTips();
    } else {
      const data = await res.json();
      sleepMsgEl.textContent = data.error || "Failed to add sleep";
    }
  } catch (err) {
    console.error(err);
    sleepMsgEl.textContent = "Server error!";
  }
});

let debtChart;

// Load logs table
async function loadLogs() {
  const res = await fetch(`${API}/sleep/logs/${user.user_id}`);
  const logs = await res.json();
  console.log("🚨 Logs fetched:", logs);

  const tbody = document.querySelector("#logsTable tbody");
  tbody.innerHTML = "";

  const goal = user.sleep_goal || 8; // fallback if missing

  logs.forEach(log => {
    const debt = Math.max(goal - log.total_sleep, 0);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${log.date}</td><td>${log.total_sleep}</td><td>${debt}</td>`;
    tbody.appendChild(tr);
  });

  return logs;
}

// Load chart
async function loadDebtChart(logs) {
  const ctx = document.getElementById("debtChart").getContext("2d");
  const goal = user.sleep_goal || 8;

  const labels = logs.map(l => l.date);
  const data = logs.map(l => Math.max(goal - l.total_sleep, 0));

  if (debtChart) debtChart.destroy();

  debtChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sleep Debt (hrs)',
        data,
        fill: true,
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
        borderColor: 'rgba(155, 89, 182, 1)',
        tension: 0.3,
        pointBackgroundColor: 'rgba(155, 89, 182,1)',
        pointBorderColor: '#fff',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { color: "#B2B2FF" } },
        x: { ticks: { color: "#B2B2FF" } }
      },
      plugins: { legend: { labels: { color: "#B2B2FF" } } }
    }
  });
}

// Load total debt text
async function loadDebtText(logs) {
  const goal = user.sleep_goal || 8;
  const totalDebt = logs.reduce((acc, l) => acc + Math.max(goal - l.total_sleep, 0), 0);
  document.getElementById("debtResult").innerText = `Your total sleep debt: ${totalDebt} hrs`;
}

// Load tips
async function loadTips() {
  try {
    const res = await fetch(`${API}/tip/tips/${user.user_id}`);
    const tips = await res.json();
    document.getElementById("tipResult").innerText = tips.length
      ? tips.map(t => `• ${t.message}`).join("\n")
      : "No tips yet! Sleep well 😉";
  } catch (err) {
    console.error(err);
  }
}

// Init dashboard
async function initDashboard() {
  const logs = await loadLogs();
  await loadDebtText(logs);
  await loadDebtChart(logs);
}

// Kick it off
initDashboard();
loadTips();
