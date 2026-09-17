import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

// By default the visibility of page will be hidden until we verify the user role. This prevents unauthorized users from seeing the content briefly before redirection.
document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      let userRef = doc(db, "users", user.uid);
      let userData = await getDoc(userRef);

      if (userData.exists() && userData.data()?.role === "admin") {
        // Id user is an admin, make the page visible
        document.documentElement.style.visibility = "visible";
      } else {
        // If user is not an admin, redirect to access denied page
        window.location.href = "../access-denied.html";
      }
    } catch (error) {
      console.error("Auth Error:", error);
      window.location.href = "../access-denied.html";
    }
  } else {
    // If user is not logged in, redirect to login page
    window.location.href = "../../index.html";
  }
});

// ------------------Dark/Light Theme Toggle------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const themeButton = document.getElementById("themeToggle");
  const applyTheme = (isDark) => {
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("dark", isDark);
    if (themeButton) {
      themeButton.innerHTML = isDark
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-regular fa-moon"></i>';
    }
  };

  const savedDark =
    localStorage.getItem("restro-theme") === "dark" ||
    localStorage.getItem("zestco-admin-theme") === "dark";
  applyTheme(savedDark);

  if (themeButton && !themeButton.dataset.themeBound) {
    themeButton.dataset.themeBound = "true";
    themeButton.addEventListener("click", () => {
      const isDark = !(document.body.classList.contains("dark-theme") || document.body.classList.contains("dark"));
      applyTheme(isDark);
      localStorage.setItem("restro-theme", isDark ? "dark" : "light");
      localStorage.setItem("zestco-admin-theme", isDark ? "dark" : "light");
    });
  }

  const brandTrigger = document.getElementById("brandToggleTrigger");
  const brandArrow = document.querySelector(".brand-toggle-arrow");
  const inventoryToggle = document.getElementById("inventoryToggle");
  const inventorySubmenu = document.getElementById("inventorySubmenu");
  const inventoryLinks = inventorySubmenu
    ? inventorySubmenu.querySelectorAll(".nav-link-custom")
    : [];
  const mobileToggles = [
    document.getElementById("mobileSidebarToggle"),
    document.getElementById("mobileMenu"),
  ].filter(Boolean);
  const mobileClose = document.getElementById("mobileDrawerClose");
  const overlay =
    document.getElementById("sidebarOverlay") ||
    document.getElementById("overlay");
  const desktopToggle = document.getElementById("sidebarToggle");

  const syncMobileDrawerState = (open) => {
    document.body.classList.toggle("mobile-sidebar-open", open);
    mobileToggles.forEach((toggle) => {
      const isHamburger = toggle.classList.contains("hamburger-btn");
      toggle.classList.toggle("active", open && isHamburger);
      toggle.setAttribute("aria-expanded", String(open));
    });
  };

  document.querySelectorAll(".profile").forEach((profile) => {
    profile.setAttribute("role", "button");
    profile.setAttribute("tabindex", "0");
    profile.addEventListener("click", () => {
      window.location.assign("./setting.html");
    });
    profile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.assign("./setting.html");
      }
    });
  });

  const setCollapsed = (collapsed) => {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    sidebar.classList.toggle("collapsed", collapsed);
    brandArrow?.classList.toggle("is-collapsed", collapsed);
    if (window.innerWidth >= 992) {
      sidebar.style.setProperty(
        "width",
        collapsed ? "88px" : "260px",
        "important",
      );
      sidebar.style.setProperty(
        "min-width",
        collapsed ? "88px" : "260px",
        "important",
      );
      sidebar.style.setProperty(
        "max-width",
        collapsed ? "88px" : "260px",
        "important",
      );
    } else {
      sidebar.style.removeProperty("width");
      sidebar.style.removeProperty("min-width");
      sidebar.style.removeProperty("max-width");
    }
    if (collapsed) closeInventory();
  };

  const closeInventory = () => {
    if (!inventorySubmenu) return;
    inventorySubmenu.style.height = "0px";
    inventoryToggle?.setAttribute("aria-expanded", "false");
    inventoryToggle
      ?.querySelector(".chevron-icon")
      ?.classList.remove("is-open");
  };

  const openInventory = () => {
    if (!inventorySubmenu) return;
    inventorySubmenu.style.height = `${inventorySubmenu.scrollHeight}px`;
    inventoryToggle?.setAttribute("aria-expanded", "true");
    inventoryToggle
      ?.querySelector(".chevron-icon")
      ?.classList.add("is-open");
  };

  const syncSidebarState = () => {
    const page = window.location.pathname.split("/").pop() || "dashboard.html";
    document.querySelectorAll(".nav-link-custom").forEach((link) => {
      link.classList.remove("active");
    });

    const directMatch = document.querySelector(
      `.nav-link-custom[href="./${page}"]`,
    );

    if (directMatch) {
      directMatch.classList.add("active");
    }

    if (page === "inventory.html" || page === "purchase-order.html") {
      inventoryToggle?.classList.add("active");
      inventoryToggle?.setAttribute("aria-expanded", "true");
      inventorySubmenu && (inventorySubmenu.style.height = `${inventorySubmenu.scrollHeight}px`);
      inventoryLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const shouldBeActive =
          (page === "inventory.html" && href.includes("inventory.html") && !href.includes("purchase-order.html")) ||
          (page === "purchase-order.html" && href.includes("purchase-order.html"));
        link.classList.toggle("active", shouldBeActive);
      });
    }

    if (page === "orders.html") {
      const ordersLink = document.querySelector('.nav-link-custom[href="./orders.html"]');
      ordersLink?.classList.add("active");
    }

    if (page === "setting.html") {
      const settingsLink = document.querySelector('.nav-link-custom[href="setting.html"]');
      settingsLink?.classList.add("active");
    }
  };

  if (inventoryToggle?.dataset.keepOpen === "true") openInventory();
  syncSidebarState();

  const toggleInventory = (event) => {
    if (inventoryToggle?.dataset.keepOpen === "true") {
      event.preventDefault();
      openInventory();
      return;
    }

    if (inventoryToggle && inventoryToggle.getAttribute("href") === "#") {
      event.preventDefault();
      window.location.assign("./inventory.html");
      return;
    }
  };

  const closeDrawer = () => {
    syncMobileDrawerState(false);
    if (window.innerWidth < 992) {
      document.body.classList.remove("sidebar-collapsed");
      sidebar.classList.remove("collapsed");
      sidebar.style.setProperty("width", "260px", "important");
      sidebar.style.setProperty("min-width", "260px", "important");
      sidebar.style.setProperty("max-width", "260px", "important");
      sidebar.style.setProperty("transform", "translateX(-105%)", "important");
      sidebar.style.setProperty("visibility", "hidden", "important");
      sidebar.style.setProperty("opacity", "0", "important");
    }
  };

  const toggleMobileDrawer = () => {
    const open = !document.body.classList.contains("mobile-sidebar-open");
    syncMobileDrawerState(open);
    if (window.innerWidth < 992) {
      document.body.classList.remove("sidebar-collapsed");
      sidebar.classList.remove("collapsed");
      sidebar.style.setProperty("width", "260px", "important");
      sidebar.style.setProperty("min-width", "260px", "important");
      sidebar.style.setProperty("max-width", "260px", "important");
      sidebar.style.setProperty(
        "transform",
        open ? "translateX(0)" : "translateX(-105%)",
        "important",
      );
      sidebar.style.setProperty(
        "visibility",
        open ? "visible" : "hidden",
        "important",
      );
      sidebar.style.setProperty("opacity", open ? "1" : "0", "important");
    }
  };

  brandTrigger?.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    if (window.innerWidth >= 992)
      setCollapsed(!document.body.classList.contains("sidebar-collapsed"));
  });

  desktopToggle?.addEventListener("click", () => {
    setCollapsed(!document.body.classList.contains("sidebar-collapsed"));
  });

  inventoryToggle?.addEventListener("click", toggleInventory);

  mobileToggles.forEach((toggle) => {
    toggle.addEventListener("click", toggleMobileDrawer);
  });

  mobileClose?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  sidebar
    .querySelectorAll('.nav-link-custom[href]:not([href="#"])')
    .forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeDrawer();
      sidebar.style.removeProperty("width");
      sidebar.style.removeProperty("min-width");
      sidebar.style.removeProperty("max-width");
    } else {
      sidebar.style.removeProperty("width");
      sidebar.style.removeProperty("min-width");
      sidebar.style.removeProperty("max-width");
      document.body.classList.remove("sidebar-collapsed");
      sidebar.classList.remove("collapsed");
    }
  });
});
// --------Logout Admin ---------------
document.getElementById("logout")?.addEventListener("click", function () {
  signOut(auth).then(() => {
    window.location.href = "../../../index.html"; // Redirect to login page
  }).catch((error) => {
    console.error("Error logging out:", error.message);
  })
});
