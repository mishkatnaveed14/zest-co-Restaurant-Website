document.addEventListener("DOMContentLoaded", () => {
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Background Image Zoom Effect
  heroTl.from(".hero-banner", {
    scale: 1.15,
    duration: 1.5,
    ease: "power2.out"
  });

  // Animated Text Elements Sequentially
  heroTl.from(".hero-subtitle", {
    y: -30,
    opacity: 0,
    duration: 0.6
  }, "-=1.0")

  .from(".hero-title", {
    y: 40,
    opacity: 0,
    duration: 0.8
  }, "-=0.4")

  .from(".hero-description", {
    y: 30,
    opacity: 0,
    duration: 0.6
  }, "-=0.5")

  /* BUTTON ANIMATION FIX */
  .from(".hero-buttons .btn", {
    y: 20,
    opacity: 0,
    stagger: 0.2, // 0.8 zyada delay kar raha tha, 0.2 perfectly fast aur smooth hai
    duration: 0.6,
    clearProps: "all" // Animation poori hotay hi inline opacity/transform styles remove ho jayege
  }, "-=0.3");
});