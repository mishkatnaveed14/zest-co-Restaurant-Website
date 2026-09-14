// Import firesbase config and necessary Firestore functions
import {
  auth,
  db,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "../../firebase.config.js";

// Mock Reviews Fallback Data
const mockReviews = [
  {
    id: "REV-101",
    customerName: "Saima Farooq",
    rating: 5,
    dishOrdered: "Karachi Chicken Biryani",
    comment:
      "Absolute perfection! The biryani was incredibly rich in spices and arrived piping hot. Served with fresh green chutney raita. Will definitely order again!",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 7200 },
    status: "Approved",
    adminReply:
      "Thank you so much Saima! We are delighted to hear you enjoyed our special biryani!",
  },
  {
    id: "REV-102",
    customerName: "Bilal Sheikh",
    rating: 4,
    dishOrdered: "Spicy Chicken Korma",
    comment:
      "Great food overall. The korma was delicious with fresh naans. Slight delay in delivery by 10 minutes though.",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 },
    status: "Approved",
    adminReply: null,
  },
  {
    id: "REV-103",
    customerName: "Hira Tariq",
    rating: 5,
    dishOrdered: "Kadhi Pakora & Rice",
    comment:
      "The pakodas were amazingly crispy and delicious! Tasted like authentic homemade food.",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 172800 },
    status: "Approved",
    adminReply: null,
  },
  {
    id: "REV-104",
    customerName: "Hamza Rehman",
    rating: 2,
    dishOrdered: "Beef Tikka",
    comment:
      "Food was warm but spice level was far lower than requested. Expected it to be much spicier.",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 259200 },
    status: "Pending",
    adminReply: null,
  },
];

// State
let globalReviews = [];
let activeStarFilter = "All";
let activeSelectedReviewId = null;
const replyModal = new bootstrap.Modal(document.getElementById("replyModal"));

// DOM Elements
const reviewsContainer = document.getElementById("reviewsContainer");
const searchInput = document.getElementById("reviewSearchInput");
const statusFilter = document.getElementById("statusFilter");

// Page Entrance Animations with GSAP
function runEntranceAnimations() {
  gsap.from(".gsap-stat", {
    duration: 0.6,
    y: 20,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
  });

  gsap.from(".gsap-filter", {
    duration: 0.5,
    y: 15,
    opacity: 0,
    delay: 0.3,
    ease: "power1.out",
  });
}

// Real-time Firestore Listener
function listenToReviews() {
  const reviewsRef = collection(db, "reviews");

  onSnapshot(
    reviewsRef,
    (snapshot) => {
      globalReviews = [];
      snapshot.forEach((docSnap) => {
        globalReviews.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      if (globalReviews.length === 0) {
        globalReviews = [...mockReviews];
      }

      updateMetrics(globalReviews);
      renderReviews();
    },
    (error) => {
      console.warn(
        "Firestore access offline/empty. Rendering mock data array.",
        error,
      );
      globalReviews = [...mockReviews];
      updateMetrics(globalReviews);
      renderReviews();
    },
  );
}

// Calculate Summary Metrics
function updateMetrics(reviews) {
  if (reviews.length === 0) return;

  const total = reviews.length;
  const avg = (
    reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / total
  ).toFixed(1);
  const positive = reviews.filter((r) => r.rating >= 4).length;
  const pendingReply = reviews.filter((r) => !r.adminReply).length;

  document.getElementById("statAvgRating").textContent = avg;
  document.getElementById("statTotalReviews").textContent = total;
  document.getElementById("statPositiveCount").textContent = positive;
  document.getElementById("statPendingReply").textContent = pendingReply;
}

// Render Review Cards
function renderReviews() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const statusVal = statusFilter.value;

  const filtered = globalReviews.filter((rev) => {
    const matchesSearch =
      (rev.customerName &&
        rev.customerName.toLowerCase().includes(searchTerm)) ||
      (rev.comment && rev.comment.toLowerCase().includes(searchTerm)) ||
      (rev.dishOrdered && rev.dishOrdered.toLowerCase().includes(searchTerm));
    const matchesStar =
      activeStarFilter === "All" || rev.rating == activeStarFilter;
    const matchesStatus = statusVal === "All" || rev.status === statusVal;

    return matchesSearch && matchesStar && matchesStatus;
  });

  if (filtered.length === 0) {
    reviewsContainer.innerHTML = `
            <div class="col-12 text-center py-5 text-muted">
                <i class="bi bi-chat-square-x fs-1 d-block mb-2 text-warning"></i>
                <p class="mb-0">No matching customer reviews found.</p>
            </div>
        `;
    return;
  }

  reviewsContainer.innerHTML = filtered
    .map((rev) => {
      const dateStr = rev.createdAt
        ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString()
        : "N/A";
      const starsHtml = Array.from(
        { length: 5 },
        (_, i) => `
            <i class="bi bi-star-fill ${i < rev.rating ? "text-warning" : "text-muted opacity-25"}"></i>
        `,
      ).join("");

      return `
            <div class="col-12 col-lg-6">
                <div class="review-card gsap-review-item">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar-circle">${rev.customerName ? rev.customerName.charAt(0) : "G"}</div>
                            <div>
                                <h6 class="fw-bold mb-0">${rev.customerName || "Anonymous Guest"}</h6>
                                <small class="text-muted">${rev.dishOrdered ? "Ordered: " + rev.dishOrdered : ""}</small>
                            </div>
                        </div>
                        <span class="badge ${getStatusBadgeClass(rev.status)}">${rev.status || "Approved"}</span>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-1">${starsHtml}</div>
                        <small class="text-muted">${dateStr}</small>
                    </div>

                    <p class="text-dark mb-3">${rev.comment}</p>

                    ${
                      rev.adminReply
                        ? `
                        <div class="reply-box mb-3">
                            <div class="d-flex align-items-center justify-content-between mb-1">
                                <span class="fw-bold small text-dark"><i class="bi bi-reply-fill text-warning me-1"></i>Owner Response</span>
                            </div>
                            <p class="small text-muted mb-0">${rev.adminReply}</p>
                        </div>
                    `
                        : ""
                    }

                    <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                        <button class="btn btn-sm btn-outline-warning rounded-pill reply-btn" data-id="${rev.id}">
                            <i class="bi bi-arrow-return-right me-1"></i> ${rev.adminReply ? "Edit Reply" : "Reply"}
                        </button>

                        <div class="d-flex align-items-center gap-1">
                            <button class="btn btn-sm btn-light text-success status-btn" data-id="${rev.id}" data-status="Approved" title="Approve">
                                <i class="bi bi-check-lg"></i>
                            </button>
                            <button class="btn btn-sm btn-light text-warning status-btn" data-id="${rev.id}" data-status="Hidden" title="Hide">
                                <i class="bi bi-eye-slash"></i>
                            </button>
                            <button class="btn btn-sm btn-light text-danger delete-btn" data-id="${rev.id}" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  // GSAP Stagger Entrance for Review Cards
  gsap.from(".gsap-review-item", {
    duration: 0.4,
    y: 15,
    opacity: 0,
    stagger: 0.08,
    ease: "power1.out",
  });

  attachActionListeners();
}

// Badge Helpers
function getStatusBadgeClass(status) {
  switch (status) {
    case "Pending":
      return "badge-pending";
    case "Hidden":
      return "badge-hidden";
    default:
      return "badge-approved";
  }
}

// Action Button Listeners
function attachActionListeners() {
  // Reply
  document.querySelectorAll(".reply-btn").forEach((btn) => {
    btn.addEventListener("click", () => openReplyModal(btn.dataset.id));
  });

  // Update Status
  document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateStatus(btn.dataset.id, btn.dataset.status),
    );
  });

  // Delete Review with GSAP Card Dismissal
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cardEl = e.target.closest(".col-12");
      deleteReview(btn.dataset.id, cardEl);
    });
  });
}

// Open Reply Modal
function openReplyModal(id) {
  const rev = globalReviews.find((r) => r.id === id);
  if (!rev) return;

  activeSelectedReviewId = id;
  document.getElementById("replyModalCustomer").textContent =
    `Reply to ${rev.customerName}`;
  document.getElementById("replyOriginalAuthor").textContent =
    `Customer: ${rev.customerName}`;
  document.getElementById("replyOriginalText").textContent = `"${rev.comment}"`;
  document.getElementById("adminReplyInput").value = rev.adminReply || "";

  replyModal.show();
}

// Save Reply to Firestore
document.getElementById("saveReplyBtn").addEventListener("click", async () => {
  if (!activeSelectedReviewId) return;

  const replyText = document.getElementById("adminReplyInput").value.trim();

  // Local Array Update
  const idx = globalReviews.findIndex((r) => r.id === activeSelectedReviewId);
  if (idx !== -1) {
    globalReviews[idx].adminReply = replyText;
  }

  try {
    const docRef = doc(db, "reviews", activeSelectedReviewId);
    await updateDoc(docRef, { adminReply: replyText });
  } catch (err) {
    console.log("Reply updated locally in mock state.");
  }

  updateMetrics(globalReviews);
  renderReviews();
  replyModal.hide();
});

// Update Status in Firestore
async function updateStatus(id, newStatus) {
  const idx = globalReviews.findIndex((r) => r.id === id);
  if (idx !== -1) {
    globalReviews[idx].status = newStatus;
  }

  try {
    const docRef = doc(db, "reviews", id);
    await updateDoc(docRef, { status: newStatus });
  } catch (err) {
    console.log("Status updated locally in mock state.");
  }

  renderReviews();
}

// Delete Review with GSAP Exit Effect
async function deleteReview(id, cardElement) {
  if (confirm("Are you sure you want to delete this review?")) {
    // Animate card removal with GSAP
    gsap.to(cardElement, {
      duration: 0.3,
      scale: 0.9,
      opacity: 0,
      onComplete: async () => {
        globalReviews = globalReviews.filter((r) => r.id !== id);

        try {
          await deleteDoc(doc(db, "reviews", id));
        } catch (err) {
          console.log("Deleted locally from mock state.");
        }

        updateMetrics(globalReviews);
        renderReviews();
      },
    });
  }
}

// Star Filter Button Event Handlers
document.querySelectorAll("#starFilterButtons .btn-filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#starFilterButtons .btn-filter")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeStarFilter = btn.dataset.rating;
    renderReviews();
  });
});

// Input Handlers
searchInput?.addEventListener("input", renderReviews);
statusFilter?.addEventListener("change", renderReviews);

// Initialize Page
runEntranceAnimations();
listenToReviews();
