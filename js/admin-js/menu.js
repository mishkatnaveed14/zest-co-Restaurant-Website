import { db } from "../../firebase.config.js";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const asset = (name) => `../../../assets/images/menu/${name}`;
const fallbackDishes = [
  {
    id: "fallback-1",
    name: "Zesty Smash Burger",
    category: "Lunch",
    price: 12.99,
    rating: 4.9,
    published: true,
    image: asset("zesty-smash-burger.jpg"),
    description: "Juicy double beef patty with cheddar and house relish.",
    orders: 48,
  },
  {
    id: "fallback-2",
    name: "Truffle Mushroom Risotto",
    category: "Dinner",
    price: 18.5,
    rating: 4.8,
    published: true,
    image: asset("truffle-mushroom-risotto.jpg"),
    description: "Creamy Arborio rice with wild mushrooms and truffle oil.",
    orders: 31,
  },
  {
    id: "fallback-3",
    name: "Fiery Peri Peri Wings",
    category: "Chef Special",
    price: 14,
    rating: 4.7,
    published: true,
    image: asset("fiery-peri-peri-wings.jpg"),
    description: "Flame-grilled wings with an intense chili glaze.",
    orders: 58,
  },
  {
    id: "fallback-4",
    name: "Classic Berry Cheesecake",
    category: "Dessert",
    price: 8.99,
    rating: 4.9,
    published: true,
    image: asset("classic-berry-cheesecake.jpg"),
    description: "Velvety cheesecake with fresh wild berry reduction.",
    orders: 39,
  },
  {
    id: "fallback-5",
    name: "Smoked Salmon Benedict",
    category: "Breakfast",
    price: 16,
    rating: 4.8,
    published: true,
    image: asset("smoked-salmon-benedict.jpg"),
    description: "Poached eggs, brioche, smoked salmon and hollandaise.",
    orders: 27,
  },
  {
    id: "fallback-6",
    name: "Double Chocolate Mousse",
    category: "Dessert",
    price: 9.5,
    rating: 4.9,
    published: true,
    image: asset("double-chocolate-mousse.jpg"),
    description: "Dark chocolate mousse with caramel and gold leaf.",
    orders: 33,
  },
  {
    id: "fallback-7",
    name: "Lamb Kofta Kebab",
    category: "Dinner",
    price: 15,
    rating: 4.7,
    published: true,
    image: asset("lamb-kofta-kebab.jpg"),
    description: "Chargrilled lamb skewers with garlic yogurt dip.",
    orders: 24,
  },
  {
    id: "fallback-8",
    name: "Mango & Passionfruit Tart",
    category: "Dessert",
    price: 11.5,
    rating: 4.8,
    published: false,
    image: asset("mango-passionfruit-tart.jpg"),
    description: "Buttery pastry with tropical fruit curd and meringue.",
    orders: 28,
  },
  {
    id: "fallback-9",
    name: "Golden Fried Chicken",
    category: "Lunch",
    price: 13,
    rating: 4.8,
    published: true,
    image: asset("fiery-peri-peri-wings.jpg"),
    description: "Crispy chicken, herb salt, pickles and lemon zest.",
    orders: 26,
  },
  {
    id: "fallback-10",
    name: "Artisan Pepperoni Pizza",
    category: "Dinner",
    price: 16,
    rating: 4.8,
    published: true,
    image: asset("zesty-smash-burger.jpg"),
    description: "Wood-fired crust with San Marzano tomato and basil.",
    orders: 33,
  },
  {
    id: "fallback-11",
    name: "Grilled Salmon Steak",
    category: "Dinner",
    price: 21,
    rating: 4.9,
    published: true,
    image: "../../../assets/images/spotlight/grilled-salmon-steak.jpg",
    description: "Pan-seared salmon with golden butter and charred lemon.",
    orders: 42,
  },
  {
    id: "fallback-12",
    name: "Smoky BBQ Ribs",
    category: "Chef Special",
    price: 22,
    rating: 4.9,
    published: true,
    image: "../../../assets/images/spotlight/smoky-bbq-ribs.jpg",
    description: "Slow-cooked ribs with house smoky barbecue glaze.",
    orders: 38,
  },
  {
    id: "fallback-13",
    name: "Chef's Fried Rice",
    category: "Lunch",
    price: 12,
    rating: 4.7,
    published: true,
    image: "../../../assets/images/spotlight/chefs-fried-rice.jpg",
    description: "Jasmine rice with prawns, charred scallion and egg.",
    orders: 24,
  },
  {
    id: "fallback-14",
    name: "Ramen Bowl",
    category: "Chef Special",
    price: 19,
    rating: 4.9,
    published: true,
    image: "../../../assets/images/spotlight/ramen-bowl.jpg",
    description: "Hand-pulled noodles in an 18-hour broth.",
    orders: 45,
  },
  {
    id: "fallback-15",
    name: "Strawberry Waffles",
    category: "Dessert",
    price: 7,
    rating: 4.7,
    published: true,
    image: "../../../assets/images/food/strawberry-waffles.jpg",
    description: "Golden waffles with strawberries, cream and syrup.",
    orders: 22,
  },
  {
    id: "fallback-16",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 6.5,
    rating: 4.8,
    published: true,
    image: "../../../assets/images/food/chocolate-lava.jpg",
    description: "Warm chocolate cake with a molten centre.",
    orders: 25,
  },
];
let dishes = [
  ...new Map(
    fallbackDishes.map((dish) => [dish.name.toLowerCase(), dish]),
  ).values(),
];
let chart;
let currentPage = 1;
const pageSize = 6;
const $ = (id) => document.getElementById(id);
const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const safe = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
const normalize = (snapshot) => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name || data.title || "Untitled dish",
    category: data.category || data.categories?.[0] || "Chef Special",
    price: Number(data.price || data.currentPrice || 0),
    rating: Number(data.rating || 0),
    published: data.published ?? data.isAvailable ?? true,
    image: data.image || data.img || asset("zesty-smash-burger.jpg"),
    description:
      data.description ||
      data.desc ||
      "Freshly prepared by the ZestCo kitchen.",
    orders: Number(data.orders || data.ordersThisWeek || 0),
  };
};
function stars(rating) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
}
function filteredDishes() {
  const query = ($("menuSearch")?.value || $("globalSearch")?.value || "")
    .toLowerCase()
    .trim();
  const category = $("categoryFilter")?.value || "all";
  const status = $("statusFilter")?.value || "all";
  return dishes.filter(
    (dish) =>
      (!query ||
        `${dish.name} ${dish.category} ${dish.description}`
          .toLowerCase()
          .includes(query)) &&
      (category === "all" || dish.category === category) &&
      (status === "all" ||
        (status === "published" ? dish.published : !dish.published)),
  );
}
function updateStats() {
  const published = dishes.filter((dish) => dish.published);
  const categories = new Set(dishes.map((dish) => dish.category));
  const rating = dishes.length
    ? dishes.reduce((sum, dish) => sum + Number(dish.rating || 0), 0) /
      dishes.length
    : 0;
  $("totalDishes").textContent = dishes.length;
  $("publishedDishes").textContent = published.length;
  $("activeDishes").textContent = `${published.length} active today`;
  $("averageRating").textContent = rating.toFixed(1);
  $("totalCategories").textContent = categories.size;
}
function renderFeatured() {
  $("featuredGrid").innerHTML = dishes
    .filter((dish) => dish.published)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 3)
    .map(
      (dish) =>
        `<article class="featured-card"><img src="${safe(dish.image)}" alt="${safe(dish.name)}"><div class="featured-info"><h4>${safe(dish.name)}</h4><p><span class="price">${money(dish.price)}</span> &middot; <span class="stars">${stars(dish.rating)}</span></p></div></article>`,
    )
    .join("");
}
function renderTopDish() {
  const dish = [...dishes].sort((a, b) => (b.orders || 0) - (a.orders || 0))[0];
  $("topDish").innerHTML = dish
    ? `<div class="spotlight-dish"><img src="${safe(dish.image)}" alt="${safe(dish.name)}"><div><h4>${safe(dish.name)}</h4><p><span class="price">${dish.orders || 0} orders</span> this week<br><span class="stars">${stars(dish.rating)}</span> ${Number(dish.rating).toFixed(1)} rating</p></div></div>`
    : "";
}
function renderChart() {
  if (!window.Chart) return;
  const counts = [...new Set(dishes.map((dish) => dish.category))].map(
    (category) => ({
      category,
      count: dishes.filter((dish) => dish.category === category).length,
    }),
  );
  const colors = [
    "#ff6b2c",
    "#f1b843",
    "#4fa77c",
    "#5988e9",
    "#b57acb",
    "#e37d70",
  ];
  if (chart) chart.destroy();
  chart = new Chart($("categoryChart"), {
    type: "doughnut",
    data: {
      labels: counts.map((item) => item.category),
      datasets: [
        {
          data: counts.map((item) => item.count),
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false } },
    },
  });
  $("categoryLegend").innerHTML = counts
    .map(
      (item, index) =>
        `<span class="legend-item"><i style="background:${colors[index % colors.length]}"></i>${safe(item.category)} <strong>${item.count}</strong></span>`,
    )
    .join("");
}
function fillCategories() {
  const categories = [...new Set(dishes.map((dish) => dish.category))].sort();
  $("categoryFilter").innerHTML =
    `<option value="all">All categories</option>${categories.map((category) => `<option value="${safe(category)}">${safe(category)}</option>`).join("")}`;
}
function render() {
  const visible = filteredDishes();
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const pageItems = visible.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  $("menuTableBody").innerHTML = pageItems
    .map(
      (dish) =>
        `<tr><td><div class="dish-cell"><img src="${safe(dish.image)}" alt="${safe(dish.name)}"><div>${safe(dish.name)}<small>${safe(dish.description)}</small></div></div></td><td><span class="category-pill">${safe(dish.category)}</span></td><td><strong>${money(dish.price)}</strong></td><td><span class="stars">${stars(dish.rating)}</span> <small>${Number(dish.rating).toFixed(1)}</small></td><td><span class="status-pill ${dish.published ? "published" : "draft"}">${dish.published ? "Published" : "Draft"}</span></td><td><div class="row-actions"><button data-action="details" data-id="${safe(dish.id)}" title="View menu details"><i class="fa-solid fa-eye"></i></button><button data-action="wishlist" data-id="${safe(dish.id)}" class="wishlist-action ${isWishlisted(dish.id) ? "is-saved" : ""}" title="Save to wishlist"><i class="fa-${isWishlisted(dish.id) ? "solid" : "regular"} fa-heart"></i></button><button data-action="edit" data-id="${safe(dish.id)}" title="Edit"><i class="fa-solid fa-pen"></i></button><button data-action="toggle" data-id="${safe(dish.id)}" title="Toggle status"><i class="fa-solid fa-power-off"></i></button><button data-action="delete" data-id="${safe(dish.id)}" title="Delete"><i class="fa-regular fa-trash-can"></i></button></div></td></tr>`,
    )
    .join("");
  $("emptyState").hidden = visible.length > 0;
  renderPagination(visible.length, totalPages);
  updateStats();
  renderFeatured();
  renderTopDish();
  renderChart();
}
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("zestco-admin-wishlist") || "[]");
  } catch {
    return [];
  }
}
function isWishlisted(id) {
  return getWishlist().some(
    (item) => (typeof item === "string" ? item : item.id) === id,
  );
}
function renderPagination(total, totalPages) {
  const start = total ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, total);
  $("paginationSummary").textContent = total
    ? `Showing ${start}-${end} of ${total} dishes`
    : "No dishes to show";
  $("previousPage").disabled = currentPage <= 1;
  $("nextPage").disabled = currentPage >= totalPages;
  $("pageNumbers").innerHTML = Array.from(
    { length: totalPages },
    (_, index) =>
      `<button type="button" class="page-number ${index + 1 === currentPage ? "active" : ""}" data-page="${index + 1}">${index + 1}</button>`,
  ).join("");
}
function toggleWishlist(id) {
  const saved = getWishlist();
  const dish = dishes.find((item) => item.id === id);
  const next = isWishlisted(id)
    ? saved.filter((item) => (typeof item === "string" ? item : item.id) !== id)
    : [
        ...saved.filter(
          (item) => (typeof item === "string" ? item : item.id) !== id,
        ),
        { id, name: dish?.name || "Saved dish", image: dish?.image || "" },
      ];
  localStorage.setItem("zestco-admin-wishlist", JSON.stringify(next));
  render();
  showToast(
    next.some((item) => (typeof item === "string" ? item : item.id) === id)
      ? "Dish added to wishlist."
      : "Dish removed from wishlist.",
  );
}
function openDetails(dish) {
  $("detailsImage").src = dish.image;
  $("detailsImage").alt = dish.name;
  $("detailsTitle").textContent = dish.name;
  $("detailsCategory").textContent = dish.category;
  $("detailsPrice").textContent = money(dish.price);
  $("detailsDescription").textContent = dish.description;
  $("detailsAbout").textContent =
    `${dish.name} is currently ${dish.published ? "published and visible to guests" : "saved as a draft"}. Keep the details fresh so the guest menu stays accurate.`;
  $("detailsRatingStars").textContent = stars(dish.rating);
  $("detailsRating").textContent = Number(dish.rating || 0).toFixed(1);
  $("detailsOrders").textContent = `${dish.orders || 0} orders`;
  $("detailsAvailability").textContent = dish.published ? "Published" : "Draft";
  $("detailsStatus").textContent = dish.published ? "Published" : "Draft";
  $("detailsStatus").className =
    `status-pill ${dish.published ? "published" : "draft"}`;
  $("detailsEditButton").onclick = () => {
    closeDetails();
    openModal(dish);
  };
  $("dishDetailsModal").classList.add("is-open");
  $("dishDetailsModal").setAttribute("aria-hidden", "false");
}
function closeDetails() {
  $("dishDetailsModal").classList.remove("is-open");
  $("dishDetailsModal").setAttribute("aria-hidden", "true");
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}
function openModal(dish = null) {
  $("dishForm").reset();
  $("dishId").value = dish?.id || "";
  $("modalTitle").textContent = dish ? "Edit dish" : "Add new dish";
  if (dish) {
    $("dishName").value = dish.name;
    $("dishCategory").value = dish.category;
    $("dishPrice").value = dish.price;
    $("dishRating").value = dish.rating;
    $("dishImage").value = dish.image.startsWith("http") ? dish.image : "";
    $("dishDescription").value = dish.description;
    $("dishPublished").checked = dish.published;
  }
  $("dishModal").classList.add("is-open");
  $("dishModal").setAttribute("aria-hidden", "false");
  $("dishName").focus();
}
function closeModal() {
  $("dishModal").classList.remove("is-open");
  $("dishModal").setAttribute("aria-hidden", "true");
}
async function persistDish(dish, id) {
  if (id.startsWith("fallback-")) {
    const index = dishes.findIndex((item) => item.id === id);
    dishes[index] = dish;
    return;
  }
  await updateDoc(doc(db, "menu", id), dish);
}
async function loadFirebase() {
  try {
    const snapshot = await getDocs(collection(db, "menu"));
    if (!snapshot.empty) {
      dishes = mergeDishes(snapshot.docs.map(normalize));
      fillCategories();
      render();
    }
    onSnapshot(collection(db, "menu"), (live) => {
      if (!live.empty) {
        dishes = mergeDishes(live.docs.map(normalize));
        fillCategories();
        render();
      }
    });
  } catch (error) {
    console.warn("Menu sync unavailable; showing local catalogue.", error);
  }
}
function mergeDishes(remoteDishes) {
  const merged = new Map(
    dishes.map((dish) => [dish.name.trim().toLowerCase(), dish]),
  );
  remoteDishes.forEach((dish) => {
    const key = dish.name.trim().toLowerCase();
    merged.set(key, { ...merged.get(key), ...dish });
  });
  return [...merged.values()];
}
document.addEventListener("DOMContentLoaded", () => {
  fillCategories();
  render();
  loadFirebase();
  if (window.gsap)
    gsap.from(".stat-card, .panel", {
      opacity: 0,
      y: 14,
      duration: 0.45,
      stagger: 0.06,
      ease: "power2.out",
    });
  $("menuSearch").addEventListener("input", () => {
    currentPage = 1;
    render();
  });
  $("globalSearch")?.addEventListener("input", () => {
    $("menuSearch").value = $("globalSearch").value;
    currentPage = 1;
    render();
  });
  $("categoryFilter").addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  $("statusFilter").addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  $("menuPagination").addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      currentPage = Number(pageButton.dataset.page);
      render();
    }
    if (event.target.closest("#previousPage") && currentPage > 1) {
      currentPage -= 1;
      render();
    }
    if (event.target.closest("#nextPage")) {
      currentPage += 1;
      render();
    }
  });
  $("addDishButton").addEventListener("click", () => openModal());
  $("refreshChart").addEventListener("click", renderChart);
  $("menuTableBody").addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const dish = dishes.find((item) => item.id === button.dataset.id);
    if (!dish) return;
    if (button.dataset.action === "details") {
      openDetails(dish);
      return;
    }
    if (button.dataset.action === "wishlist") {
      toggleWishlist(dish.id);
      return;
    }
    if (button.dataset.action === "edit") openModal(dish);
    if (button.dataset.action === "toggle") {
      dish.published = !dish.published;
      try {
        await persistDish(dish, dish.id);
        render();
        showToast(`Dish ${dish.published ? "published" : "moved to drafts"}.`);
      } catch (error) {
        showToast("Could not update this dish.");
      }
    }
    if (
      button.dataset.action === "delete" &&
      window.confirm(`Delete ${dish.name}?`)
    ) {
      try {
        if (!dish.id.startsWith("fallback-"))
          await deleteDoc(doc(db, "menu", dish.id));
        dishes = dishes.filter((item) => item.id !== dish.id);
        fillCategories();
        render();
        showToast("Dish deleted.");
      } catch (error) {
        showToast("Could not delete this dish.");
      }
    }
  });
  $("dishForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = $("dishId").value;
    const dish = {
      name: $("dishName").value.trim(),
      category: $("dishCategory").value,
      price: Number($("dishPrice").value),
      rating: Number($("dishRating").value),
      image: $("dishImage").value.trim() || asset("zesty-smash-burger.jpg"),
      description:
        $("dishDescription").value.trim() ||
        "Freshly prepared by the ZestCo kitchen.",
      published: $("dishPublished").checked,
      orders: 0,
    };
    try {
      if (id) await persistDish(dish, id);
      else {
        const reference = await addDoc(collection(db, "menu"), dish);
        dish.id = reference.id;
      }
      if (!id) dishes.unshift(dish);
      fillCategories();
      render();
      closeModal();
      showToast(id ? "Dish updated." : "New dish added.");
    } catch (error) {
      showToast("Could not save dish. Check Firebase access.");
    }
  });
  document
    .querySelectorAll("[data-close-modal]")
    .forEach((button) => button.addEventListener("click", closeModal));
  $("dishModal").addEventListener("click", (event) => {
    if (event.target === $("dishModal")) closeModal();
  });
  document
    .querySelectorAll("[data-close-details]")
    .forEach((button) => button.addEventListener("click", closeDetails));
  $("dishDetailsModal").addEventListener("click", (event) => {
    if (event.target === $("dishDetailsModal")) closeDetails();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetails();
  });
});
