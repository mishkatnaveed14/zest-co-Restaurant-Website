function readInventoryRows() {
  return [...document.querySelectorAll(".custom-table tbody tr")].map((row) => {
    const cells = row.querySelectorAll("td");
    const status = cells[3]?.textContent.trim().toLowerCase() || "";
    return { status, quantity: Number(cells[4]?.textContent.trim()) || 0 };
  });
}

async function readMenuData() {
  const response = await fetch("../user/menu.html");
  if (!response.ok) throw new Error("Unable to load the public menu");
  const menuDocument = new DOMParser().parseFromString(await response.text(), "text/html");
  return [...menuDocument.querySelectorAll(".dish-item")].map((item) => ({
    name: item.querySelector(".dish-title")?.textContent.trim() || "Dish",
    price: Number((item.querySelector(".current-price")?.textContent || "0").replace(/[^0-9.]/g, "")) || 0
  }));
}

function renderCharts(menuItems, inventoryItems) {
  const stockCounts = inventoryItems.reduce((counts, item) => {
    const key = item.status.includes("out") ? "Out of Stock" : item.status.includes("low") ? "Low Stock" : "In Stock";
    counts[key] += 1;
    return counts;
  }, { "In Stock": 0, "Low Stock": 0, "Out of Stock": 0 });

  document.getElementById("inventoryTotal").textContent = inventoryItems.length;
  document.getElementById("visibleInventoryTotal").textContent = inventoryItems.length;
  document.getElementById("inStockTotal").textContent = stockCounts["In Stock"];
  document.getElementById("lowStockTotal").textContent = stockCounts["Low Stock"];
  document.getElementById("outStockTotal").textContent = stockCounts["Out of Stock"];

  const menuTotal = menuItems.reduce((total, item) => total + item.price, 0);
  document.getElementById("menuValueTotal").textContent = `$${menuTotal.toFixed(2)}`;

  const chartDefaults = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  new Chart(document.getElementById("supplyChart"), {
    type: "line",
    data: { labels: menuItems.map((item) => item.name), datasets: [{ data: menuItems.map((item) => item.price), borderColor: "#c5a880", backgroundColor: "rgba(197, 168, 128, 0.16)", fill: true, tension: 0.35, pointRadius: 2 }] },
    options: { ...chartDefaults, scales: { x: { display: false }, y: { beginAtZero: true, ticks: { callback: (value) => `$${value}` } } } }
  });

  new Chart(document.getElementById("stockChart"), {
    type: "doughnut",
    data: { labels: Object.keys(stockCounts), datasets: [{ data: Object.values(stockCounts), backgroundColor: ["#c5a880", "#e67e22", "#2c3e50"], borderWidth: 0 }] },
    options: { ...chartDefaults, cutout: "68%", plugins: { legend: { display: false } } }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const inventoryItems = readInventoryRows();
  try {
    const menuItems = await readMenuData();
    renderCharts(menuItems, inventoryItems);
  } catch (error) {
    document.getElementById("menuValueTotal").textContent = "Unavailable";
    renderCharts([], inventoryItems);
  }

  // Add subtle entry animations for cards and table rows using GSAP.
  gsap.from(".custom-card", {
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.15,
    ease: "power2.out"
  });

  gsap.from(".custom-table tbody tr", {
    duration: 0.5,
    opacity: 0,
    x: -10,
    stagger: 0.05,
    delay: 0.3,
    ease: "power1.out"
  });
});