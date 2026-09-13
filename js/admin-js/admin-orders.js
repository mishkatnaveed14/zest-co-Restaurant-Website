// Import Firebase ES Modules
import { 
    auth,
    db, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "../../firebase.config.js";
// Temporary Mock Data Array (Jab tak Firestore DB me data na ho)
// Temporary Mock Data Array (Jab tak Firestore DB me data na ho)
const mockOrders = [
    {
        id: "ORD-98214",
        customerName: "Zain Ahmed",
        customerPhone: "+92 300 1234567",
        customerAddress: "House #12, Block B, Gulberg III, Lahore",
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 },
        totalAmount: 38.50,
        items: [
            { name: "Special Karachi Biryani", quantity: 2, price: 12.00 },
            { name: "Chicken Korma", quantity: 1, price: 10.50 },
            { name: "Fresh Salad & Raita", quantity: 2, price: 2.00 }
        ]
    },
    {
        id: "ORD-98215",
        customerName: "Ayesha Khan",
        customerPhone: "+92 321 9876543",
        customerAddress: "Street 5, DHA Phase 5, Lahore",
        paymentMethod: "Credit Card",
        status: "Preparing",
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 1800 },
        totalAmount: 24.00,
        items: [
            { name: "Chicken Tikka Karahi", quantity: 1, price: 18.00 },
            { name: "Garlic Naan", quantity: 3, price: 2.00 }
        ]
    },
    {
        id: "ORD-98216",
        customerName: "Usman Raza",
        customerPhone: "+92 333 4567890",
        customerAddress: "Johar Town, Block R1, Lahore",
        paymentMethod: "Online Banking",
        status: "Delivered",
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 },
        totalAmount: 15.00,
        items: [
            { name: "Kadhi Pakora & Rice", quantity: 2, price: 7.50 }
        ]
    },
    {
        id: "ORD-98217",
        customerName: "Hamza Malik",
        customerPhone: "+92 301 1122334",
        customerAddress: "Model Town, C-Block, Lahore",
        paymentMethod: "Cash on Delivery",
        status: "Cancelled",
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 43200 },
        totalAmount: 22.00,
        items: [
            { name: "Beef Biryani", quantity: 2, price: 11.00 }
        ]
    }
];

// State Variables
let globalOrders = [];
let activeSelectedOrderId = null;
const orderModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));

// DOM Elements
const tableBody = document.getElementById('ordersTableBody');
const searchInput = document.getElementById('orderSearchInput');
const statusFilter = document.getElementById('statusFilter');

// Real-time listener on Firestore Collection
function listenToOrders() {
    const ordersRef = collection(db, "orders");
   
    onSnapshot(ordersRef, (snapshot) => {
        globalOrders = [];
        snapshot.forEach((docSnap) => {
            globalOrders.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });
        // Agar DB khali ho to fallback mock data display karo
        if (globalOrders.length === 0) { 
            globalOrders = [...mockOrders];
            // alert("Mock Data: ", globalOrders);
        }

        updateMetrics(globalOrders);
        renderOrders();
    }, (error) => {
        console.warn("Firestore access error/empty. Displaying mock data array instead.", error);
        globalOrders = [...mockOrders];
        updateMetrics(globalOrders);
        renderOrders();
    });
}

// Render Orders Table
function renderOrders() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterValue = statusFilter.value;

    const filtered = globalOrders.filter(order => {
        const matchesSearch = (order.id && order.id.toLowerCase().includes(searchTerm)) ||
                              (order.customerName && order.customerName.toLowerCase().includes(searchTerm));
        const matchesFilter = filterValue === "All" || order.status === filterValue;
        return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No matching orders found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map(order => {
        const itemCount = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
        const totalAmount = parseFloat(order.totalAmount || 0).toFixed(2);
        const formattedDate = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A';

        return `
            <tr>
                <td class="ps-4 fw-bold">#${order.id.slice(0, 9)}</td>
                <td>
                    <div class="fw-semibold">${order.customerName || 'Guest'}</div>
                    <small class="text-muted">${order.customerPhone || ''}</small>
                </td>
                <td><span class="badge bg-light text-dark border">${itemCount} items</span></td>
                <td class="fw-bold">$${totalAmount}</td>
                <td><span class="badge ${getStatusBadgeClass(order.status)}">${order.status || 'Pending'}</span></td>
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
    }).join('');

    attachRowActionListeners();
}

// Dynamic Status Badge Mapping
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Preparing': return 'badge-preparing';
        case 'Ready': return 'badge-ready';
        case 'Delivered': return 'badge-delivered';
        case 'Cancelled': return 'badge-cancelled';
        default: return 'badge-pending';
    }
}

// Calculate Summary Metrics
function updateMetrics(orders) {
    let pending = 0, preparing = 0, delivered = 0, totalRevenue = 0;

    orders.forEach(o => {
        if (o.status === 'Pending') pending++;
        if (o.status === 'Preparing') preparing++;
        if (o.status === 'Delivered') {
            delivered++;
            totalRevenue += parseFloat(o.totalAmount || 0);
        }
    });

    document.getElementById('statPending').textContent = pending;
    document.getElementById('statPreparing').textContent = preparing;
    document.getElementById('statDelivered').textContent = delivered;
    document.getElementById('statRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

// Event Listeners for Table Buttons
function attachRowActionListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteOrder(btn.dataset.id));
    });
}

// Open Order Details Modal
function openModal(orderId) {
    const order = globalOrders.find(o => o.id === orderId);
    if (!order) return;

    activeSelectedOrderId = orderId;
    document.getElementById('modalOrderId').textContent = `Order #${order.id}`;
    document.getElementById('modalCustomerName').textContent = order.customerName || 'N/A';
    document.getElementById('modalCustomerPhone').textContent = order.customerPhone || 'N/A';
    document.getElementById('modalCustomerAddress').textContent = order.customerAddress || 'N/A';
    document.getElementById('modalOrderDate').textContent = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A';
    document.getElementById('modalPaymentMethod').textContent = order.paymentMethod || 'Cash on Delivery';
    document.getElementById('modalStatusSelect').value = order.status || 'Pending';

    // Populate Item Breakdown Table
    const itemsTable = document.getElementById('modalItemsTableBody');
    if (order.items && order.items.length > 0) {
        itemsTable.innerHTML = order.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end">$${parseFloat(item.price).toFixed(2)}</td>
                <td class="text-end">$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
        `).join('');
    } else {
        itemsTable.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No items found</td></tr>`;
    }

    document.getElementById('modalGrandTotal').textContent = `$${parseFloat(order.totalAmount || 0).toFixed(2)}`;
    orderModal.show();
}

// Update Order Status in Firestore & local state
document.getElementById('saveStatusBtn').addEventListener('click', async () => {
    if (!activeSelectedOrderId) return;

    const newStatus = document.getElementById('modalStatusSelect').value;
    
    // Local Array update (Mock data visual feedback)
    const targetIdx = globalOrders.findIndex(o => o.id === activeSelectedOrderId);
    if (targetIdx !== -1) {
        globalOrders[targetIdx].status = newStatus;
    }

    try {
        const orderDocRef = doc(db, "orders", activeSelectedOrderId);
        await updateDoc(orderDocRef, { status: newStatus });
    } catch (error) {
        console.log("Updated locally in mock state.");
    }

    updateMetrics(globalOrders);
    renderOrders();
    orderModal.hide();
});

// Delete Order
async function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        // Local state update
        globalOrders = globalOrders.filter(o => o.id !== orderId);

        try {
            await deleteDoc(doc(db, "orders", orderId));
        } catch (error) {
            console.log("Deleted locally from mock state.");
        }

        updateMetrics(globalOrders);
        renderOrders();
    }
}

// Search and Filter Handlers
searchInput.addEventListener('input', renderOrders);
statusFilter.addEventListener('change', renderOrders);

// Initialize
listenToOrders();