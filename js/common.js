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

document.querySelector(".mobile-nav-toggle")?.addEventListener("click", openMobileMenu);
document.querySelector(".mobile-close")?.addEventListener("click", closeMobileMenu);
document.getElementById("mobileMenuOverlay")?.addEventListener("click", closeMobileMenu);
document.querySelectorAll(".mobile-nav-links a").forEach((a) => a.addEventListener("click", closeMobileMenu));