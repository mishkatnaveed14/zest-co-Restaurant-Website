// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("galleryContainer");
  const cards = document.querySelectorAll(".card-3d");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  // 1. GSAP ScrollTrigger Timeline for 3D Camera Fly-Through
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2, // Smooth interpolation lag
    }
  });

  // Move entire container forward through Z-space as user scrolls down
  tl.to(container, {
    z: 2200, 
    y: "-180vh",
    ease: "none"
  });

  // Rotate individual cards slightly based on scroll position
  cards.forEach((card, i) => {
    gsap.to(card, {
      rotateY: i % 2 === 0 ? 15 : -15,
      rotateX: i % 3 === 0 ? -10 : 10,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2
      }
    });
  });

  // 2. Interactive Mouse Parallax (Tilts 3D scene on cursor movement)
  window.addEventListener("mousemove", (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 30;

    gsap.to(container, {
      rotateY: mouseX,
      rotateX: -mouseY,
      duration: 1.2,
      ease: "power2.out"
    });
  });

  // 3. Click-to-Zoom Lightbox Handler
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const title = card.querySelector("h3").textContent;
      const cat = card.querySelector(".cat").textContent;

      lightboxImg.src = img.src;
      lightboxCaption.innerHTML = `${title} &mdash; <em>${cat}</em>`;
      lightbox.classList.add("active");
    });
  });

  lightboxClose?.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });
});


// ==========================================================================
// 4. DYNAMIC 3D BACKGROUND PARTICLES SYSTEM
// ==========================================================================
const initParticles = () => {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Properties
  const particleCount = 80;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1000, // Z-Depth
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.4 ? "rgba(212, 175, 55, " : "rgba(255, 255, 255, ",
      alpha: Math.random() * 0.6 + 0.2,
      speedZ: Math.random() * 0.8 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      // Move particle in Z-depth continuously
      p.z -= p.speedZ;
      if (p.z <= 0) p.z = 1000;

      // Perspective projection mapping
      const perspective = 600;
      const k = perspective / (perspective + p.z);
      const px = (p.x - width / 2) * k + width / 2;
      const py = (p.y - height / 2) * k + height / 2;
      const size = p.size * k * 2;

      ctx.beginPath();
      ctx.arc(px, py, Math.max(0, size), 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha * k + ")";
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
};

// Start particles after page loads
document.addEventListener("DOMContentLoaded", initParticles);