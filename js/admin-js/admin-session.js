import { auth, db, signOut } from "../../firebase.config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
const displayName = (user) =>
  user?.displayName || user?.email?.split("@")[0] || "Administrator";
const initials = (name) =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

function ensureThemeButton() {
  let button = $("#themeToggle") || $("[data-admin-theme]");
  if (!button) {
    const actions =
      $(".top-actions") || $(".header-actions") || $(".header-right");
    if (!actions) return null;
    button = document.createElement("button");
    button.className = "admin-theme-toggle icon-button action-btn";
    button.type = "button";
    button.id = "themeToggle";
    button.dataset.adminTheme = "true";
    button.setAttribute("aria-label", "Toggle dark mode");
    actions.prepend(button);
  }
  const updateIcon = () => {
    const dark = document.body.classList.contains("dark");
    button.innerHTML = `<i class="fa-${dark ? "solid fa-sun" : "regular fa-moon"}"></i>`;
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
  };
  updateIcon();
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "zestco-admin-theme",
      document.body.classList.contains("dark") ? "dark" : "light",
    );
    updateIcon();
    document.dispatchEvent(new CustomEvent("admin:theme-change"));
  });
  return button;
}

function ensureNotificationButton() {
  let button = $("#notificationBtn") || $(".notification");
  if (!button) {
    const actions =
      $(".top-actions") || $(".header-actions") || $(".header-right");
    if (!actions) return null;
    button = document.createElement("button");
    button.className =
      "admin-notification-button icon-button action-btn notification";
    button.id = "notificationBtn";
    button.type = "button";
    button.setAttribute("aria-label", "Notifications");
    button.innerHTML = '<i class="fa-regular fa-bell"></i>';
    actions.append(button);
  }
  button.classList.add("admin-notification-button");
  if (!button.querySelector(".admin-notification-count"))
    button.insertAdjacentHTML(
      "beforeend",
      '<span class="admin-notification-count" hidden>0</span>',
    );
  let panel = $("#adminNotifications");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "adminNotifications";
    panel.className = "admin-notifications-panel";
    panel.innerHTML =
      '<div class="admin-notifications-heading"><strong>Notifications</strong><button type="button" data-clear-notifications>Clear</button></div><div class="admin-notifications-list"><p class="admin-notifications-empty">You are all caught up.</p></div>';
    (
      button.closest(".top-actions") ||
      button.closest(".header-actions") ||
      button.parentElement
    ).append(panel);
  }
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    panel.classList.toggle("is-open");
  });
  $("[data-clear-notifications]", panel)?.addEventListener("click", () => {
    $(".admin-notifications-list", panel).innerHTML =
      '<p class="admin-notifications-empty">You are all caught up.</p>';
    $(".admin-notification-count", button).hidden = true;
  });
  return { button, panel };
}

function hydrateProfile(user) {
  const name = displayName(user);
  const shortName = name.length > 18 ? `${name.slice(0, 17)}...` : name;
  $$(".profile-name, .profile-copy strong").forEach((element) => {
    element.textContent = shortName;
  });
  $$(".profile-role, .profile-copy small").forEach((element) => {
    element.textContent = "Administrator";
  });
  $$(".profile-avatar, .avatar").forEach((element) => {
    if (element.tagName === "IMG")
      element.src =
        user?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4AF37&color=fff`;
    else element.textContent = initials(name);
  });
  $$(".profile-menu-head").forEach((element) => {
    const strong = $("strong", element);
    const small = $("small", element);
    if (strong) strong.textContent = name;
    if (small) small.textContent = user?.email || "Administrator account";
  });
}

function connectProfile() {
  const trigger =
    $("#profileTrigger") || $(".profile") || $(".profile-trigger");
  if (!trigger) return;
  const dropdown =
    trigger.closest(".user-profile-dropdown") || trigger.parentElement;
  let menu = $("#profileMenu", dropdown);
  if (!menu) {
    menu = document.createElement("div");
    menu.id = "profileMenu";
    menu.className = "profile-menu admin-profile-menu";
    menu.innerHTML =
      '<a class="profile-menu-item" href="./setting.html"><i class="fa-regular fa-user"></i><span>My Profile</span></a><a class="profile-menu-item" href="./setting.html"><i class="fa-solid fa-gear"></i><span>Account Settings</span></a><button class="profile-menu-item danger" type="button" data-admin-signout><i class="fa-solid fa-arrow-right-from-bracket"></i><span>Sign out</span></button>';
    dropdown.append(menu);
  }
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(open));
  });
  $("[data-admin-signout]", menu)?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "../../../index.html";
  });
  document.addEventListener("click", () => menu.classList.remove("is-open"));
}

function connectNotifications(notificationControls) {
  if (!notificationControls) return;
  const { button, panel } = notificationControls;
  const list = $(".admin-notifications-list", panel);
  const notifications = [];
  const render = () => {
    const recent = notifications.slice(0, 8);
    list.innerHTML = recent.length
      ? recent
          .map(
            (item) =>
              `<button class="admin-notification-item" type="button"><i class="${escapeHtml(item.icon)}"></i><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></span><time>${escapeHtml(item.time)}</time></button>`,
          )
          .join("")
      : '<p class="admin-notifications-empty">You are all caught up.</p>';
    const count = $(".admin-notification-count", button);
    count.textContent = recent.length;
    count.hidden = recent.length === 0;
  };
  const watch = (path, icon, title, detailKey) => {
    try {
      onSnapshot(
        query(collection(db, path), orderBy("createdAt", "desc"), limit(8)),
        (snapshot) => {
          snapshot.docs.forEach((item) => {
            const data = item.data();
            if (
              !notifications.some((entry) => entry.id === `${path}-${item.id}`)
            )
              notifications.push({
                id: `${path}-${item.id}`,
                icon,
                title,
                detail: String(
                  data[detailKey] ||
                    data.name ||
                    data.customerName ||
                    data.email ||
                    "New activity",
                ),
                time: "Just now",
              });
          });
          render();
        },
        () => {},
      );
    } catch (error) {
      /* Page fallbacks remain active when Firebase rules deny a feed. */
    }
  };
  watch("orders", "fa-solid fa-bag-shopping", "New order received", "orderId");
  watch(
    "reservations",
    "fa-solid fa-calendar-check",
    "New reservation",
    "name",
  );
  watch("reviews", "fa-solid fa-star", "New guest review", "customerName");
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("zestco-admin-theme") === "dark")
    document.body.classList.add("dark");
  ensureThemeButton();
  const notificationControls = ensureNotificationButton();
  connectProfile();
  connectNotifications(notificationControls);
  onAuthStateChanged(auth, (user) => hydrateProfile(user));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $("#adminNotifications")?.classList.remove("is-open");
      $("#profileMenu")?.classList.remove("is-open");
    }
  });
});
