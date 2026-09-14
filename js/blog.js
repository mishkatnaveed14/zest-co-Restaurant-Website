 // GSAP Plugin Register
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. PAGE LOAD ANIMATION (Initial Fade-In)
  const loadTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  loadTimeline
    .from(".contact-hero-icon", {
      y: -50,
      opacity: 0,
      duration: 0.8
    })
    .from("#contact-hero-container h1", {
      y: 40,
      opacity: 0,
      duration: 1
    }, "-=0.4")
    .from("#contact-hero-container .gap-4", {
      y: 30,
      opacity: 0,
      duration: 0.8
    }, "-=0.5");


  // 2. SCROLL TRIGGER ANIMATION 
  gsap.to(".hero-content-wrapper", {
    y: 150,               // Scroll karne par 150px niche jayega
    opacity: 0,           // Dhere dhere fade out hoga
    ease: "none",
    scrollTrigger: {
      trigger: "#contact-hero-container",
      start: "top top",   // Hero top screen par aate hi start hoga
      end: "bottom top",  // Hero screen se bahar jate hi end hoga
      scrub: 1            // Scroll ke sath smooth Sync hoga (1 sec lag)
    }
  });

});