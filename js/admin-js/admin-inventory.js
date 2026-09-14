import { db } from "../../firebase.config.js";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const inventoryAnimationApi = window.gsap || {
    from: () => {},
    to: () => {}
};

// Dummy Restaurant Data (Using Bootstrap Icon classes)
const defaultInventoryData = [
    { id: 1, name: "Fresh Salmon", icon: "bi-fish", category: "Food Ingredients", status: "Available", qty: 45, maxQty: 50, reorder: 50 },
    { id: 2, name: "Olive Oil", icon: "bi-droplet-half", category: "Food Ingredients", status: "Low", qty: 8, maxQty: 20, reorder: 20 },
    { id: 3, name: "Spaghetti Pasta", icon: "bi-egg-fried", category: "Food Ingredients", status: "Available", qty: 38, maxQty: 40, reorder: 40 },
    { id: 4, name: "Salt", icon: "bi-box-seam", category: "Food Ingredients", status: "Available", qty: 55, maxQty: 60, reorder: 60 },
    { id: 5, name: "Black Pepper", icon: "bi-funnel", category: "Food Ingredients", status: "Available", qty: 15, maxQty: 20, reorder: 20 },
    { id: 6, name: "Butter", icon: "bi-square", category: "Food Ingredients", status: "Available", qty: 40, maxQty: 50, reorder: 50 },
    { id: 7, name: "Chef's Knife", icon: "bi-scissors", category: "Kitchen Tools & Equipment", status: "Available", qty: 5, maxQty: 10, reorder: 10 },
    { id: 8, name: "Cutting Board", icon: "bi-grid-fill", category: "Kitchen Tools & Equipment", status: "Out of Stock", qty: 0, maxQty: 15, reorder: 15 },
    { id: 9, name: "Dishwashing Detergent", icon: "bi-cup-straw", category: "Cleaning Supplies", status: "Available", qty: 25, maxQty: 20, reorder: 20 },
    { id: 10, name: "Mixing Bowls", icon: "bi-circle", category: "Kitchen Tools & Equipment", status: "Available", qty: 12, maxQty: 15, reorder: 15 }
];

let inventoryData = [];

const defaultPurchaseData = [
    { id: "PO-1001", supplier: "Ocean Catch Ltd", category: "Food Ingredients", qty: 50, cost: "$450.00", status: "Completed", date: "2026-09-06" },
    { id: "PO-1002", supplier: "Tuscany Imports", category: "Food Ingredients", qty: 20, cost: "$180.00", status: "Pending", date: "2026-09-08" },
    { id: "PO-1003", supplier: "Kitchenware Co.", category: "Kitchen Tools & Equipment", qty: 10, cost: "$320.00", status: "Pending", date: "2026-09-09" },
    { id: "PO-1004", supplier: "CleanPro Supplies", category: "Cleaning Supplies", qty: 30, cost: "$90.00", status: "Completed", date: "2026-09-02" }
];

let currentView = 'inventory';
let purchaseData = [];
let currentPage = 1;
const rowsPerPage = 5;
let filteredData = [];
let editingInventoryId = null;

document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    initCharts();
    loadInventoryData();
});

async function loadInventoryData() {
    try {
        const inventorySnapshot = await getDocs(collection(db, "inventory"));
        const purchaseSnapshot = await getDocs(collection(db, "purchaseOrders"));

        if (inventorySnapshot.empty) {
            const seededItems = await Promise.all(defaultInventoryData.map(async (item) => {
                const itemReference = await addDoc(collection(db, "inventory"), item);
                return { ...item, id: itemReference.id };
            }));
            inventoryData = seededItems;
        } else {
            inventoryData = inventorySnapshot.docs.map((inventoryDocument) => ({
                id: inventoryDocument.id,
                ...inventoryDocument.data()
            }));
        }

        if (purchaseSnapshot.empty) {
            const seededOrders = await Promise.all(defaultPurchaseData.map(async (order) => {
                await addDoc(collection(db, "purchaseOrders"), order);
                return order;
            }));
            purchaseData = seededOrders;
        } else {
            purchaseData = purchaseSnapshot.docs.map((purchaseDocument) => ({
                firestoreId: purchaseDocument.id,
                ...purchaseDocument.data()
            }));
        }

        switchView('inventory');
        animateDashboardEntrance();
    } catch (error) {
        console.error("Unable to load inventory from Firebase:", error);
        const errorCode = error.code ? ` (${error.code})` : "";
        alert(`Inventory could not be loaded${errorCode}: ${error.message}`);
        switchView('inventory');
        animateDashboardEntrance();
    }
}

// GSAP Page Entrance Animation
function animateDashboardEntrance() {
    inventoryAnimationApi.from(".chart-card", {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out"
    });

    inventoryAnimationApi.from(".data-section", {
        duration: 0.8,
        y: 40,
        opacity: 0,
        delay: 0.3,
        ease: "power2.out"
    });
}

function setupEventListeners() {
    document.getElementById('btn-inventory').addEventListener('click', () => switchView('inventory'));
    document.getElementById('btn-purchase').addEventListener('click', () => switchView('purchase'));
    document.getElementById('sidebarInventoryLink').addEventListener('click', (event) => {
        event.preventDefault();
        switchView('inventory');
    });
    document.getElementById('sidebarPurchaseLink').addEventListener('click', (event) => {
        event.preventDefault();
        switchView('purchase');
    });

    document.getElementById('searchInput').addEventListener('keyup', handleFilter);
    document.getElementById('categoryFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);

    // Modal Control Events with GSAP
    const modal = document.getElementById('productModal');
    const modalCard = document.getElementById('modalCard');

    function openModal() {
        const isInventory = currentView === 'inventory';
        document.getElementById('modalTitle').innerText = editingInventoryId === null
            ? (isInventory ? 'Add New Product' : 'Create Purchase Order')
            : 'Update Stock';
        document.getElementById('itemName').previousElementSibling.innerText = isInventory ? 'Item Name' : 'Supplier';
        document.getElementById('itemName').placeholder = isInventory ? 'e.g. Fresh Salmon' : 'e.g. Ocean Catch Ltd';
        document.getElementById('itemQtyLabel').innerText = 'Quantity';
        document.getElementById('itemMaxLabel').innerText = isInventory ? 'Reorder Point' : 'Reference Number';
        document.getElementById('itemMax').placeholder = isInventory ? 'e.g. 50' : 'Optional';
        document.getElementById('purchaseDetails').hidden = isInventory;
        document.getElementById('itemCost').required = !isInventory;
        document.getElementById('itemDate').required = !isInventory;
        if (!isInventory) {
            document.getElementById('itemDate').value = new Date().toISOString().split('T')[0];
        }
        modal.style.display = 'flex';
        
        inventoryAnimationApi.to(modal, { duration: 0.3, opacity: 1 });
        inventoryAnimationApi.to(modalCard, { duration: 0.4, scale: 1, ease: "back.out(1.7)" });
    }

    function closeModal() {
        inventoryAnimationApi.to(modalCard, { duration: 0.2, scale: 0.9, ease: "power2.in" });
        inventoryAnimationApi.to(modal, {
            duration: 0.2,
            opacity: 0,
            onComplete: () => {
                modal.style.display = 'none';
            }
        });
    }

    document.getElementById('actionButton').addEventListener('click', () => {
        editingInventoryId = null;
        openModal();
    });
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

    window.openStockEditor = (itemId) => {
        const item = inventoryData.find((inventoryItem) => String(inventoryItem.id) === String(itemId));
        if (!item) return;
        editingInventoryId = itemId;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemQty').value = item.qty;
        document.getElementById('itemMax').value = item.reorder;
        document.getElementById('itemStatus').value = item.status;
        openModal();
    };

    const detailsModal = document.getElementById('detailsModal');
    const closeDetails = () => {
        detailsModal.style.display = 'none';
        detailsModal.style.opacity = '0';
    };

    window.openPurchaseDetails = (orderId) => {
        const order = purchaseData.find((purchaseOrder) => purchaseOrder.id === orderId);
        if (!order) return;
        document.getElementById('detailsContent').innerHTML = `
            <div class="form-group"><label>Order ID</label><div>${order.id}</div></div>
            <div class="form-group"><label>Supplier</label><div>${order.supplier}</div></div>
            <div class="form-group"><label>Category</label><div>${order.category}</div></div>
            <div class="form-group"><label>Quantity</label><div>${order.qty}</div></div>
            <div class="form-group"><label>Total Cost</label><div>${order.cost}</div></div>
            <div class="form-group"><label>Status</label><div>${order.status}</div></div>
            <div class="form-group"><label>Order Date</label><div>${order.date}</div></div>
        `;
        detailsModal.style.display = 'flex';
        detailsModal.style.opacity = '1';
    };

    document.getElementById('closeDetailsBtn').addEventListener('click', closeDetails);
    document.getElementById('closeDetailsFooterBtn').addEventListener('click', closeDetails);

    // Handle Modal Form Submission
    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const qty = parseInt(document.getElementById('itemQty').value) || 0;
        const maxQty = parseInt(document.getElementById('itemMax').value) || 50;
        const status = document.getElementById('itemStatus').value;
        const cost = parseFloat(document.getElementById('itemCost').value) || 0;
        const date = document.getElementById('itemDate').value || new Date().toISOString().split('T')[0];

        try {
            if (currentView === 'inventory' && editingInventoryId !== null) {
                const item = inventoryData.find((inventoryItem) => String(inventoryItem.id) === String(editingInventoryId));
                if (item) {
                    item.qty = qty;
                    item.reorder = maxQty;
                    item.maxQty = maxQty;
                    item.status = status;
                    await updateDoc(doc(db, "inventory", item.id), {
                        qty,
                        reorder: maxQty,
                        maxQty,
                        status
                    });
                }
            } else if (currentView === 'inventory') {
                const newItem = {
                    name: name,
                    icon: "bi-box-seam",
                    category: category,
                    status: status,
                    qty: qty,
                    maxQty: maxQty,
                    reorder: maxQty
                };
                const itemReference = await addDoc(collection(db, "inventory"), newItem);
                inventoryData.unshift({ ...newItem, id: itemReference.id });
            } else {
                const newPurchaseOrder = {
                    id: "PO-" + Math.floor(1000 + Math.random() * 9000),
                    supplier: name,
                    category: category,
                    qty: qty,
                    cost: "$" + cost.toFixed(2),
                    status: status,
                    date: date
                };
                const orderReference = await addDoc(collection(db, "purchaseOrders"), newPurchaseOrder);
                purchaseData.unshift({ ...newPurchaseOrder, firestoreId: orderReference.id });
            }

            closeModal();
            document.getElementById('productForm').reset();
            editingInventoryId = null;
            handleFilter();
        } catch (error) {
            console.error("Unable to save item to Firebase:", error);
            const errorCode = error.code ? ` (${error.code})` : "";
            alert(`The item could not be saved${errorCode}: ${error.message}`);
        }
    });
}

function switchView(view) {
    currentView = view;
    currentPage = 1;

    document.getElementById('btn-inventory').classList.toggle('active', view === 'inventory');
    document.getElementById('btn-purchase').classList.toggle('active', view === 'purchase');
    document.getElementById('sidebarInventoryLink').classList.toggle('active', view === 'inventory');
    document.getElementById('sidebarPurchaseLink').classList.toggle('active', view === 'purchase');
    document.getElementById('actionButtonText').innerText = view === 'inventory' ? 'Add Product' : 'Create Order';

    const headRow = document.getElementById('tableHeadRow');
    if (view === 'inventory') {
        headRow.innerHTML = `
            <th>Item</th>
            <th>Category</th>
            <th>Status</th>
            <th>Qty In Stock</th>
            <th>Reorder Point</th>
            <th>Action</th>
        `;
    } else {
        headRow.innerHTML = `
            <th>Order ID</th>
            <th>Supplier</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Action</th>
        `;
    }

    handleFilter();
}

function handleFilter() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const categoryValue = document.getElementById('categoryFilter').value;
    const statusValue = document.getElementById('statusFilter').value;

    const dataSource = currentView === 'inventory' ? inventoryData : purchaseData;

    filteredData = dataSource.filter(item => {
        const nameMatch = currentView === 'inventory' 
            ? item.name.toLowerCase().includes(searchValue) 
            : (item.id.toLowerCase().includes(searchValue) || item.supplier.toLowerCase().includes(searchValue));
        
        const categoryMatch = categoryValue === 'all' || item.category === categoryValue;
        const statusMatch = statusValue === 'all' || item.status.toLowerCase() === statusValue.toLowerCase();

        return nameMatch && categoryMatch && statusMatch;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const paginatedData = filteredData.slice(startIdx, endIdx);

    if (paginatedData.length === 0) {
        const columnCount = currentView === 'inventory' ? 6 : 8;
        tableBody.innerHTML = `<tr><td colspan="${columnCount}" class="empty-cell">No items found.</td></tr>`;
    } else {
        paginatedData.forEach(item => {
            const row = document.createElement('tr');

            if (currentView === 'inventory') {
                const percentage = Math.min(Math.round((item.qty / item.maxQty) * 100), 100);
                let barColor = 'var(--status-available)';
                if (item.status === 'Low') barColor = 'var(--status-low)';
                if (item.status === 'Out of Stock') barColor = 'var(--status-out)';

                row.innerHTML = `
                    <td>
                        <div class="item-cell">
                            <div class="item-icon"><i class="bi ${item.icon}"></i></div>
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>${item.category}</td>
                    <td>
                        <span class="status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}">
                            <span class="dot"></span> ${item.status}
                        </span>
                    </td>
                    <td>
                        <div class="level-bar-container">
                            <div class="level-bar-fill" style="width: ${percentage}%; background-color: ${barColor}"></div>
                        </div>
                        ${item.qty}
                    </td>
                    <td>${item.reorder}</td>
                    <td><button class="action-btn" onclick="openStockEditor('${item.id}')">Update Stock</button></td>
                `;
            } else {
                row.innerHTML = `
                    <td><b>${item.id}</b></td>
                    <td>${item.supplier}</td>
                    <td>${item.category}</td>
                    <td>${item.qty}</td>
                    <td><b>${item.cost}</b></td>
                    <td>
                        <span class="status-badge ${item.status.toLowerCase()}">
                            <span class="dot"></span> ${item.status}
                        </span>
                    </td>
                    <td>${item.date}</td>
                    <td><button class="action-btn" onclick="openPurchaseDetails('${item.id}')">View Details</button></td>
                `;
            }
            tableBody.appendChild(row);
        });

        // GSAP Table Row Stagger Animation on render
        inventoryAnimationApi.from("#tableBody tr", {
            duration: 0.4,
            opacity: 0,
            x: -15,
            stagger: 0.05,
            ease: "power1.out"
        });
    }

    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById('paginationControls');
    const infoContainer = document.getElementById('paginationInfo');
    paginationContainer.innerHTML = '';

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;

    const startIdx = totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const endIdx = Math.min(currentPage * rowsPerPage, totalEntries);
    infoContainer.innerText = `Showing ${startIdx} to ${endIdx} of ${totalEntries} entries`;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; renderTable(); };
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.innerText = i;
        pageBtn.onclick = () => { currentPage = i; renderTable(); };
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; renderTable(); };
    paginationContainer.appendChild(nextBtn);
}

// Chart.js Setup
function initCharts() {
    if (typeof Chart === 'undefined') return;

    const supplyCtx = document.getElementById('supplyOverviewChart').getContext('2d');
    const supplyChart = new Chart(supplyCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Supply',
                data: [120, 190, 150, 220, 180, 250],
                borderColor: '#C5A880',
                backgroundColor: 'rgba(197, 168, 128, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    const stockCtx = document.getElementById('stockLevelChart').getContext('2d');
    const stockChart = new Chart(stockCtx, {
        type: 'bar',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [120, 55, 30],
                backgroundColor: ['#D4AF37', '#F59E0B', '#1E1F22']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

        const supplyRanges = {
            months: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [120, 190, 150, 220, 180, 250],
                total: '1,654'
            },
            days: {
                labels: ['Days 1-7', 'Days 8-14', 'Days 15-21', 'Days 22-30'],
                values: [310, 385, 420, 539],
                total: '1,654'
            }
        };

        const stockRanges = {
            month: { values: [120, 55, 30] },
            week: { values: [68, 22, 10] }
        };

        document.getElementById('supplyRange').addEventListener('change', (event) => {
            const range = supplyRanges[event.target.value];
            supplyChart.data.labels = range.labels;
            supplyChart.data.datasets[0].data = range.values;
            document.getElementById('supplyMetric').innerText = range.total;
            supplyChart.update();
        });

        document.getElementById('stockRange').addEventListener('change', (event) => {
            const values = stockRanges[event.target.value].values;
            stockChart.data.datasets[0].data = values;
            document.getElementById('stockMetric').innerText = values.reduce((total, value) => total + value, 0);
            document.getElementById('inStockMetric').innerText = values[0];
            document.getElementById('lowStockMetric').innerText = values[1];
            document.getElementById('outStockMetric').innerText = values[2];
            stockChart.update();
        });
}