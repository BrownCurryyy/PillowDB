const API = "http://localhost:3000";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) window.location.href = "index.html";

document.getElementById("userGreeting").innerText = `Hello, ${user.name}!`;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// Fetch previous logs
async function loadLogs() {
  try {
    const res = await fetch(`${API}/sleep/logs/${user.user_id}`);
    const logs = await res.json();
    const tbody = document.querySelector("#logsTable tbody");
    tbody.innerHTML = "";
    logs.forEach(log => {
      const debt = Math.max(user.sleep_goal - log.total_sleep, 0);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${log.date}</td><td>${log.total_sleep}</td><td>${debt}</td>`;
      tbody.appendChild(tr);
    });
    return logs;
  } catch (err) {
    console.error(err);
  }
}

// Load debt chart
async function loadDebtChart(logs) {
  const ctx = document.getElementById("debtChart").getContext("2d");
  const labels = logs.map(l => l.date);
  const data = logs.map(l => Math.max(user.sleep_goal - l.total_sleep, 0));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sleep Debt (hrs)',
        data,
        fill: true,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: 'rgba(255, 215, 0, 1)',
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { color: "#FFD700" } },
        x: { ticks: { color: "#FFD700" } }
      },
      plugins: { legend: { labels: { color: "#FFD700" } } }
    }
  });
}

// Load debt text
async function loadDebtText(logs) {
  const totalDebt = logs.reduce((acc, l) => acc + Math.max(user.sleep_goal - l.total_sleep, 0), 0);
  document.getElementById("debtResult").innerText = `Your total sleep debt: ${totalDebt} hrs`;
}

// Fetch tips based on user debt
async function loadTips() {
  try {
    const res = await fetch(`${API}/sleep/tips/${user.user_id}`);
    const tips = await res.json();
    const tipText = tips.map(t => `• ${t.message}`).join("\n");
    document.getElementById("tipResult").innerText = tipText;
  } catch (err) {
    console.error(err);
  }
}

// Initialize dashboard
async function initDashboard() {
  const logs = await loadLogs();
  loadDebtText(logs);
  loadDebtChart(logs);
  loadTips();
}

initDashboard();
