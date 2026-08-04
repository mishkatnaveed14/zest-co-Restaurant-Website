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
    image: "./assets/images/food/momo-package.jpg",
  },
  {
    id: 2,
    title: "Chicken Fried",
    price: "$12.00",
    image: "./assets/images/food/chicken-fried.jpg",
  },
  {
    id: 3,
    title: "Vegetable Salad",
    price: "$6.00",
    image: "./assets/images/food/vegetable-salad.jpg",
  },
  {
    id: 5,
    title: "Chicken Kebab",
    price: "$10.00",
    image: "./assets/images/food/chicken-kebab.jpg",
  },
  {
    id: 6,
    title: "Beef Burger",
    price: "$9.00",
    image: "./assets/images/food/beef-burger.jpg",
  },
  {
    id: 7,
    title: "Special Biryani",
    price: "$11.00",
    image: "./assets/images/food/special-biryani.jpg",
  },
  {
    id: 8,
    title: "Pepperoni Pizza",
    price: "$14.00",
    image: "./assets/images/food/pepperoni-pizza.jpg",
  },
  {
    id: 9,
    title: "Ramen Noodles",
    price: "$13.00",
    image: "./assets/images/food/ramen-noodles.jpg",
  },
  {
    id: 11,
    title: "Grilled Salmon",
    price: "$22.00",
    image: "./assets/images/food/grilled-salmon.jpg",
  },
  {
    id: 12,
    title: "Crispy Tacos",
    price: "$7.50",
    image: "./assets/images/food/crispy-tacos.jpg",
  },
  {
    id: 13,
    title: "Butter Chicken",
    price: "$15.00",
    image: "./assets/images/food/butter-chicken.jpg",
  },
  {
    id: 14,
    title: "Fettuccine Alfredo",
    price: "$14.50",
    image: "./assets/images/food/fettuccine-alfredo.jpg",
  },
  {
    id: 15,
    title: "Club Sandwich",
    price: "$8.50",
    image: "./assets/images/food/club-sandwich.jpg",
  },
  {
    id: 16,
    title: "Chocolate Lava",
    price: "$6.50",
    image: "./assets/images/food/chocolate-lava.jpg",
  },
  {
    id: 17,
    title: "Strawberry Waffles",
    price: "$7.00",
    image: "./assets/images/food/strawberry-waffles.jpg",
  },
  {
    id: 18,
    title: "Mint Margarita",
    price: "$4.00",
    image: "./assets/images/food/mint-margarita.jpg",
  },
  {
    id: 19,
    title: "Gulab Jamun Plate",
    price: "$5.00",
    image: "./assets/images/food/gulab-jamun-plate.jpg",
  },
  {
    id: 20,
    title: "Premium Cappuccino",
    price: "$4.50",
    image: "./assets/images/food/premium-cappuccino.jpg",
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
        if (activeImg)
          activeImg.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
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

// ===== SPOTLIGHT ITEMS DATA =====
const SPOTLIGHT_ITEMS = [
  {
    name: "Golden Fried Chicken",
    desc: "Double-brined overnight, dredged twice, fried to a shattering crust and rested on herb salt.",
    price: "$14",
    img: "./assets/images/spotlight/golden-fried-chicken.jpg",
  },
  {
    name: "Steamed Dumplings",
    desc: "Hand-folded parcels, minced beef and ginger, steamed to order and served with black vinegar.",
    price: "$9",
    img: "./assets/images/spotlight/steamed-dumplings.jpg",
  },
  {
    name: "Chef's Fried Rice",
    desc: "Wok-tossed jasmine rice, charred scallion, fresh prawns, and a soft crown of egg.",
    price: "$12",
    img: "./assets/images/spotlight/chefs-fried-rice.jpg",
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles in an 18-hour broth, chashu pork, bamboo shoots, and marinated egg.",
    price: "$19",
    img: "./assets/images/spotlight/ramen-bowl.jpg",
  },
  {
    name: "Grilled Wings",
    desc: "Charcoal-kissed wings glazed twice in honey-garlic glaze, finished with a squeeze of fresh lime.",
    price: "$11",
    img: "./assets/images/spotlight/grilled-wings.jpg",
  },
  {
    name: "Smoky BBQ Ribs",
    desc: "Slow-cooked pork ribs smothered in house smoky barbecue glaze, fall-off-the-bone tender.",
    price: "$22",
    img: "./assets/images/spotlight/smoky-bbq-ribs.jpg",
  },
  {
    name: "Artisan Pepperoni Pizza",
    desc: "Wood-fired crust topped with San Marzano tomato sauce, fresh mozzarella, and spicy pepperoni.",
    price: "$16",
    img: "./assets/images/spotlight/artisan-pepperoni-pizza.jpg",
  },
  {
    name: "Crispy Beef Tacos",
    desc: "Trio of crunchy corn tortillas stuffed with seasoned shredded beef, guacamole, and lime crema.",
    price: "$13",
    img: "./assets/images/spotlight/crispy-beef-tacos.jpg",
  },
  {
    name: "Truffle Mushroom Pasta",
    desc: "Al dente fettuccine coated in creamy black truffle sauce with sautéed wild mushrooms and parmesan.",
    price: "$18",
    img: "./assets/images/spotlight/truffle-mushroom-pasta.jpg",
  },
  {
    name: "Grilled Salmon Steak",
    desc: "Pan-seared Atlantic salmon with dill butter glaze, roasted asparagus, and mashed potatoes.",
    price: "$24",
    img: "./assets/images/spotlight/grilled-salmon-steak.jpg",
  },
];

const DISHES = [
  {
    name: "Beef Machal",
    desc: "Bone-in cutlet finished over open flame, rested with rosemary and cracked pepper.",
    price: 25,
    reviews: 20,
    rating: 4,
    img: "./assets/images/dishes/beef-machal.jpg",
    featured: false,
  },
  {
    name: "Beef Biryani",
    desc: "48-hour dum-cooked rice, tender beef, whole chillies and a whisper of saffron.",
    price: 28,
    reviews: 37,
    rating: 5,
    img: "./assets/images/dishes/beef-biryani.jpg",
    featured: true,
  },
  {
    name: "Thai Soup",
    desc: "Overnight broth, soft egg, scallion and chilli oil, served bubbling hot.",
    price: 21,
    reviews: 54,
    rating: 4,
    img: "./assets/images/dishes/thai-soup.jpg",
    featured: false,
  },
  {
    name: "Fired Chicken",
    desc: "Double-brined, double-fried, resting on herb salt with a citrus dip.",
    price: 14,
    reviews: 62,
    rating: 5,
    img: "./assets/images/dishes/fried-chicken.jpg",
    featured: false,
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles, chashu pork, marinated egg, nori and scallion oil.",
    price: 19,
    reviews: 45,
    rating: 5,
    img: "./assets/images/dishes/ramen-bowl.jpg",
    featured: false,
  },
];

const track = document.getElementById("carTrack");
const dotsWrap = document.getElementById("carDots");
const popularCarouselEl = document.getElementById("carousel");
const carNextBtn = document.getElementById("carNext");
const carPrevBtn = document.getElementById("carPrev");
const dialRing = carNextBtn ? carNextBtn.querySelector(".ring circle") : null;

function starString(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function buildDishCardHTML(d) {
  return `
    <div class="dish-img-wrap">
      <div class="price-blob ${d.featured ? "gold" : "white"}">$${d.price}</div>
      ${d.featured ? '<span class="dish-ribbon">Chef\'s Pick</span>' : ""}
      <img src="${d.img}" alt="${d.name}" loading="lazy">
      <button type="button" class="quick-order-btn" onclick="alert('${d.name} added to your order!')">
        <i class="bi bi-lightning-charge-fill"></i> Order Now
      </button>
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
  card.className =
    "dish-card" + (d.featured ? " featured" : "") + (isClone ? " clone" : "");
  card.innerHTML = buildDishCardHTML(d);
  return card;
}

const CLONE_COUNT = track ? Math.min(2, DISHES.length - 1) : 0;
const totalDots = DISHES.length;

if (track) {
  DISHES.slice(-CLONE_COUNT).forEach((d) =>
    track.appendChild(makeDishCard(d, true)),
  ); // leading clones
  DISHES.forEach((d) => track.appendChild(makeDishCard(d, false))); // real cards
  DISHES.slice(0, CLONE_COUNT).forEach((d) =>
    track.appendChild(makeDishCard(d, true)),
  ); // trailing clones
}

if (dotsWrap) {
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToDot(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  }
}

let position = CLONE_COUNT; // index into the extended (clone + real + clone) track
let cardWidthWithGap = 0;
let autoplayTimer = null;

function measure() {
  if (!track) return;
  const cards = track.querySelectorAll(".dish-card");
  if (!cards.length) return;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap) || 26;
  cardWidthWithGap = cards[0].getBoundingClientRect().width + gap;
}

function updateDots(realIndex) {
  if (!dotsWrap) return;
  const dots = dotsWrap.querySelectorAll("span");
  dots.forEach((d, idx) => d.classList.toggle("active", idx === realIndex));
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
  if (!track) return;
  measure();
  const offset = pos * cardWidthWithGap;
  if (window.gsap) {
    gsap.to(track, {
      x: -offset,
      duration: animate ? 0.7 : 0,
      ease: "power3.out",
      onComplete: checkLoopBounds,
    });
  } else {
    track.style.transition = animate
      ? "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)"
      : "none";
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

carPrevBtn?.addEventListener("click", () => {
  goToRelative(-1);
  restartAutoplay();
});
carNextBtn?.addEventListener("click", () => {
  goToRelative(1);
  restartAutoplay();
});

// ----- Autoplay + dial-ring countdown -----
function resetDialAnimation() {
  if (!dialRing) return;
  dialRing.classList.remove("run");
  void dialRing.getBoundingClientRect(); // force reflow so the animation restarts cleanly
  dialRing.classList.add("run");
}

function startAutoplay() {
  if (!track) return;
  stopAutoplay();
  resetDialAnimation();
  autoplayTimer = setInterval(() => {
    goToRelative(1);
    resetDialAnimation();
  }, 4200);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  if (dialRing) dialRing.classList.remove("run");
}

function restartAutoplay() {
  startAutoplay();
}

// Pause on hover, resume on mouse leave
popularCarouselEl?.addEventListener("mouseenter", () => {
  if (dialRing) dialRing.classList.add("paused");
  if (autoplayTimer) clearInterval(autoplayTimer);
});
popularCarouselEl?.addEventListener("mouseleave", () => {
  if (dialRing) dialRing.classList.remove("paused");
  startAutoplay();
});

// Swipe / drag support
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

// THE FIX: actually initialize the carousel on load — set the correct
// starting position AND start autoplay. Previously this never ran, so
// the carousel sat misaligned and never auto-scrolled.
window.addEventListener("load", () => {
  measure();
  setTrackPosition(position, false);
  startAutoplay();
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
    if (isActive) {
      t.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
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
// Close the mobile menu when clicking a real navigation link,
// but NOT the dropdown toggle (so the PAGES submenu can open).
document
  .querySelectorAll(".mobile-nav-links a:not(.dropdown-toggle)")
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

  // Highlight pills entrance (single source of truth — do not duplicate elsewhere)
  gsap.fromTo(
    ".highlight-pill",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: "back.out(1.4)",
      delay: 0.8,
      clearProps: "opacity,transform",
    },
  );

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
  // NOTE: .stat-item is animated separately via IntersectionObserver in the
  // "STATS COUNTER" block below (more reliable). Do not animate it here.
  animateFrom(".testimonial-card", { y: 50 }, ".testimonials-section");
  animateFrom(".footer-grid > div", { y: 40, stagger: 0.1 }, ".footer");

  // Section headings
  gsap.utils
    .toArray(".section-head, .section-header")
    .forEach((h) => animateFrom(h, {}));

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();

    const allImages = document.querySelectorAll("img");
    const imagePromises = Array.from(allImages).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });

    Promise.all(imagePromises).then(() => ScrollTrigger.refresh());
  });

  // Extra safety net refresh in case fonts/late layout shifts happen
  setTimeout(() => ScrollTrigger.refresh(), 2000);
} else {
  // Fallback — GSAP/ScrollTrigger not available, just show everything instantly
  document
    .querySelectorAll(
      ".dish-card, .premium-card, .food-card, .quick-card, .stat-item, .footer-grid > div, .spotlight-feature, .spotlight-thumbs .thumb, .highlight-pill",
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
    image: "./assets/images/menu/zesty-smash-burger.jpg",
  },
  {
    id: 2,
    name: "Truffle Mushroom Risotto",
    category: "specials",
    badge: "Vegan 🌱",
    price: "$18.50",
    rating: "4.8 ★",
    desc: "Creamy arborio rice infused with wild mushrooms and authentic black truffle oil.",
    image: "./assets/images/menu/truffle-mushroom-risotto.jpg",
  },
  {
    id: 3,
    name: "Fiery Peri Peri Wings",
    category: "combos",
    badge: "Spicy 🌶️",
    price: "$14.00",
    rating: "4.7 ★",
    desc: "Flame-grilled chicken wings tossed in intense African bird's eye chili glaze.",
    image: "./assets/images/menu/fiery-peri-peri-wings.jpg",
  },
  {
    id: 4,
    name: "Classic Berry Cheesecake",
    category: "desserts",
    badge: "Chef's Pick ⭐",
    price: "$8.99",
    rating: "4.9 ★",
    desc: "Velvety New York style cheesecake topped with fresh wild berry reduction.",
    image: "./assets/images/menu/classic-berry-cheesecake.jpg",
  },
  {
    id: 5,
    name: "Smoked Salmon Benedict",
    category: "specials",
    badge: "Fresh 🐟",
    price: "$16.00",
    rating: "4.8 ★",
    desc: "Poached eggs on toasted brioche with house-smoked salmon and hollandaise.",
    image: "./assets/images/menu/smoked-salmon-benedict.jpg",
  },
  {
    id: 6,
    name: "Double Chocolate Mousse",
    category: "desserts",
    badge: "NEW 🔥",
    price: "$9.50",
    rating: "4.9 ★",
    desc: "Rich dark chocolate mousse with a silky caramel core and gold leaf finish.",
    image: "./assets/images/menu/double-chocolate-mousse.jpg",
  },
  {
    id: 7,
    name: "Lamb Kofta Kebab",
    category: "bestsellers",
    badge: "Halal ☪️",
    price: "$15.00",
    rating: "4.7 ★",
    desc: "Spiced minced lamb skewers, chargrilled and served with garlic yogurt dip.",
    image: "./assets/images/menu/lamb-kofta-kebab.jpg",
  },
  {
    id: 8,
    name: "Mango & Passionfruit Tart",
    category: "desserts",
    badge: "Seasonal 🥭",
    price: "$7.50",
    rating: "4.6 ★",
    desc: "Buttery pastry shell filled with tropical fruit curd and toasted meringue.",
    image: "./assets/images/menu/mango-passionfruit-tart.jpg",
  },
  {
    id: 9,
    name: "Grilled Salmon Steak",
    category: "bestsellers",
    badge: "Chef's Pick ⭐",
    price: "$21.00",
    rating: "4.9 ★",
    desc: "Pan-seared Atlantic salmon with a golden butter glaze and charred lemon.",
    image: "./assets/images/spotlight/grilled-salmon-steak.jpg",
  },
  {
    id: 10,
    name: "Golden Fried Chicken",
    category: "bestsellers",
    badge: "Crispy 🍗",
    price: "$13.00",
    rating: "4.8 ★",
    desc: "Double-dredged, crackling-crisp fried chicken rested on a bed of herb salt.",
    image: "./assets/images/spotlight/golden-fried-chicken.jpg",
  },
  {
    id: 11,
    name: "Artisan Pepperoni Pizza",
    category: "combos",
    badge: "Wood-Fired 🔥",
    price: "$16.00",
    rating: "4.8 ★",
    desc: "Wood-fired crust, San Marzano tomato, fresh mozzarella and spicy pepperoni.",
    image: "./assets/images/spotlight/artisan-pepperoni-pizza.jpg",
  },
  {
    id: 12,
    name: "Smoky BBQ Ribs",
    category: "combos",
    badge: "Family Combo 🍖",
    price: "$22.00",
    rating: "4.9 ★",
    desc: "Slow-cooked pork ribs smothered in house smoky barbecue glaze.",
    image: "./assets/images/spotlight/smoky-bbq-ribs.jpg",
  },
  {
    id: 13,
    name: "Chef's Fried Rice",
    category: "specials",
    badge: "Wok-Tossed 🍳",
    price: "$12.00",
    rating: "4.7 ★",
    desc: "Jasmine rice tossed in a hot wok with prawns, charred scallion and egg.",
    image: "./assets/images/spotlight/chefs-fried-rice.jpg",
  },
  {
    id: 14,
    name: "Ramen Bowl",
    category: "specials",
    badge: "Signature 🍜",
    price: "$19.00",
    rating: "4.9 ★",
    desc: "Hand-pulled noodles in an 18-hour broth with chashu pork and marinated egg.",
    image: "./assets/images/spotlight/ramen-bowl.jpg",
  },
  {
    id: 15,
    name: "Strawberry Waffles",
    category: "desserts",
    badge: "Sweet Treat 🍓",
    price: "$7.00",
    rating: "4.7 ★",
    desc: "Golden waffles crowned with fresh strawberries, cream and warm syrup.",
    image: "./assets/images/food/strawberry-waffles.jpg",
  },
  {
    id: 16,
    name: "Chocolate Lava Cake",
    category: "desserts",
    badge: "Molten 🍫",
    price: "$6.50",
    rating: "4.8 ★",
    desc: "Warm chocolate cake with a gooey molten centre and a scoop of vanilla.",
    image: "./assets/images/food/chocolate-lava.jpg",
  },
];

const menuGrid = document.getElementById("menuGrid");
const categoryTabs = document.getElementById("categoryTabs");

function renderMenuCards(items) {
  if (!menuGrid) return;
  menuGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.95)";
    card.innerHTML = `
      <span class="badge-corner">${item.badge}</span>
      <div class="card-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="card-img" />
        <div class="card-img-overlay">
          <span class="quick-view" onclick="addToCart(${item.id})"><i class="bi bi-bag-plus"></i> Quick Add</span>
        </div>
      </div>
      <div class="card-body-content">
        <div class="card-title-row">
          <h3 class="card-title">${item.name}</h3>
          <span class="rating">${item.rating}</span>
        </div>
        <p class="small-desc">${item.desc}</p>
        <div class="card-divider"></div>
        <div class="card-footer">
          <span class="price">${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">
            <i class="bi bi-plus-lg"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  menuGrid.appendChild(fragment);

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

categoryTabs?.addEventListener("click", (e) => {
  if (!e.target.classList.contains("tab-btn")) return;

  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

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
// Uses the native IntersectionObserver (highly reliable) instead of
// ScrollTrigger so the counters + entrance animations always trigger as
// the section scrolls into view.
document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".stats-counter-section");
  if (!statsSection) return;

  function animateCounters() {
    const counters = document.querySelectorAll(".stat-count");
    counters.forEach((counter) => {
      if (counter.dataset.animated === "true") return;
      counter.dataset.animated = "true";

      const target = parseInt(counter.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      const duration = 2200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo for a satisfying, snappy count-up
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Attractive staggered entrance for each stat item
  const statItems = Array.from(statsSection.querySelectorAll(".stat-item"));
  if (statItems.length) {
    // Set the initial hidden state (only if GSAP is available we let GSAP
    // animate; otherwise use CSS transitions via inline styles).
    statItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(50px) scale(0.9) rotateX(12deg)";
      item.style.transition =
        "opacity 0.7s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
    });
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Count up the numbers
          animateCounters();

          // Reveal each stat item with a staggered flip-up animation
          statItems.forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0) scale(1) rotateX(0)";
            }, i * 140);
          });

          obs.disconnect();
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
  );

  observer.observe(statsSection);
});

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
