document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const themeButton = document.getElementById("themeToggle");
  const applyTheme = (isDark) => {
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.remove("dark");
    if (themeButton) {
      themeButton.innerHTML = isDark
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-regular fa-moon"></i>';
    }
  };

  applyTheme(localStorage.getItem("restro-theme") === "dark");
  themeButton?.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-theme");
    applyTheme(isDark);
    localStorage.setItem("restro-theme", isDark ? "dark" : "light");
  });

  const brandTrigger = document.getElementById("brandToggleTrigger");
  const brandArrow = document.querySelector(".brand-toggle-arrow");
  const inventoryToggle = document.getElementById("inventoryToggle");
  const inventorySubmenu = document.getElementById("inventorySubmenu");
  const inventoryLinks = inventorySubmenu
    ? inventorySubmenu.querySelectorAll(".nav-link-custom")
    : [];
  const mobileToggle =
    document.getElementById("mobileSidebarToggle") ||
    document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileDrawerClose");
  const overlay =
    document.getElementById("sidebarOverlay") ||
    document.getElementById("overlay");
  const desktopToggle = document.getElementById("sidebarToggle");

  document.querySelectorAll(".profile").forEach((profile) => {
    profile.setAttribute("role", "button");
    profile.setAttribute("tabindex", "0");
    profile.addEventListener("click", () => {
      const menu = document.getElementById("profileMenu");
      menu?.classList.toggle("is-open");
    });
    profile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const menu = document.getElementById("profileMenu");
        menu?.classList.toggle("is-open");
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

  if (inventoryToggle?.dataset.keepOpen === "true") openInventory();

  const syncInventoryActiveState = () => {
    const isPurchasePage = window.location.pathname.endsWith("purchase-order.html");
    inventoryLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", isPurchasePage
        ? href.includes("purchase-order.html")
        : href.includes("inventory.html") && !href.includes("purchase-order.html"));
    });

    if (inventoryToggle) {
      inventoryToggle.classList.toggle("active", !isPurchasePage);
      inventoryToggle.setAttribute("aria-expanded", "true");
      inventorySubmenu && (inventorySubmenu.style.height = `${inventorySubmenu.scrollHeight}px`);
    }
  };

  const toggleInventory = (event) => {
    if (inventoryToggle.dataset.keepOpen === "true") {
      event.preventDefault();
      openInventory();
      return;
    }

    if (inventoryToggle.getAttribute("href") === "#") {
      event.preventDefault();
      window.location.assign("./inventory.html");
      return;
    }
  };

  const closeDrawer = () => {
    document.body.classList.remove("mobile-sidebar-open");
    mobileToggle?.classList.remove("active");
    if (window.innerWidth < 992) {
      sidebar.style.setProperty("transform", "translateX(-105%)", "important");
      sidebar.style.setProperty("visibility", "hidden", "important");
      sidebar.style.setProperty("opacity", "0", "important");
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
  syncInventoryActiveState();

  mobileToggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("mobile-sidebar-open");
    mobileToggle.classList.toggle("active", open);
    if (window.innerWidth < 992) {
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
