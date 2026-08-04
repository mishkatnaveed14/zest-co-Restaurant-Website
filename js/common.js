// ===== MOBILE MENU =====
function openMobileMenu() {
  document.querySelector(".mobile-nav-toggle")?.classList.add("active");
  document.getElementById("mobileMenuPanel")?.classList.add("open");
  document.getElementById("mobileMenuOverlay")?.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  document.querySelector(".mobile-nav-toggle")?.classList.remove("active");
  document.getElementById("mobileMenuPanel")?.classList.remove("open");
  document.getElementById("mobileMenuOverlay")?.classList.remove("show");
  document.body.style.overflow = "";
}

document
  .querySelector(".mobile-nav-toggle")
  ?.addEventListener("click", openMobileMenu);
document
  .querySelector(".mobile-close")
  ?.addEventListener("click", closeMobileMenu);
document
  .getElementById("mobileMenuOverlay")
  ?.addEventListener("click", closeMobileMenu);
// Close the mobile menu when clicking a real navigation link,
// but NOT the dropdown toggle (so the PAGES submenu can open).
document
  .querySelectorAll(".mobile-nav-links a:not(.dropdown-toggle)")
  .forEach((a) => a.addEventListener("click", closeMobileMenu));

// ===== MOBILE MENU DROPDOWN (PAGES) =====
document
  .querySelectorAll(".mobile-nav-links .dropdown-toggle")
  .forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = toggle.parentElement.querySelector(".dropdown-menu");
      if (!menu) return;
      const isOpen = menu.classList.contains("show");
      // Close any other open dropdowns in the mobile menu
      document
        .querySelectorAll(".mobile-nav-links .dropdown-menu.show")
        .forEach((m) => {
          if (m !== menu) m.classList.remove("show");
        });
      document
        .querySelectorAll(".mobile-nav-links .dropdown-toggle.show")
        .forEach((t) => {
          if (t !== toggle) t.classList.remove("show");
        });
      menu.classList.toggle("show", !isOpen);
      toggle.classList.toggle("show", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  });
