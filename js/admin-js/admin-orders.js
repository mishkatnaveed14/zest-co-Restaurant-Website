// Import Firebase ES Modules
import {
  db,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "../../firebase.config.js";

// 10 Detailed Mock Orders Array
const mockOrders = [
  {
    id: "ORD-98214",
    customerName: "Zain Ahmed",
    customerPhone: "+92 300 1234567",
    customerAddress: "House #12, Block B, Gulberg III, Lahore",
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 1800 },
    totalAmount: 26.0,
    items: [
      { name: "Special Karachi Biryani", quantity: 2, price: 12.0 },
      { name: "Fresh Salad & Raita", quantity: 1, price: 2.0 },
    ],
  },
  {
    id: "ORD-98215",
    customerName: "Ayesha Khan",
    customerPhone: "+92 321 9876543",
    customerAddress: "Street 5, DHA Phase 5, Lahore",
    paymentMethod: "Credit Card",
    status: "Preparing",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 },
    totalAmount: 24.0,
    items: [
      { name: "Chicken Tikka Karahi", quantity: 1, price: 18.0 },
      { name: "Garlic Naan", quantity: 3, price: 2.0 },
    ],
  },
  {
    id: "ORD-98216",
    customerName: "Usman Raza",
    customerPhone: "+92 333 4567890",
    customerAddress: "Johar Town, Block R1, Lahore",
    paymentMethod: "Online Banking",
    status: "Delivered",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 7200 },
    totalAmount: 15.0,
    items: [{ name: "Kadhi Pakora & Rice", quantity: 2, price: 7.5 }],
  },
  {
    id: "ORD-98217",
    customerName: "Hamza Malik",
    customerPhone: "+92 301 1122334",
    customerAddress: "Model Town, C-Block, Lahore",
    paymentMethod: "Cash on Delivery",
    status: "Cancelled",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 10800 },
    totalAmount: 22.0,
    items: [{ name: "Chicken Korma", quantity: 2, price: 11.0 }],
  },
  {
    id: "ORD-98218",
    customerName: "Sara Bilal",
    customerPhone: "+92 312 5554433",
    customerAddress: "Faisal Town, Main Boulevard, Lahore",
    paymentMethod: "Credit Card",
    status: "Ready",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 14400 },
    totalAmount: 31.5,
    items: [
      { name: "Special Karachi Biryani", quantity: 2, price: 12.0 },
      { name: "Chicken Korma", quantity: 1, price: 7.5 },
    ],
  },
  {
    id: "ORD-98219",
    customerName: "Bilal Tariq",
    customerPhone: "+92 345 8889900",
    customerAddress: "Garden Town, Block A, Lahore",
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 18000 },
    totalAmount: 18.0,
    items: [
      { name: "Beef Pasanda", quantity: 1, price: 15.0 },
      { name: "Roti", quantity: 3, price: 1.0 },
    ],
  },
  {
    id: "ORD-98220",
    customerName: "Fatima Hassan",
    customerPhone: "+92 302 7776655",
    customerAddress: "Cavalry Ground, Street 3, Lahore",
    paymentMethod: "Online Banking",
    status: "Preparing",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 21600 },
    totalAmount: 40.0,
    items: [
      { name: "Mutton Karahi", quantity: 1, price: 32.0 },
      { name: "Garlic Naan", quantity: 4, price: 2.0 },
    ],
  },
  {
    id: "ORD-98221",
    customerName: "Omer Farooq",
    customerPhone: "+92 323 1112233",
    customerAddress: "Askari 11, Sector B, Lahore",
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 25200 },
    totalAmount: 12.5,
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 10.5 },
      { name: "Fresh Salad & Raita", quantity: 1, price: 2.0 },
    ],
  },
  {
    id: "ORD-98222",
    customerName: "Mahnoor Ali",
    customerPhone: "+92 334 9998877",
    customerAddress: "Wapda Town, Block H, Lahore",
    paymentMethod: "Credit Card",
    status: "Delivered",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 28800 },
    totalAmount: 27.0,
    items: [
      { name: "Kadhi Pakora & Rice", quantity: 2, price: 7.5 },
      { name: "Special Karachi Biryani", quantity: 1, price: 12.0 },
    ],
  },
  {
    id: "ORD-98223",
    customerName: "Ali Raza",
    customerPhone: "+92 315 4443322",
    customerAddress: "Iqbal Town, Moon Market, Lahore",
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 32400 },
    totalAmount: 19.5,
    items: [
      { name: "Chicken Korma", quantity: 1, price: 10.5 },
      { name: "Garlic Naan", quantity: 3, price: 2.0 },
      { name: "Fresh Salad & Raita", quantity: 1, price: 3.0 },
    ],
  },
];
// document.getElementById('themeToggle').addEventListener('click', () => {
//     document.body.classList.toggle('dark-theme');
// });
// Global Cache & State
let globalOrders = [];
let activeSelectedOrderId = null;
let trendChartInstance = null;
let statusChartInstance = null;
let liveMoveInterval = null;

// Pagination State
let currentPage = 1;
const itemsPerPage = 5;

// DOM Elements
const tableBody = document.getElementById("ordersTableBody");
const searchInput = document.getElementById("orderSearchInput");
const statusFilter = document.getElementById("statusFilter");
const paginationControls = document.getElementById("paginationControls");
const paginationInfo = document.getElementById("paginationInfo");
const orderModalElement = document.getElementById("orderDetailsModal");
const orderModal = orderModalElement
  ? new bootstrap.Modal(orderModalElement)
  : null;

// Fast Listening & Deferred Chart Generation
function listenToOrders() {
  const ordersRef = collection(db, "orders");

  onSnapshot(
    ordersRef,
    (snapshot) => {
      const freshOrders = [];
      snapshot.forEach((docSnap) => {
        freshOrders.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      // Use mock data if Firestore is empty
      globalOrders = freshOrders.length > 0 ? freshOrders : [...mockOrders];

      updateMetrics(globalOrders);
      renderOrders();

      requestAnimationFrame(() => {
        setTimeout(() => {
          initMovingCharts(globalOrders);
        }, 50);
      });
    },
    (error) => {
      console.warn(
        "Firestore access error/empty. Using mock orders instead.",
        error,
      );
      globalOrders = [...mockOrders];
      updateMetrics(globalOrders);
      renderOrders();

      requestAnimationFrame(() => {
        setTimeout(() => {
          initMovingCharts(globalOrders);
        }, 50);
      });
    },
  );
}

// Calculate Summary Metrics
function updateMetrics(orders) {
  let pending = 0,
    preparing = 0,
    delivered = 0,
    totalRevenue = 0;

  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    if (o.status === "Pending") pending++;
    else if (o.status === "Preparing") preparing++;
    else if (o.status === "Delivered") {
      delivered++;
      totalRevenue += parseFloat(o.totalAmount || 0);
    }
  }

  document.getElementById("statPending").textContent = pending;
  document.getElementById("statPreparing").textContent = preparing;
  document.getElementById("statDelivered").textContent = delivered;
  document.getElementById("statRevenue").textContent =
    `$${totalRevenue.toFixed(2)}`;
}

// Table Render with Pagination Logic
function renderOrders() {
  const searchTerm = searchInput?.value.toLowerCase().trim() || "";
  const filterValue = statusFilter?.value || "All";

  const filtered = globalOrders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      (order.id && order.id.toLowerCase().includes(searchTerm)) ||
      (order.customerName &&
        order.customerName.toLowerCase().includes(searchTerm));
    const matchesFilter = filterValue === "All" || order.status === filterValue;
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No matching orders found.</td></tr>`;
    if (paginationInfo) paginationInfo.textContent = "Showing 0 of 0 orders";
    if (paginationControls) paginationControls.innerHTML = "";
    return;
  }

  // Calculate Pagination Boundaries
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const paginatedOrders = filtered.slice(startIndex, endIndex);

  // Render Table Rows
  tableBody.innerHTML = paginatedOrders
    .map((order) => {
      const itemCount = order.items
        ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
        : 0;
      const totalAmount = parseFloat(order.totalAmount || 0).toFixed(2);
      const formattedDate = order.createdAt
        ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

      return `
            <tr>
                <td class="ps-4 fw-bold">#${order.id.slice(0, 9)}</td>
                <td>
                    <div class="fw-semibold">${order.customerName || "Guest"}</div>
                    <small class="text-muted">${order.customerPhone || ""}</small>
                </td>
                <td><span class="badge bg-light text-dark border">${itemCount} items</span></td>
                <td class="fw-bold">$${totalAmount}</td>
                <td><span class="badge ${getStatusBadgeClass(order.status)}">${order.status || "Pending"}</span></td>
                <td><small class="text-muted">${formattedDate}</small></td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-secondary me-1 view-btn" data-id="${order.id}" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${order.id}" title="Delete Order">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  renderPaginationControls(filtered.length, totalPages, startIndex, endIndex);
  attachRowActionListeners();
}

// Render Pagination Controls UI
function renderPaginationControls(
  totalItems,
  totalPages,
  startIndex,
  endIndex,
) {
  if (paginationInfo) {
    paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalItems} orders`;
  }

  if (!paginationControls) return;

  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  let buttonsHTML = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <button class="page-link" data-page="${currentPage - 1}">Previous</button>
        </li>
    `;

  for (let p = 1; p <= totalPages; p++) {
    buttonsHTML += `
            <li class="page-item ${p === currentPage ? "active" : ""}">
                <button class="page-link" data-page="${p}">${p}</button>
            </li>
        `;
  }

  buttonsHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <button class="page-link" data-page="${currentPage + 1}">Next</button>
        </li>
    `;

  paginationControls.innerHTML = buttonsHTML;

  // Attach Pagination Button Click Handler
  paginationControls.querySelectorAll(".page-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const pageNum = parseInt(e.target.dataset.page);
      if (
        pageNum &&
        pageNum !== currentPage &&
        pageNum >= 1 &&
        pageNum <= totalPages
      ) {
        currentPage = pageNum;
        renderOrders();
      }
    });
  });
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Preparing":
      return "badge-preparing";
    case "Ready":
      return "badge-ready";
    case "Delivered":
      return "badge-delivered";
    case "Cancelled":
      return "badge-cancelled";
    default:
      return "badge-pending";
  }
}

// Dynamic Canvas Background Plugin
const chartBackgroundPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    // Fallback based on dark-theme class on body
    const isDark = document.body.classList.contains("dark-theme") || document.body.classList.contains("dark");
    ctx.fillStyle = options.color || (isDark ? '#1e293b' : '#ffffff');
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

// Animated & Moving Chart Rendering Setup
function initMovingCharts(orders) {
  const statusCounts = {
    Pending: 0,
    Preparing: 0,
    Ready: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  orders.forEach((o) => {
    if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
  });

  if (statusChartInstance) statusChartInstance.destroy();
  if (trendChartInstance) trendChartInstance.destroy();
  if (liveMoveInterval) clearInterval(liveMoveInterval);

  const ctxStatus = document.getElementById("ordersStatusChart");
  const ctxTrend = document.getElementById("ordersTrendChart");

  if (!ctxStatus || !ctxTrend) return;

  // Dark Mode Dynamic State Evaluation
  const isDarkMode = document.body.classList.contains("dark-theme");
  const textColor = isDarkMode ? "#cbd5e1" : "#4b5563";
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
  const doughnutBorder = isDarkMode ? "#1e293b" : "#ffffff";
  const areaFillColor = isDarkMode ? "rgba(212, 175, 55, 0.25)" : "rgba(212, 175, 55, 0.15)";
  const chartBg = isDarkMode ? "#1e293b" : "#ffffff";

  // 1. Doughnut Chart
  statusChartInstance = new Chart(ctxStatus.getContext("2d"), {
    type: "doughnut",
    plugins: [chartBackgroundPlugin],
    data: {
      labels: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            "#f59e0b",
            "#06b6d4",
            "#8b5cf6",
            "#10b981",
            "#ef4444",
          ],
          borderWidth: 2,
          borderColor: doughnutBorder,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      plugins: {
        customCanvasBackgroundColor: { color: chartBg },
        legend: {
          position: "bottom",
          labels: { color: textColor }
        }
      },
      cutout: "70%",
    },
  });

  // Initial Time-Series Moving Data
  const initialLabels = [
    "12:00",
    "12:05",
    "12:10",
    "12:15",
    "12:20",
    "12:25",
    "12:30",
  ];
  const initialValues = [8, 14, 10, 18, 22, 19, orders.length];

  // 2. Animated Line Chart (Moving Effect)
  trendChartInstance = new Chart(ctxTrend.getContext("2d"), {
    type: "line",
    plugins: [chartBackgroundPlugin],
    data: {
      labels: initialLabels,
      datasets: [
        {
          label: "Realtime Orders",
          data: initialValues,
          borderColor: "#d4af37",
          backgroundColor: areaFillColor,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#d4af37",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: "linear",
      },
      plugins: {
        customCanvasBackgroundColor: { color: chartBg },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: textColor },
          grid: { display: false }
        },
      },
    },
  });

  // Chart Shift Loop
  liveMoveInterval = setInterval(() => {
    if (!trendChartInstance) return;

    const now = new Date();
    const timeLabel = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    const nextValue = Math.floor(Math.random() * 8) + (orders.length || 5);

    trendChartInstance.data.labels.shift();
    trendChartInstance.data.labels.push(timeLabel);

    trendChartInstance.data.datasets[0].data.shift();
    trendChartInstance.data.datasets[0].data.push(nextValue);

    trendChartInstance.update("active");
  }, 3000);
}

// Event Delegation for Table Row Actions
function attachRowActionListeners() {
  tableBody.onclick = (e) => {
    const viewBtn = e.target.closest(".view-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (viewBtn) openModal(viewBtn.dataset.id);
    if (deleteBtn) deleteOrder(deleteBtn.dataset.id);
  };
}

// Open Order Details Modal
function openModal(orderId) {
  const order = globalOrders.find((o) => o.id === orderId);
  if (!order || !orderModal) return;

  activeSelectedOrderId = orderId;
  document.getElementById("modalOrderId").textContent = `Order #${order.id}`;
  document.getElementById("modalCustomerName").textContent =
    order.customerName || "N/A";
  document.getElementById("modalCustomerPhone").textContent =
    order.customerPhone || "N/A";
  document.getElementById("modalCustomerAddress").textContent =
    order.customerAddress || "N/A";
  document.getElementById("modalOrderDate").textContent = order.createdAt
    ? new Date(order.createdAt.seconds * 1000).toLocaleString()
    : "N/A";
  document.getElementById("modalPaymentMethod").textContent =
    order.paymentMethod || "Cash on Delivery";
  document.getElementById("modalStatusSelect").value =
    order.status || "Pending";

  const itemsTable = document.getElementById("modalItemsTableBody");
  if (order.items && order.items.length > 0) {
    itemsTable.innerHTML = order.items
      .map(
        (item) => `
            <tr>
                <td>${item.name}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end">$${parseFloat(item.price).toFixed(2)}</td>
                <td class="text-end">$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
        `,
      )
      .join("");
  } else {
    itemsTable.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No items found</td></tr>`;
  }

  document.getElementById("modalGrandTotal").textContent =
    `$${parseFloat(order.totalAmount || 0).toFixed(2)}`;
  orderModal.show();
}

// Save Status Action
document.getElementById("saveStatusBtn").addEventListener("click", async () => {
  if (!activeSelectedOrderId) return;
  const newStatus = document.getElementById("modalStatusSelect").value;

  const idx = globalOrders.findIndex((o) => o.id === activeSelectedOrderId);
  if (idx !== -1) {
    globalOrders[idx].status = newStatus;
  }

  try {
    const orderDocRef = doc(db, "orders", activeSelectedOrderId);
    await updateDoc(orderDocRef, { status: newStatus });
  } catch (error) {
    console.log("Updated locally in mock state.");
  }

  updateMetrics(globalOrders);
  renderOrders();
  initMovingCharts(globalOrders);
  orderModal.hide();
});

// Delete Order Action
async function deleteOrder(orderId) {
  if (confirm("Are you sure you want to delete this order?")) {
    globalOrders = globalOrders.filter((o) => o.id !== orderId);

    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      console.log("Deleted locally from mock state.");
    }

    updateMetrics(globalOrders);
    renderOrders();
    initMovingCharts(globalOrders);
  }
}

// Debounced Search Filter
let debounceTimer;
searchInput?.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage = 1;
    renderOrders();
  }, 200);
});

statusFilter?.addEventListener("change", () => {
  currentPage = 1;
  renderOrders();
});
// Window event listener for dynamic theme re-rendering
window.addEventListener('themeChanged', () => {
  if (globalOrders && globalOrders.length > 0) {
    initMovingCharts(globalOrders);
  }
});

// Also trigger re-render on direct theme button click
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    setTimeout(() => {
      if (globalOrders && globalOrders.length > 0) {
        initMovingCharts(globalOrders);
      }
    }, 50);
  });
}
// Initialize Page Load Execution
listenToOrders();
