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

// ===== AUTH MODAL (LOGIN / SIGNUP) =====
const authModal = document.getElementById("authModal");

function openAuthModal(tab) {
  if (!authModal) return;
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.body.style.marginRight = `${getScrollbarWidth()}px`;
  if (tab) switchAuthTab(tab);
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.body.style.marginRight = "";
}

function getScrollbarWidth() {
  const w = window.innerWidth - document.documentElement.clientWidth;
  return w > 0 ? w : 0;
}

function switchAuthTab(tab) {
  if (!authModal) return;
  const tabs = authModal.querySelectorAll(".auth-tab");
  const forms = authModal.querySelectorAll(".auth-form");
  const target = tab === "signup" ? "signup" : "login";

  tabs.forEach((t) =>
    t.classList.toggle("active", t.dataset.authTab === target),
  );
  forms.forEach((f) =>
    f.classList.toggle("active", f.dataset.authForm === target),
  );
}

// Openers: [data-auth-open]
document.querySelectorAll("[data-auth-open]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openAuthModal(el.dataset.authOpen);
  });
});

// Tab switching
authModal?.querySelectorAll("[data-auth-tab]").forEach((tab) => {
  tab.addEventListener("click", () => switchAuthTab(tab.dataset.authTab));
});

// Switch links inside forms
authModal?.querySelectorAll("[data-auth-switch]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthTab(link.dataset.authSwitch);
  });
});

// Close: overlay, close button, Escape key
authModal?.querySelectorAll("[data-auth-close]").forEach((el) => {
  el.addEventListener("click", closeAuthModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAuthModal();
});

// Toggle password visibility
authModal?.querySelectorAll("[data-auth-eye]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const icon = btn.querySelector("i");
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
  });
});

// Prevent closing when clicking inside the modal box
authModal?.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});
authModal
  ?.querySelector(".auth-modal-box")
  ?.addEventListener("click", (e) => e.stopPropagation());

// Form submit placeholder
authModal?.querySelectorAll(".auth-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("This is a demo — authentication is not connected yet.");
  });
});
