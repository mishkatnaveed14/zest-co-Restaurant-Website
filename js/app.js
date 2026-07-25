// script.js 1
const carouselEl = document.querySelector("#home2Carousel");

if (carouselEl) {
  const carousel = new bootstrap.Carousel(carouselEl, {
    interval: 3500,
    ride: "carousel",
    pause: "hover",
    wrap: true,
  });
}
//-------- new item section start-----------

const foodItems = [
  {
    id: 1,
    title: "Momo Package",
    price: "$8.00",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500",
  },
  {
    id: 2,
    title: "Chicken Fried",
    price: "$12.00",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500",
  },
  {
    id: 3,
    title: "Vegetable Salad",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
  },
  //   { id: 4, title: "Prawn Curry", price: "$18.00", image: "https://images.unsplash.com/photo-1559742811-82410b51c4ca?w=500" },
  {
    id: 5,
    title: "Chicken Kebab",
    price: "$10.00",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500",
  },
  {
    id: 6,
    title: "Beef Burger",
    price: "$9.00",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
  {
    id: 7,
    title: "Special Biryani",
    price: "$11.00",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500",
  },
  {
    id: 8,
    title: "Pepperoni Pizza",
    price: "$14.00",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
  },
  {
    id: 9,
    title: "Ramen Noodles",
    price: "$13.00",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
  },
  //   {
  //     id: 10,
  //     title: "Mutton Karahi",
  //     price: "$19.00",
  //     image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500",
  //   },
  {
    id: 11,
    title: "Grilled Salmon",
    price: "$22.00",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500",
  },
  {
    id: 12,
    title: "Crispy Tacos",
    price: "$7.50",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
  },
  {
    id: 13,
    title: "Butter Chicken",
    price: "$15.00",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
  },
  {
    id: 14,
    title: "Fettuccine Alfredo",
    price: "$14.50",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500",
  },
  {
    id: 15,
    title: "Club Sandwich",
    price: "$8.50",
    image: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=500",
  },
  {
    id: 16,
    title: "Chocolate Lava",
    price: "$6.50",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
  },
  {
    id: 17,
    title: "Strawberry Waffles",
    price: "$7.00",
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=500",
  },
  {
    id: 18,
    title: "Mint Margarita",
    price: "$4.00",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
  },
  {
    id: 19,
    title: "Gulab Jamun Plate",
    price: "$5.00",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500",
  },
  {
    id: 20,
    title: "Premium Cappuccino",
    price: "$4.50",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const swiperWrapper = document.getElementById("swiper-items-wrapper");
  const activeImg = document.getElementById("active-food-img");
  const activeTitle = document.getElementById("active-food-title");
  const activePrice = document.getElementById("active-food-price");
  const dynamicCard = document.querySelector(".dynamic-food-card");

  if (swiperWrapper) {
    foodItems.forEach((item) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide d-flex justify-content-center";
      slide.innerHTML = `
        <div class="swiper-slide-thumb">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
      `;
      swiperWrapper.appendChild(slide);
    });
  }

  if (window.Swiper) {
    const swiper = new Swiper(".food-thumbs-swiper", {
      slidesPerView: 3,
      spaceBetween: 24,
      centeredSlides: true,
      loop: true,
      slideToClickedSlide: true,
      navigation: {
        nextEl: ".next-btn",
        prevEl: ".prev-btn",
      },
      breakpoints: {
        480: { slidesPerView: 4, spaceBetween: 24 },
        768: { slidesPerView: 5, spaceBetween: 30 },
        1024: { slidesPerView: 6, spaceBetween: 35 },
      },
    });

    let currentItemIndex = null;

    function updateActiveFood(index) {
      if (
        currentItemIndex === index ||
        !activeImg ||
        !activeTitle ||
        !activePrice
      )
        return;
      currentItemIndex = index;
      const food = foodItems[index];
      if (!food) return;

      activeImg.style.opacity = "0";
      activeTitle.style.opacity = "0";
      activePrice.style.opacity = "0";

      setTimeout(() => {
        activeImg.src = food.image;
        activeTitle.textContent = food.title;
        activePrice.textContent = `Price - ${food.price}`;
        activeImg.style.opacity = "1";
        activeTitle.style.opacity = "1";
        activePrice.style.opacity = "1";
      }, 70);
    }

    if (dynamicCard && activeImg) {
      dynamicCard.addEventListener("mousemove", (e) => {
        const cardRect = dynamicCard.getBoundingClientRect();
        const cardX = e.clientX - cardRect.left;
        const cardY = e.clientY - cardRect.top;
        const tiltX = (cardY / cardRect.height - 0.5) * 8;
        const tiltY = (cardX / cardRect.width - 0.5) * -8;

        dynamicCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        activeImg.style.transform = `translate(${(cardX / cardRect.width - 0.5) * 10}px, ${(cardY / cardRect.height - 0.5) * 10}px)`;
      });

      dynamicCard.addEventListener("mouseleave", () => {
        dynamicCard.style.transform = "rotateX(0) rotateY(0)";
        activeImg.style.transform = "translate(0,0)";
      });
    }

    swiper.on("slideChange", () => {
      updateActiveFood(swiper.realIndex);
    });

    updateActiveFood(0);
  } else if (activeImg && activeTitle && activePrice && foodItems[0]) {
    activeImg.src = foodItems[0].image;
    activeTitle.textContent = foodItems[0].title;
    activePrice.textContent = `Price - ${foodItems[0].price}`;
  }
});
//-------- new item section end------------

/* ================= DATA ================= */
const DISHES = [
  {
    name: "Beef Machal",
    desc: "Bone-in cutlet finished over open flame, rested with rosemary and cracked pepper.",
    price: 25,
    reviews: 20,
    rating: 4,
    img: "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false,
  },
  {
    name: "Beef Biryani",
    desc: "48-hour dum-cooked rice, tender beef, whole chillies and a whisper of saffron.",
    price: 28,
    reviews: 37,
    rating: 5,
    img: "https://images.pexels.com/photos/1630495/pexels-photo-1630495.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: true,
  },
  {
    name: "Thai Soup",
    desc: "Overnight broth, soft egg, scallion and chilli oil, served bubbling hot.",
    price: 21,
    reviews: 54,
    rating: 4,
    img: "https://images.pexels.com/photos/12984982/pexels-photo-12984982.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false,
  },
  {
    name: "Fired Chicken",
    desc: "Double-brined, double-fried, resting on herb salt with a citrus dip.",
    price: 14,
    reviews: 62,
    rating: 5,
    img: "https://images.pexels.com/photos/16892378/pexels-photo-16892378.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false,
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles, chashu pork, marinated egg, nori and scallion oil.",
    price: 19,
    reviews: 45,
    rating: 5,
    img: "https://images.pexels.com/photos/17593641/pexels-photo-17593641.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false,
  },
];

const SPOTLIGHT_ITEMS = [
  {
    name: "Golden Fried Chicken",
    desc: "Double-brined overnight, dredged twice, fried to a shattering crust and rested on herb salt.",
    price: "$14",
    img: "https://images.pexels.com/photos/16892378/pexels-photo-16892378.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Steamed Dumplings",
    desc: "Hand-folded parcels, minced beef and ginger, steamed to order and served with black vinegar.",
    price: "$9",
    img: "https://images.pexels.com/photos/7172851/pexels-photo-7172851.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Chef's Fried Rice",
    desc: "Wok-tossed jasmine rice, charred scallion and a soft crown of egg.",
    price: "$12",
    img: "https://images.pexels.com/photos/1630495/pexels-photo-1630495.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles in an 18-hour broth, chashu pork and marinated egg.",
    price: "$19",
    img: "https://images.pexels.com/photos/12984979/pexels-photo-12984979.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Grilled Wings",
    desc: "Charcoal-kissed wings glazed twice, finished with a squeeze of lime.",
    price: "$11",
    img: "https://images.pexels.com/photos/10648394/pexels-photo-10648394.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

/* ================= BUILD CAROUSEL ================= */
const track = document.getElementById("carTrack");
const dotsWrap = document.getElementById("carDots");

function starString(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

DISHES.forEach((d) => {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.innerHTML = `
    <div class="dish-img-wrap">
      <div class="price-blob ${d.featured ? "gold" : "white"}">$${d.price}</div>
      <img src="${d.img}" alt="${d.name}" loading="lazy">
    </div>
    <div class="dish-body">
      <div class="dish-rating">
        <span class="stars">${starString(d.rating)}</span>
        <span class="reviews">Review(${d.reviews})</span>
      </div>
      <h3>${d.name}</h3>
      <p>${d.desc}</p>
    </div>
  `;
  track.appendChild(card);
});

// duplicate a couple of cards at the end for a seamless-ish loop feel on wide screens
DISHES.slice(0, 2).forEach((d) => {
  const card = document.createElement("div");
  card.className = "dish-card clone";
  card.innerHTML = `
    <div class="dish-img-wrap">
      <div class="price-blob ${d.featured ? "gold" : "white"}">$${d.price}</div>
      <img src="${d.img}" alt="${d.name}" loading="lazy">
    </div>
    <div class="dish-body">
      <div class="dish-rating">
        <span class="stars">${starString(d.rating)}</span>
        <span class="reviews">Review(${d.reviews})</span>
      </div>
      <h3>${d.name}</h3>
      <p>${d.desc}</p>
    </div>
  `;
  track.appendChild(card);
});

const totalDots = DISHES.length;
for (let i = 0; i < totalDots; i++) {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  dotsWrap.appendChild(dot);
}

let currentSlide = 0;
let cardWidthWithGap = 0;
let visibleCount = 3;

function measure() {
  const cards = track.querySelectorAll(".dish-card");
  if (!cards.length) return;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap) || 30;
  cardWidthWithGap = cards[0].getBoundingClientRect().width + gap;
  if (window.innerWidth <= 640) visibleCount = 1;
  else if (window.innerWidth <= 1080) visibleCount = 2;
  else visibleCount = 3;
}

function goToSlide(i) {
  currentSlide = ((i % totalDots) + totalDots) % totalDots;
  const dots = dotsWrap.querySelectorAll("span");
  dots.forEach((d, idx) => d.classList.toggle("active", idx === currentSlide));
  const offset = currentSlide * cardWidthWithGap;
  if (window.gsap) {
    gsap.to(track, { x: -offset, duration: 0.7, ease: "power3.out" });
  } else {
    track.style.transform = `translateX(-${offset}px)`;
  }
}

document.getElementById("carPrev").addEventListener("click", () => {
  goToSlide(currentSlide - 1);
  restartAutoplay();
});
document.getElementById("carNext").addEventListener("click", () => {
  goToSlide(currentSlide + 1);
  restartAutoplay();
});

let autoplayTimer;
function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4200);
}

// swipe support
let startX = 0,
  isDragging = false;
track.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX;
});
window.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.clientX - startX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
    restartAutoplay();
  }
});

window.addEventListener("resize", () => {
  measure();
  goToSlide(currentSlide);
});
window.addEventListener("load", () => {
  measure();
  goToSlide(0);
  restartAutoplay();
});

/* ================= SPOTLIGHT GALLERY ================= */
const thumbsWrap = document.getElementById("spotlightThumbs");
const spotImg = document.getElementById("spotlightImg");
const spotName = document.getElementById("spotlightName");
const spotDesc = document.getElementById("spotlightDesc");
const spotPrice = document.getElementById("spotlightPrice");

SPOTLIGHT_ITEMS.forEach((item, idx) => {
  const thumb = document.createElement("div");
  thumb.className = "thumb" + (idx === 0 ? " active" : "");
  thumb.innerHTML = `<img src="${item.img}" alt="${item.name}"><span class="thumb-label">${item.name}</span>`;
  thumb.addEventListener("click", () => setSpotlight(idx));
  thumbsWrap.appendChild(thumb);
});

function setSpotlight(idx) {
  const item = SPOTLIGHT_ITEMS[idx];
  const thumbs = thumbsWrap.querySelectorAll(".thumb");
  thumbs.forEach((t, i) => t.classList.toggle("active", i === idx));

  if (window.gsap) {
    gsap.to(spotImg, {
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        spotImg.src = item.img;
        gsap.to(spotImg, { opacity: 1, duration: 0.35 });
      },
    });
    gsap.fromTo(
      "#spotlightName, #spotlightDesc, #spotlightPrice",
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
    );
  } else {
    spotImg.src = item.img;
  }
  spotName.textContent = item.name;
  spotDesc.textContent = item.desc;
  spotPrice.textContent = item.price;
}

/* ================= NAVBAR / MOBILE MENU ================= */
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });
}

/* ===== FIXED MOBILE HAMBURGER (LEFT SLIDE) ===== */
const hamburgerToggle = document.querySelector(".mobile-nav-toggle");
const mobilePanel = document.getElementById("mobileMenuPanel");
const mobileOverlay = document.getElementById("mobileMenuOverlay");
const mobileClose = document.querySelector(".mobile-close");

function openMobileMenu() {
  if (hamburgerToggle) hamburgerToggle.classList.add("active");
  if (mobilePanel) mobilePanel.classList.add("open");
  if (mobileOverlay) mobileOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  if (hamburgerToggle) hamburgerToggle.classList.remove("active");
  if (mobilePanel) mobilePanel.classList.remove("open");
  if (mobileOverlay) mobileOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

if (hamburgerToggle) {
  hamburgerToggle.addEventListener("click", openMobileMenu);
}

if (mobileClose) {
  mobileClose.addEventListener("click", closeMobileMenu);
}

if (mobileOverlay) {
  mobileOverlay.addEventListener("click", closeMobileMenu);
}

if (mobilePanel) {
  mobilePanel.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMobileMenu);
  });
}

/* ===== GSAP SCROLL ANIMATIONS ===== */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Animate sections on scroll
  function animateOnScroll(selector, fromVars, triggerOpts) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0, ...fromVars },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
            ...triggerOpts,
          },
        },
      );
    });
  }

  // Animate popular dish cards staggered
  if (track) {
    gsap.from(".dish-card", {
      y: 60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#popular",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }

  // Animate spotlight section
  animateOnScroll(".spotlight-feature", { x: -40 }, {});
  animateOnScroll(".spotlight-thumbs .thumb", { x: 40 }, { stagger: 0.08 });

  // Animate new items cards
  animateOnScroll(".premium-card", { y: 60 }, {});

  // Animate menu highlight cards
  gsap.from(".food-card", {
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".menu-highlights-section",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Animate quick action cards
  gsap.from(".quick-card", {
    y: 40,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: ".quick-action-section",
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Hero content entrance on load
  gsap.from(".slide-content", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.3,
  });
  gsap.from(".slide-image", {
    x: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.5,
  });

  // Footer reveal
  gsap.from(".footer-grid > div", {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
} else {
  // Fallback: just show everything
  document
    .querySelectorAll(
      ".dish-card, .premium-card, .food-card, .quick-card, .spotlight-feature, .thumb, .footer-grid > div",
    )
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
}

/* ================= FORMS ================= */
const reserveForm = document.getElementById("reserveForm");
if (reserveForm) {
  reserveForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("reserveConfirm");
    if (msg)
      msg.textContent =
        "Table request received — we'll confirm by phone shortly.";
    e.target.reset();
  });
}

const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("newsletterConfirm");
    if (msg) msg.textContent = "You're on the list!";
    e.target.reset();
  });
}

const watchBtn = document.getElementById("watchBtn");
if (watchBtn) {
  watchBtn.addEventListener("click", () => {
    const popularSection = document.getElementById("popular");
    if (popularSection) {
      window.scrollTo({
        top: popularSection.offsetTop - 60,
        behavior: "smooth",
      });
    }
  });
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

/* ================= SIMPLE REVEALS ================= */
document
  .querySelectorAll(
    ".section-head, .spotlight-feature, .spotlight-thumbs, .dish-card, [data-reveal]",
  )
  .forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });

/* ================= EMBER PARTICLES (canvas) ================= */
(function emberField() {
  const canvas = document.getElementById("emberCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function makeParticles() {
    const count = Math.min(46, Math.floor(w / 30));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: h + Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.6 + 0.25,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.25,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener("resize", () => {
    resize();
    makeParticles();
  });

  if (!prefersReduced) tick();
})();
// adding menu highlight section
// 1. Array of Food Items (Mock Data or API Response)
const dishesData = [
  {
    id: 1,
    name: "Zesty Smash Burger",
    category: "bestsellers",
    badge: "Halal ☪️",
    price: "$12.99",
    rating: "4.9 ★",
    desc: "Juicy double beef patty layered with melted cheddar and signature house relish.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
  {
    id: 2,
    name: "Truffle Mushroom Risotto",
    category: "specials",
    badge: "Vegan 🌱",
    price: "$18.50",
    rating: "4.8 ★",
    desc: "Creamy arborio rice infused with wild mushrooms and authentic black truffle oil.",
    image:
      "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&q=80",
  },
  {
    id: 3,
    name: "Fiery Peri Peri Wings",
    category: "combos",
    badge: "Spicy 🌶️",
    price: "$14.00",
    rating: "4.7 ★",
    desc: "Flame-grilled chicken wings tossed in intense African bird's eye chili glaze.",
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80",
  },
  {
    id: 4,
    name: "Classic Berry Cheesecake",
    category: "desserts",
    badge: "Chef's Pick ⭐",
    price: "$8.99",
    rating: "4.9 ★",
    desc: "Velvety New York style cheesecake topped with fresh wild berry reduction.",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80",
  },
];

// DOM Elements
const menuGrid = document.getElementById("menuGrid");
const categoryTabs = document.getElementById("categoryTabs");

// 2. Function to Render Cards dynamically
function renderMenuCards(items) {
  menuGrid.innerHTML = ""; // Clear previous content

  items.forEach((item) => {
    const cardHTML = `
      <div class="food-card" data-id="${item.id}">
        <span class="badge-corner">${item.badge}</span>
        
        <div class="card-img-wrapper">
          <img src="${item.image}" alt="${item.name}" class="card-img" />
        </div>

        <div class="card-title-row">
          <h3 class="card-title">${item.name}</h3>
          <span class="rating">${item.rating}</span>
        </div>

        <p class="small-desc">${item.desc}</p>

        <div class="card-footer">
          <span class="price">${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Add to Cart</button>
        </div>
      </div>
    `;

    menuGrid.innerHTML += cardHTML;
  });
}

// 3. Category Filter Event Listener
categoryTabs.addEventListener("click", (e) => {
  if (e.target.classList.contains("tab-btn")) {
    // Active class toggle
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Filter Logic
    const selectedCategory = e.target.getAttribute("data-category");

    if (selectedCategory === "all") {
      renderMenuCards(dishesData);
    } else {
      const filteredDishes = dishesData.filter(
        (item) => item.category === selectedCategory,
      );
      renderMenuCards(filteredDishes);
    }
  }
});

// 4. Dummy Add to Cart Handler
function addToCart(itemId) {
  const item = dishesData.find((d) => d.id === itemId);
  alert(`${item.name} added to your cart!`);
}

// Initial Render on Page Load
renderMenuCards(dishesData);
