document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const brandTrigger = document.getElementById("brandToggleTrigger");
  const brandArrow = document.querySelector(".brand-toggle-arrow");
  const inventoryToggle = document.getElementById("inventoryToggle");
  const inventorySubmenu = document.getElementById("inventorySubmenu");
  const mobileToggle =
    document.getElementById("mobileSidebarToggle") ||
    document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileDrawerClose");
  const overlay =
    document.getElementById("sidebarOverlay") ||
    document.getElementById("overlay");
  const desktopToggle = document.getElementById("sidebarToggle");

  const setCollapsed = (collapsed) => {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    sidebar.classList.toggle("collapsed", collapsed);
    brandArrow?.classList.toggle("is-collapsed", collapsed);
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

  const toggleInventory = (event) => {
    event.preventDefault();
    if (sidebar.classList.contains("collapsed")) setCollapsed(false);
    const open = inventoryToggle.getAttribute("aria-expanded") === "true";
    inventoryToggle.setAttribute("aria-expanded", String(!open));
    inventorySubmenu.style.height = open
      ? "0px"
      : `${inventorySubmenu.scrollHeight}px`;
    inventoryToggle
      .querySelector(".chevron-icon")
      ?.classList.toggle("is-open", !open);
  };

  const closeDrawer = () => {
    document.body.classList.remove("mobile-sidebar-open");
    mobileToggle?.classList.remove("active");
      if (window.innerWidth < 992) {
          sidebar.style.setProperty('transform', 'translateX(-105%)', 'important');
          sidebar.style.setProperty('visibility', 'hidden', 'important');
          sidebar.style.setProperty('opacity', '0', 'important');
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

  mobileToggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("mobile-sidebar-open");
    mobileToggle.classList.toggle("active", open);
      if (window.innerWidth < 992) {
          sidebar.style.setProperty('transform', open ? 'translateX(0)' : 'translateX(-105%)', 'important');
          sidebar.style.setProperty('visibility', open ? 'visible' : 'hidden', 'important');
          sidebar.style.setProperty('opacity', open ? '1' : '0', 'important');
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
    if (window.innerWidth >= 992) closeDrawer();
  });
});
