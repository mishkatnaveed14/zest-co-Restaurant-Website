//  ================= Top Navbar Header end ========================

import { db } from "../../firebase.config.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const fallbackOrders = [
  {
    id: "ORD-1092",
    customer: "Ayesha Malik",
    initials: "AM",
    item: "Grilled Chicken",
    amount: 42.5,
    status: "Delivered",
  },
  {
    id: "ORD-1091",
    customer: "Hamza Khan",
    initials: "HK",
    item: "Italian Pizza",
    amount: 28.0,
    status: "Pending",
  },
  {
    id: "ORD-1090",
    customer: "Sara Ahmed",
    initials: "SA",
    item: "Citrus Catch",
    amount: 36.25,
    status: "Delivered",
  },
  {
    id: "ORD-1089",
    customer: "Usman Ali",
    initials: "UA",
    item: "Spring Salad",
    amount: 19.5,
    status: "Cancelled",
  },
  {
    id: "ORD-1088",
    customer: "Maha Noor",
    initials: "MN",
    item: "Beef Burger",
    amount: 24.75,
    status: "Delivered",
  },
  {
    id: "ORD-1087",
    customer: "Zain Abbas",
    initials: "ZA",
    item: "Chicken Pasta",
    amount: 31.2,
    status: "Pending",
  },
];

let orders = [...fallbackOrders];

const chartData = {
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [3100, 4200, 3900, 5100, 4800, 6300, 6900],
    orders: [86, 104, 98, 128, 119, 151, 163],
  },
  month: {
    labels: [
      "1 Jun",
      "5 Jun",
      "10 Jun",
      "15 Jun",
      "20 Jun",
      "25 Jun",
      "30 Jun",
    ],
    revenue: [5200, 6800, 6100, 8700, 7600, 10100, 11400],
    orders: [138, 172, 159, 213, 194, 248, 276],
  },
  quarter: {
    labels: ["Apr W1", "Apr W3", "May W1", "May W3", "Jun W1", "Jun W3"],
    revenue: [19200, 24600, 21800, 28300, 31600, 35800],
    orders: [488, 604, 542, 698, 774, 861],
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const ordersBody = $("#ordersBody");
const emptyState = $("#emptyState");
const searchInput = $("#ordersSearch");
const themeButton = $("#themeToggle");

let showAllOrders = false;
let revenueChart;
let categoryChart;
let ordersChart;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeOrder(documentSnapshot) {
  const data = documentSnapshot.data();
  const customer =
    data.customer || data.customerName || data.name || "Guest customer";
  const amount =
    Number(data.amount ?? data.total ?? data.totalAmount ?? data.price ?? 0) ||
    0;
  const status = String(data.status || "Pending");
  const id = data.orderId || data.id || documentSnapshot.id;
  const customerName =
    typeof customer === "object"
      ? customer.name || customer.fullName || "Guest customer"
      : String(customer);

  return {
    id: String(id).startsWith("ORD-")
      ? String(id)
      : `ORD-${String(id).slice(-6)}`,
    customer: customerName,
    initials:
      customerName
        .split(" ")
        .map((part) => part[0] || "")
        .join("")
        .slice(0, 2)
        .toUpperCase() || "GC",
    item: data.item || data.dish || data.items?.[0]?.name || "Restaurant order",
    amount,
    status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    createdAt: data.createdAt || data.date || data.timestamp || null,
    type: data.type || data.orderType || data.serviceType || "Other",
  };
}

function updateDashboardStats() {
  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0,
  );
  const customers = new Set(orders.map((order) => order.customer.toLowerCase()))
    .size;
  const average = orders.length ? revenue / orders.length : 0;
  const statValues = [
    ["#revenueValue", revenue, "$"],
    ["#ordersValue", orders.length, ""],
    ["#averageValue", average, "$"],
    ["#customersValue", customers, ""],
  ];

  statValues.forEach(([selector, value, prefix]) => {
    const element = $(selector);
    if (!element) return;
    element.dataset.value = String(value);
    element.dataset.prefix = prefix;
    element.textContent = `${prefix}${value.toLocaleString(undefined, {
      minimumFractionDigits: prefix === "$" && !Number.isInteger(value) ? 2 : 0,
      maximumFractionDigits: prefix === "$" && !Number.isInteger(value) ? 2 : 0,
    })}`;
  });

  $("#ordersSummary").textContent =
    `${orders.length} order${orders.length === 1 ? "" : "s"} synced from Firebase`;
}

function loadOrdersFromFirebase() {
  try {
    onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        if (!snapshot.empty) {
          orders = snapshot.docs.map(normalizeOrder);
        }
        updateDashboardStats();
        renderOrders(searchInput.value);
        updateCategoryChart();
      },
      (error) => {
        console.warn(
          "Orders could not be synced from Firebase; using fallback data.",
          error,
        );
        updateDashboardStats();
        renderOrders(searchInput.value);
      },
    );
  } catch (error) {
    console.warn("Firebase orders listener could not start.", error);
    updateDashboardStats();
  }
}

function updateCategoryChart() {
  if (!categoryChart || !orders.length) return;
  const categoryLabels = ["Dine-in", "Delivery", "Takeaway"];
  const categoryCounts = [0, 0, 0];

  orders.forEach((order) => {
    const category = `${order.type || ""} ${order.item || ""}`.toLowerCase();
    if (category.includes("dine") || category.includes("restaurant")) {
      categoryCounts[0] += 1;
    } else if (category.includes("deliver") || category.includes("online")) {
      categoryCounts[1] += 1;
    } else if (category.includes("take") || category.includes("pickup")) {
      categoryCounts[2] += 1;
    }
  });

  if (categoryCounts.every((count) => count === 0)) {
    categoryCounts[0] = 48;
    categoryCounts[1] = 34;
    categoryCounts[2] = 18;
  }

  categoryChart.data.labels = categoryLabels;
  categoryChart.data.datasets[0].data = categoryCounts;
  categoryChart.update();
}

function renderOrders(query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = orders.filter((order) =>
    Object.values(order).some((value) =>
      String(value).toLowerCase().includes(normalizedQuery),
    ),
  );

  const visibleOrders = showAllOrders ? filtered : filtered.slice(0, 4);

  ordersBody.innerHTML = visibleOrders
    .map(
      (order) => `
            <tr>
              <td><strong>${escapeHtml(order.id)}</strong></td>
              <td>
                <div class="customer-cell">
                  <span class="mini-avatar">${escapeHtml(order.initials)}</span>
                  <span>${escapeHtml(order.customer)}</span>
                </div>
              </td>
              <td>${escapeHtml(order.item)}</td>
              <td><strong>$${order.amount.toFixed(2)}</strong></td>
              <td>
                <span class="status ${order.status.toLowerCase()}">
                  ${escapeHtml(order.status)}
                </span>
              </td>
            </tr>
          `,
    )
    .join("");

  emptyState.hidden = visibleOrders.length > 0;
}

function getCssVariable(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function createGradient(context, colorStart, colorEnd) {
  const gradient = context.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
}

function chartColors() {
  return {
    text: getCssVariable("--text-muted"),
    grid: getCssVariable("--chart-grid"),
    gold: getCssVariable("--accent-gold"),
    goldBright: getCssVariable("--accent-gold-bright"),
    danger: getCssVariable("--danger"),
    background: getCssVariable("--card-light-bg"),
  };
}

function buildCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js is unavailable; dashboard charts were skipped.");
    return;
  }

  const colors = chartColors();
  const revenueCanvas = $("#revenueChart");
  const revenueContext = revenueCanvas.getContext("2d");

  Chart.defaults.font.family =
    "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";
  Chart.defaults.color = colors.text;

  revenueChart = new Chart(revenueContext, {
    type: "line",
    data: {
      labels: chartData.month.labels,
      datasets: [
        {
          label: "Revenue",
          data: chartData.month.revenue,
          borderColor: colors.goldBright,
          backgroundColor: createGradient(
            revenueContext,
            "rgba(212, 175, 55, 0.30)",
            "rgba(212, 175, 55, 0.01)",
          ),
          fill: true,
          tension: 0.42,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: colors.goldBright,
        },
        {
          label: "Orders",
          data: chartData.month.orders.map((item) => item * 28),
          borderColor: colors.danger,
          backgroundColor: "transparent",
          tension: 0.42,
          borderWidth: 2,
          borderDash: [6, 5],
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 7,
            boxHeight: 7,
            padding: 18,
          },
        },
        tooltip: {
          backgroundColor: "#121315",
          titleColor: "#fff",
          bodyColor: "#e6e6e6",
          borderColor: "rgba(197, 168, 128, 0.35)",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label(context) {
              if (context.dataset.label === "Revenue") {
                return ` Revenue: $${context.raw.toLocaleString()}`;
              }

              return ` Orders index: ${context.raw.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: colors.grid,
          },
          border: {
            display: false,
          },
          ticks: {
            callback: (value) => `$${value / 1000}k`,
          },
        },
      },
    },
  });

  categoryChart = new Chart($("#categoryChart"), {
    type: "doughnut",
    data: {
      labels: ["Dine-in", "Delivery", "Takeaway"],
      datasets: [
        {
          data: [48, 34, 18],
          backgroundColor: [
            colors.goldBright,
            colors.danger,
            "rgba(197, 168, 128, 0.38)",
          ],
          borderColor: colors.background,
          borderWidth: 5,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 17,
          },
        },
      },
    },
  });

  ordersChart = new Chart($("#ordersChart"), {
    type: "bar",
    data: {
      labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
      datasets: [
        {
          label: "Orders",
          data: [42, 68, 74, 55, 92, 126, 84],
          backgroundColor: [
            "rgba(197, 168, 128, 0.30)",
            "rgba(197, 168, 128, 0.45)",
            "rgba(197, 168, 128, 0.55)",
            "rgba(197, 168, 128, 0.38)",
            colors.gold,
            colors.goldBright,
            "rgba(197, 168, 128, 0.55)",
          ],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 24,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: colors.grid,
          },
          border: {
            display: false,
          },
          ticks: {
            stepSize: 30,
          },
        },
      },
    },
  });
}

function updateChartRange(range) {
  const selected = chartData[range];

  revenueChart.data.labels = selected.labels;
  revenueChart.data.datasets[0].data = selected.revenue;
  revenueChart.data.datasets[1].data = selected.orders.map((item) => item * 28);
  revenueChart.update();

  $$(".range-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.range === range);
  });

  $("#dateFilter").value = range;
}

function updateChartTheme() {
  const colors = chartColors();

  Chart.defaults.color = colors.text;

  [revenueChart, categoryChart, ordersChart].forEach((chart) => {
    if (!chart) return;

    if (chart.options.scales?.x?.grid) {
      chart.options.scales.x.grid.color = colors.grid;
    }

    if (chart.options.scales?.y?.grid) {
      chart.options.scales.y.grid.color = colors.grid;
    }

    chart.update();
  });
}

function animateInterface() {
  if (
    typeof gsap === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const timeline = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  timeline
    .from(".sidebar-brand-wrapper", {
      x: -35,
      duration: 0.6,
    })
    .from(
      ".nav-item",
      {
        x: -22,
        duration: 0.45,
        stagger: 0.055,
      },
      "-=0.3",
    )
    .from(
      ".topbar > *",
      {
        y: -18,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
      },
      "-=0.45",
    )
    .from(
      ".reveal",
      {
        y: 28,
        duration: 0.7,
        stagger: 0.08,
      },
      "-=0.15",
    );

  timeline.set([".reveal", ".nav-item span"], {
    clearProps: "transform,opacity,visibility",
  });

  gsap.from(".progress-bar", {
    scaleX: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.85,
  });

  $$(".stat-value").forEach((element) => {
    const target = Number(element.dataset.value);
    const prefix = element.dataset.prefix || "";
    const counter = { value: 0 };
    const decimals = Number.isInteger(target) ? 0 : 2;

    gsap.to(counter, {
      value: target,
      duration: 1.55,
      delay: 0.35,
      ease: "power2.out",
      onUpdate() {
        element.textContent =
          prefix +
          counter.value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
      },
    });
  });
}

const topbarContext = $(".topbar-context");
const returnToDashboard = () => {
  $("#dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
};
topbarContext?.addEventListener("click", returnToDashboard);
topbarContext?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    returnToDashboard();
  }
});

document.addEventListener("admin:theme-change", () => {
  setTimeout(updateChartTheme, 50);
});

searchInput.addEventListener("input", (event) => {
  renderOrders(event.target.value);

  if (event.target.value.trim()) {
    $("#orders").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
});

$("#viewAllOrders").addEventListener("click", (event) => {
  showAllOrders = !showAllOrders;
  event.currentTarget.textContent = showAllOrders ? "Show less" : "View all";
  renderOrders(searchInput.value);
});

$$(".range-btn").forEach((button) => {
  button.addEventListener("click", () => {
    updateChartRange(button.dataset.range);
  });
});

$("#dateFilter").addEventListener("change", (event) => {
  updateChartRange(event.target.value);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    document.body.classList.remove("mobile-sidebar-open");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (
    localStorage.getItem("restro-theme") === "dark" ||
    localStorage.getItem("zestco-admin-theme") === "dark"
  ) {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("dark");
    if (themeButton) {
      themeButton.innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
  }

  updateDashboardStats();
  renderOrders();
  buildCharts();
  animateInterface();
  loadOrdersFromFirebase();
});
