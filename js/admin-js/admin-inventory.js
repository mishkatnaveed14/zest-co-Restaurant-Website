// Add subtle entry animations for cards and table rows using GSAP
document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".custom-card", {
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.15,
    ease: "power2.out"
  });

  gsap.from(".custom-table tbody tr", {
    duration: 0.5,
    opacity: 0,
    x: -10,
    stagger: 0.05,
    delay: 0.3,
    ease: "power1.out"
  });
});