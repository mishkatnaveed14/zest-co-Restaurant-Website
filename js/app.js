/* ==============================================
   APP.JS - ZEST & CO. RESTAURANT
   All Interactions, Animations & Dynamic Content
   ============================================== */

// ===== BOOTSTRAP CAROUSEL INIT =====
const carouselEl = document.querySelector("#home2Carousel");
if (carouselEl) {
  new bootstrap.Carousel(carouselEl, {
    interval: 5000,
    ride: "carousel",
    pause: "hover",
    wrap: true,
  });
}

// ===== FOOD ITEMS DATA =====
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

// ===== NEW ITEMS SWIPER =====
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
      navigation: { nextEl: ".next-btn", prevEl: ".prev-btn" },
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

      if (window.gsap) {
        gsap.to([activeImg, activeTitle, activePrice], {
          opacity: 0,
          y: -10,
          duration: 0.15,
          stagger: 0.03,
          onComplete: () => {
            activeImg.src = food.image;
            activeTitle.textContent = food.title;
            activePrice.textContent = `Price - ${food.price}`;
            gsap.to([activeImg, activeTitle, activePrice], {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.06,
              ease: "power2.out",
            });
          },
        });
      } else {
        activeImg.src = food.image;
        activeTitle.textContent = food.title;
        activePrice.textContent = `Price - ${food.price}`;
      }
    }

    // 3D Tilt Effect
    if (dynamicCard && activeImg) {
      dynamicCard.addEventListener("mousemove", (e) => {
        const rect = dynamicCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        dynamicCard.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
        if (activeImg) {
          activeImg.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        }
      });
      dynamicCard.addEventListener("mouseleave", () => {
        dynamicCard.style.transform = "rotateX(0) rotateY(0)";
        if (activeImg) activeImg.style.transform = "translate(0,0)";
      });
    }

    swiper.on("slideChange", () => updateActiveFood(swiper.realIndex));
    updateActiveFood(0);
  } else {
    if (activeImg && activeTitle && activePrice && foodItems[0]) {
      activeImg.src = foodItems[0].image;
      activeTitle.textContent = foodItems[0].title;
      activePrice.textContent = `Price - ${foodItems[0].price}`;
    }
  }
});

// ===== POPULAR DISHES CAROUSEL =====
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
    desc: "Wok-tossed jasmine rice, charred scallion, fresh prawns, and a soft crown of egg.",
    price: "$12",
    img: "https://images.pexels.com/photos/1630495/pexels-photo-1630495.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles in an 18-hour broth, chashu pork, bamboo shoots, and marinated egg.",
    price: "$19",
    img: "https://images.pexels.com/photos/12984979/pexels-photo-12984979.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Grilled Wings",
    desc: "Charcoal-kissed wings glazed twice in honey-garlic glaze, finished with a squeeze of fresh lime.",
    price: "$11",
    img: "https://images.pexels.com/photos/10648394/pexels-photo-10648394.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  // Naye Unique Items Below ⬇️
  {
    name: "Smoky BBQ Ribs",
    desc: "Slow-cooked pork ribs smothered in house smoky barbecue glaze, fall-off-the-bone tender.",
    price: "$22",
    img: "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Artisan Pepperoni Pizza",
    desc: "Wood-fired crust topped with San Marzano tomato sauce, fresh mozzarella, and spicy pepperoni.",
    price: "$16",
    img: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Crispy Beef Tacos",
    desc: "Trio of crunchy corn tortillas stuffed with seasoned shredded beef, guacamole, and lime crema.",
    price: "$13",
    img: "https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Truffle Mushroom Pasta",
    desc: "Al dente fettuccine coated in creamy black truffle sauce with sautéed wild mushrooms and parmesan.",
    price: "$18",
    img: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    name: "Grilled Salmon Steak",
    desc: "Pan-seared Atlantic salmon with dill butter glaze, roasted asparagus, and mashed potatoes.",
    price: "$24",
    img: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];
const track = document.getElementById("carTrack");
const dotsWrap = document.getElementById("carDots");

function starString(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function buildDishCardHTML(d) {
  return `
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
}

function makeDishCard(d, isClone) {
  const card = document.createElement("div");
  card.className = "dish-card" + (isClone ? " clone" : "");
  card.innerHTML = buildDishCardHTML(d);
  return card;
}

// Seamless infinite loop: clone a few cards on BOTH ends of the real set,
// so going past the first/last real card slides smoothly into a clone,
// then we silently snap back to the matching real position (no jump).
const CLONE_COUNT = Math.min(2, DISHES.length - 1);
const totalDots = DISHES.length;

DISHES.slice(-CLONE_COUNT).forEach((d) =>
  track.appendChild(makeDishCard(d, true)),
); // leading clones
DISHES.forEach((d) => track.appendChild(makeDishCard(d, false))); // real cards
DISHES.slice(0, CLONE_COUNT).forEach((d) =>
  track.appendChild(makeDishCard(d, true)),
); // trailing clones

for (let i = 0; i < totalDots; i++) {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    goToDot(i);
    restartAutoplay();
  });
  dotsWrap.appendChild(dot);
}

let position = CLONE_COUNT; // index into the extended (clone + real + clone) track
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

function updateDots(realIndex) {
  const dots = dotsWrap.querySelectorAll("span");
  dots.forEach((d, idx) => d.classList.toggle("active", idx === realIndex));
}

// After the slide animation finishes, if we've drifted into the cloned
// zone, silently snap back to the equivalent real position (no animation),
// so the loop feels endless in both directions.
function checkLoopBounds() {
  if (position >= CLONE_COUNT + totalDots) {
    position -= totalDots;
    setTrackPosition(position, false);
  } else if (position < CLONE_COUNT) {
    position += totalDots;
    setTrackPosition(position, false);
  }
}

function setTrackPosition(pos, animate) {
  const offset = pos * cardWidthWithGap;
  if (window.gsap) {
    gsap.to(track, {
      x: -offset,
      duration: animate ? 0.7 : 0,
      ease: "power3.out",
      onComplete: checkLoopBounds,
    });
  } else {
    track.style.transform = `translateX(-${offset}px)`;
    checkLoopBounds();
  }
}

function goToRelative(step) {
  position += step;
  const realIndex =
    (((position - CLONE_COUNT) % totalDots) + totalDots) % totalDots;
  updateDots(realIndex);
  setTrackPosition(position, true);
}

function goToDot(i) {
  position = CLONE_COUNT + i;
  updateDots(i);
  setTrackPosition(position, true);
}

document.getElementById("carPrev")?.addEventListener("click", () => {
  goToRelative(-1);
  restartAutoplay();
});
document.getElementById("carNext")?.addEventListener("click", () => {
  goToRelative(1);
  restartAutoplay();
});

let autoplayTimer;
function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToRelative(1), 4200);
}

// Swipe support
let startX = 0,
  isDragging = false;
track?.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX;
});
window.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.clientX - startX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) goToRelative(1);
    else goToRelative(-1);
    restartAutoplay();
  }
});

window.addEventListener("resize", () => {
  measure();
  setTrackPosition(position, false);
});
window.addEventListener("load", () => {
  measure();
  setTrackPosition(position, false);
  restartAutoplay();
});

// ===== SPOTLIGHT GALLERY =====
const thumbsWrap = document.getElementById("spotlightThumbs");
const spotImg = document.getElementById("spotlightImg");
const spotName = document.getElementById("spotlightName");
const spotDesc = document.getElementById("spotlightDesc");
const spotPrice = document.getElementById("spotlightPrice");

if (thumbsWrap) {
  thumbsWrap.innerHTML = "";
  SPOTLIGHT_ITEMS.forEach((item, idx) => {
    const thumb = document.createElement("div");
    thumb.className = "thumb" + (idx === 0 ? " active" : "");
    thumb.innerHTML = `<img src="${item.img}" alt="${item.name}"><span class="thumb-label">${item.name}</span>`;
    thumb.addEventListener("click", () => setSpotlight(idx));
    thumbsWrap.appendChild(thumb);
  });
}

function setSpotlight(idx) {
  const item = SPOTLIGHT_ITEMS[idx];
  const thumbs = thumbsWrap?.querySelectorAll(".thumb");

  thumbs?.forEach((t, i) => {
    const isActive = i === idx;
    t.classList.toggle("active", isActive);

    // Auto-scroll fix: Selected thumb ko softly scroll container me middle me rakhein
    if (isActive) {
      t.scrollIntoView({
        behavior: "smooth",
        block: "nearest" /* Is se poori screen/list jump nahi karegi */,
        inline: "nearest",
      });
    }
  });

  if (window.gsap && spotImg) {
    gsap.to(spotImg, {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        spotImg.src = item.img;
        gsap.to(spotImg, { opacity: 1, duration: 0.3 });
      },
    });

    gsap.fromTo(
      "#spotlightName, #spotlightDesc, #spotlightPrice",
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
    );
  } else if (spotImg) {
    spotImg.src = item.img;
  }

  if (spotName) spotName.textContent = item.name;
  if (spotDesc) spotDesc.textContent = item.desc;
  if (spotPrice) spotPrice.textContent = item.price;
}
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
document
  .querySelectorAll(".mobile-nav-links a")
  .forEach((a) => a.addEventListener("click", closeMobileMenu));

// ===== GSAP / SCROLL ANIMATIONS =====
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Entrance animations
  gsap.from(".top-bar", {
    y: -30,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });
  gsap.from(".header-logo", {
    x: -30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    delay: 0.1,
  });
  gsap.from(".nav-link", {
    y: -20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "power2.out",
    delay: 0.2,
  });
  gsap.from(".navbar-actions", {
    x: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    delay: 0.4,
  });

  // Hero entrance
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
  gsap.from(".highlight-pill", {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.15,
    ease: "back.out(1.4)",
    delay: 0.8,
  });

  // Scroll-triggered animations
  function animateFrom(selector, vars, trigger) {
    gsap.from(selector, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger || selector,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      ...vars,
    });
  }

  animateFrom(".dish-card", { y: 60, stagger: 0.1 }, "#popular");
  animateFrom(".premium-card", { y: 60 });
  animateFrom(
    ".food-card",
    { y: 50, stagger: 0.08 },
    ".menu-highlights-section",
  );
  animateFrom(
    ".quick-card",
    { y: 40, stagger: 0.1, ease: "back.out(1.4)" },
    ".quick-action-section",
  );
  animateFrom(".stat-item", { y: 40, stagger: 0.1 }, ".stats-counter-section");
  animateFrom(".testimonial-card", { y: 50 }, ".testimonials-section");
  animateFrom(".footer-grid > div", { y: 40, stagger: 0.1 }, ".footer");

  // Section headings
  gsap.utils.toArray(".section-head, .section-header").forEach((h) => {
    animateFrom(h, {});
  });
  window.addEventListener("load", () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 1000);
} else {
  // Fallback
  document
    .querySelectorAll(
      ".dish-card, .premium-card, .food-card, .quick-card, .stat-item, .footer-grid > div, .spotlight-feature, .spotlight-thumbs .thumb",
    )
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
}

// ===== MENU HIGHLIGHTS - SMOOTH TAB TRANSITIONS =====
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
  {
    id: 5,
    name: "Smoked Salmon Benedict",
    category: "specials",
    badge: "Fresh 🐟",
    price: "$16.00",
    rating: "4.8 ★",
    desc: "Poached eggs on toasted brioche with house-smoked salmon and hollandaise.",
    image:
      "https://images.unsplash.com/photo-1608039829572-e2e6c44a32a4?w=500&q=80",
  },
  {
    id: 6,
    name: "Double Chocolate Mousse",
    category: "desserts",
    badge: "NEW 🔥",
    price: "$9.50",
    rating: "4.9 ★",
    desc: "Rich dark chocolate mousse with a silky caramel core and gold leaf finish.",
    image:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=500&q=80",
  },
  {
    id: 7,
    name: "Lamb Kofta Kebab",
    category: "bestsellers",
    badge: "Halal ☪️",
    price: "$15.00",
    rating: "4.7 ★",
    desc: "Spiced minced lamb skewers, chargrilled and served with garlic yogurt dip.",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80",
  },
  {
    id: 8,
    name: "Mango & Passionfruit Tart",
    category: "desserts",
    badge: "Seasonal 🥭",
    price: "$7.50",
    rating: "4.6 ★",
    desc: "Buttery pastry shell filled with tropical fruit curd and toasted meringue.",
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&q=80",
  },
];

const menuGrid = document.getElementById("menuGrid");
const categoryTabs = document.getElementById("categoryTabs");

function renderMenuCards(items) {
  menuGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.95)";
    card.innerHTML = `
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
    `;
    fragment.appendChild(card);
  });

  menuGrid.appendChild(fragment);

  // Stagger entrance animation
  const cards = menuGrid.querySelectorAll(".food-card");
  if (window.gsap) {
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
    });
  } else {
    cards.forEach((c) => {
      c.style.opacity = "1";
      c.style.transform = "none";
    });
  }
}

// Tab switching with smooth animation
categoryTabs?.addEventListener("click", (e) => {
  if (!e.target.classList.contains("tab-btn")) return;

  // Update active tab
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  // Animate active tab
  if (window.gsap) {
    gsap.fromTo(
      e.target,
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: "back.out(2)" },
    );
  }

  const selectedCategory = e.target.getAttribute("data-category");
  const filtered =
    selectedCategory === "all"
      ? dishesData
      : dishesData.filter((item) => item.category === selectedCategory);
  renderMenuCards(filtered);
});

function addToCart(itemId) {
  const item = dishesData.find((d) => d.id === itemId);
  if (item) alert(`${item.name} added to your cart!`);
}

renderMenuCards(dishesData);

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById("cursorGlow");
if (cursorGlow) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
    cursorGlow.classList.add("visible");
  });
  document.addEventListener("mouseleave", () =>
    cursorGlow.classList.remove("visible"),
  );
}

// ===== STATS COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll(".stat-count");
  if (!counters.length) return;
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2500;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        return;
      }
      counter.textContent = current;
      requestAnimationFrame(update);
    };
    update();
  });
}

const statsSection = document.querySelector(".stats-counter-section");
if (statsSection && window.gsap && window.ScrollTrigger) {
  ScrollTrigger.create({
    trigger: statsSection,
    start: "top 85%",
    onEnter: () => animateCounters(),
    once: true,
  });
} else if (statsSection) {
  // GSAP/ScrollTrigger available nahi hai to counters seedha chala do
  animateCounters();
}

// ===== TESTIMONIALS =====

// ===== FORMS & UTILITIES =====
document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("newsletterConfirm");
  if (msg) msg.textContent = "You're on the list!";
  e.target.reset();
});

document.getElementById("reserveForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("reserveConfirm");
  if (msg)
    msg.textContent =
      "Table request received — we'll confirm by phone shortly.";
  e.target.reset();
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== HERO PARALLAX =====
const heroSection = document.querySelector(".hero-carousel-section");
if (heroSection) {
  heroSection.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    const carousel = heroSection.querySelector(".home2-carousel");
    const slideImage = heroSection.querySelector(".slide-image");
    if (carousel)
      carousel.style.transform = `perspective(1000px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
    if (slideImage)
      slideImage.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  });
  heroSection.addEventListener("mouseleave", () => {
    const carousel = heroSection.querySelector(".home2-carousel");
    const slideImage = heroSection.querySelector(".slide-image");
    if (carousel) carousel.style.transform = "";
    if (slideImage) slideImage.style.transform = "";
  });
}

// ===== POPULAR DISHES CAROUSEL =====
const DISHES = [
  { name: "Beef Machal", desc: "Bone-in cutlet finished over open flame, rested with rosemary and cracked pepper.", price: 25, reviews: 20, rating: 4, img: "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=700", featured: false },
  { name: "Beef Biryani", desc: "48-hour dum-cooked rice, tender beef, whole chillies and a whisper of saffron.", price: 28, reviews: 37, rating: 5, img: "https://images.pexels.com/photos/1630495/pexels-photo-1630495.jpeg?auto=compress&cs=tinysrgb&w=700", featured: true },
  { name: "Thai Soup", desc: "Overnight broth, soft egg, scallion and chilli oil, served bubbling hot.", price: 21, reviews: 54, rating: 4, img: "https://images.pexels.com/photos/12984982/pexels-photo-12984982.jpeg?auto=compress&cs=tinysrgb&w=700", featured: false },
  { name: "Fried Chicken", desc: "Double-brined, double-fried, resting on herb salt with a citrus dip.", price: 14, reviews: 62, rating: 5, img: "https://images.pexels.com/photos/16892378/pexels-photo-16892378.jpeg?auto=compress&cs=tinysrgb&w=700", featured: false },
  { name: "Ramen Bowl", desc: "Hand-pulled noodles, chashu pork, marinated egg, nori and scallion oil.", price: 19, reviews: 45, rating: 5, img: "https://images.pexels.com/photos/17593641/pexels-photo-17593641.jpeg?auto=compress&cs=tinysrgb&w=700", featured: false },
  { name: "Grilled Salmon", desc: "Pan-seared Atlantic salmon, dill butter glaze, roasted asparagus and mash.", price: 24, reviews: 31, rating: 4, img: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=700", featured: false },
];

const track = document.getElementById("carTrack");
const dotsWrap = document.getElementById("carDots");
const nextRing = document.querySelector(".car-arrow.next .ring circle");

function starString(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

const plusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;

function buildDishCardHTML(d, idx) {
  return `
    <div class="dish-img-wrap">
      <div class="price-blob ${d.featured ? "gold" : "white"}">$${d.price}</div>
      ${d.featured ? '<span class="dish-ribbon">Chef\'s Pick</span>' : ""}
      <img src="${d.img}" alt="${d.name}" loading="lazy">
      <button type="button" class="quick-order-btn" data-add="${idx}">${plusIcon} Quick Add</button>
    </div>
    <div class="dish-body">
      <div class="dish-rating">
        <span class="stars" aria-label="${d.rating} out of 5 stars">${starString(d.rating)}</span>
        <span class="reviews">${d.reviews} reviews</span>
      </div>
      <h3>${d.name}</h3>
      <p>${d.desc}</p>
      <div class="dish-footer">
        <span class="price-tag">$${d.price.toFixed(2)}</span>
        <div class="stepper" data-stepper="${idx}">
          <button type="button" data-dec="${idx}" aria-label="Decrease quantity">−</button>
          <span data-qty="${idx}">1</span>
          <button type="button" data-inc="${idx}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    </div>
  `;
}

function makeDishCard(d, isClone, idx) {
  const card = document.createElement("div");
  card.className = "dish-card" + (d.featured ? " featured" : "") + (isClone ? " clone" : "");
  card.setAttribute("role", "listitem");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `${d.name}, $${d.price}`);
  card.innerHTML = buildDishCardHTML(d, idx);
  return card;
}

const CLONE_COUNT = Math.min(2, DISHES.length - 1);
const totalDots = DISHES.length;

DISHES.slice(-CLONE_COUNT).forEach((d, i) => track.appendChild(makeDishCard(d, true, DISHES.length - CLONE_COUNT + i)));
DISHES.forEach((d, i) => track.appendChild(makeDishCard(d, false, i)));
DISHES.slice(0, CLONE_COUNT).forEach((d, i) => track.appendChild(makeDishCard(d, true, i)));

for (let i = 0; i < totalDots; i++) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", "Go to " + DISHES[i].name);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => { goToDot(i); restartAutoplay(); });
  dotsWrap.appendChild(dot);
}

let position = CLONE_COUNT;
let cardWidthWithGap = 0;

function measure() {
  const cards = track.querySelectorAll(".dish-card");
  if (!cards.length) return;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap) || 26;
  cardWidthWithGap = cards[0].getBoundingClientRect().width + gap;
}

function updateDots(realIndex) {
  dotsWrap.querySelectorAll("button").forEach((d, idx) => d.classList.toggle("active", idx === realIndex));
}

function checkLoopBounds() {
  if (position >= CLONE_COUNT + totalDots) {
    position -= totalDots;
    setTrackPosition(position, false);
  } else if (position < CLONE_COUNT) {
    position += totalDots;
    setTrackPosition(position, false);
  }
}

function setTrackPosition(pos, animate) {
  const offset = pos * cardWidthWithGap;
  track.style.transition = animate ? "transform .7s cubic-bezier(.22,1,.36,1)" : "none";
  track.style.transform = `translateX(-${offset}px)`;
  if (animate) {
    track.addEventListener("transitionend", checkLoopBounds, { once: true });
  } else {
    checkLoopBounds();
  }
}

function goToRelative(step) {
  position += step;
  const realIndex = ((position - CLONE_COUNT) % totalDots + totalDots) % totalDots;
  updateDots(realIndex);
  setTrackPosition(position, true);
}

function goToDot(i) {
  position = CLONE_COUNT + i;
  updateDots(i);
  setTrackPosition(position, true);
}

document.getElementById("carPrev")?.addEventListener("click", () => { goToRelative(-1); restartAutoplay(); });
document.getElementById("carNext")?.addEventListener("click", () => { goToRelative(1); restartAutoplay(); });

let autoplayTimer;
const AUTOPLAY_MS = 4200;

function runDial() {
  if (!nextRing) return;
  nextRing.classList.remove("run");
  void nextRing.offsetWidth;
  nextRing.style.animationDuration = AUTOPLAY_MS + "ms";
  nextRing.classList.add("run");
}
function pauseDial() { nextRing?.classList.add("paused"); }
function resumeDial() { nextRing?.classList.remove("paused"); }

function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToRelative(1), AUTOPLAY_MS);
  runDial();
}

// Swipe / drag support
let startX = 0, isDragging = false;
track?.addEventListener("pointerdown", (e) => { isDragging = true; startX = e.clientX; track.setPointerCapture(e.pointerId); });
track?.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.clientX - startX;
  if (Math.abs(diff) > 40) {
    goToRelative(diff < 0 ? 1 : -1);
    restartAutoplay();
  }
});

// Keyboard navigation
document.getElementById("carousel")?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") { goToRelative(-1); restartAutoplay(); }
  if (e.key === "ArrowRight") { goToRelative(1); restartAutoplay(); }
});

// Quantity steppers + Quick Add (toast instead of alert)
track?.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const add = e.target.closest("[data-add]");
  if (inc || dec) {
    const idx = (inc || dec).dataset.inc ?? (inc || dec).dataset.dec;
    track.querySelectorAll(`[data-qty="${idx}"]`).forEach((el) => {
      let val = parseInt(el.textContent, 10) || 1;
      val = inc ? Math.min(9, val + 1) : Math.max(1, val - 1);
      el.textContent = val;
    });
  }
  if (add) {
    const idx = add.dataset.add;
    const dish = DISHES[idx];
    const qty = track.querySelector(`[data-qty="${idx}"]`)?.textContent || 1;
    showToast(`${dish.name} × ${qty} added to your order`);
    add.innerHTML = checkIcon + " Added";
    setTimeout(() => { add.innerHTML = plusIcon + " Quick Add"; }, 1400);
  }
});

function showToast(msg) {
  let wrap = document.getElementById("toastWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toastWrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${checkIcon}<span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 350);
  }, 2600);
}

// Pause on hover / focus
const popularCarouselEl = document.getElementById("carousel");
popularCarouselEl?.addEventListener("mouseenter", () => { clearInterval(autoplayTimer); pauseDial(); });
popularCarouselEl?.addEventListener("mouseleave", () => { resumeDial(); restartAutoplay(); });
popularCarouselEl?.addEventListener("focusin", () => { clearInterval(autoplayTimer); pauseDial(); });
popularCarouselEl?.addEventListener("focusout", () => { resumeDial(); restartAutoplay(); });

window.addEventListener("resize", () => { measure(); setTrackPosition(position, false); });
window.addEventListener("load", () => { measure(); setTrackPosition(position, false); restartAutoplay(); });