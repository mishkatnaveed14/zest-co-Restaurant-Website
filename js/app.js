// script.js 1
const carouselEl = document.querySelector("#home2Carousel");

if (carouselEl) {
  const carousel = new bootstrap.Carousel(carouselEl, {
    interval: 3500,
    ride: "carousel",
    pause: "hover",
    wrap: true
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

  foodItems.forEach((item) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide d-flex justify-content-center";
    slide.innerHTML = `
      <div class="swiper-slide-thumb">
        <img src="${item.image}" alt="${item.title}">
      </div>
    `;
    swiperWrapper.appendChild(slide);
  });

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

  const activeImg = document.getElementById("active-food-img");
  const activeTitle = document.getElementById("active-food-title");
  const activePrice = document.getElementById("active-food-price");
  const dynamicCard = document.querySelector(".dynamic-food-card");

  let currentItemIndex = null;

  function updateActiveFood(index) {
    if (currentItemIndex === index) return;
    currentItemIndex = index;
    const food = foodItems[index];

    const tl = gsap.timeline();

    tl.to(activeImg, {
      opacity: 0,
      scale: 0.75,
      rotation: -15,
      y: 40,
      filter: "blur(4px)",
      duration: 0.25,
      ease: "power2.in",
    })
      .to(
        [activeTitle, activePrice],
        {
          opacity: 0,
          y: 15,
          duration: 0.18,
          stagger: 0.04,
          ease: "power2.in",
        },
        "-=0.2",
      )

      .call(() => {
        activeImg.src = food.image;
        activeTitle.textContent = food.title;
        activePrice.textContent = `Price - ${food.price}`;

        gsap.set(activeImg, {
          y: -50,
          rotation: 15,
          scale: 0.8,
          filter: "blur(0px)",
        });
        gsap.set([activeTitle, activePrice], { y: -15 });
      })

      .to(activeImg, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.8)",
      })
      .to(
        [activeTitle, activePrice],
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.35",
      );
  }

  dynamicCard.addEventListener("mousemove", (e) => {
    const cardRect = dynamicCard.getBoundingClientRect();
    const cardX = e.clientX - cardRect.left;
    const cardY = e.clientY - cardRect.top;

    const tiltX = (cardY / cardRect.height - 0.5) * 12;
    const tiltY = (cardX / cardRect.width - 0.5) * -12;

    gsap.to(dynamicCard, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(activeImg, {
      x: (cardX / cardRect.width - 0.5) * 15,
      y: (cardY / cardRect.height - 0.5) * 15,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  dynamicCard.addEventListener("mouseleave", () => {
    gsap.to(dynamicCard, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.to(activeImg, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  });

  swiper.on("slideChange", () => {
    updateActiveFood(swiper.realIndex);
  });

  updateActiveFood(0);
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
    featured: false
  },
  {
    name: "Beef Biryani",
    desc: "48-hour dum-cooked rice, tender beef, whole chillies and a whisper of saffron.",
    price: 28,
    reviews: 37,
    rating: 5,
    img: "https://images.pexels.com/photos/1630495/pexels-photo-1630495.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: true
  },
  {
    name: "Thai Soup",
    desc: "Overnight broth, soft egg, scallion and chilli oil, served bubbling hot.",
    price: 21,
    reviews: 54,
    rating: 4,
    img: "https://images.pexels.com/photos/12984982/pexels-photo-12984982.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false
  },
  {
    name: "Fired Chicken",
    desc: "Double-brined, double-fried, resting on herb salt with a citrus dip.",
    price: 14,
    reviews: 62,
    rating: 5,
    img: "https://images.pexels.com/photos/16892378/pexels-photo-16892378.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles, chashu pork, marinated egg, nori and scallion oil.",
    price: 19,
    reviews: 45,
    rating: 5,
    img: "https://images.pexels.com/photos/17593641/pexels-photo-17593641.jpeg?auto=compress&cs=tinysrgb&w=700",
    featured: false
  }
];

const SPOTLIGHT_ITEMS = [
  {
    name: "Golden Fried Chicken",
    desc: "Double-brined overnight, dredged twice, fried to a shattering crust and rested on herb salt.",
    price: "$14",
    img: "https://images.pexels.com/photos/16892378/pexels-photo-16892378.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    name: "Steamed Dumplings",
    desc: "Hand-folded parcels, minced beef and ginger, steamed to order and served with black vinegar.",
    price: "$9",
    img: "https://images.pexels.com/photos/7172851/pexels-photo-7172851.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    name: "Chef's Fried Rice",
    desc: "Wok-tossed jasmine rice, charred scallion and a soft crown of egg.",
    price: "$12",
    img: "https://images.pexels.com/photos/1630495/pexels-photo-1630495.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    name: "Ramen Bowl",
    desc: "Hand-pulled noodles in an 18-hour broth, chashu pork and marinated egg.",
    price: "$19",
    img: "https://images.pexels.com/photos/12984979/pexels-photo-12984979.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    name: "Grilled Wings",
    desc: "Charcoal-kissed wings glazed twice, finished with a squeeze of lime.",
    price: "$11",
    img: "https://images.pexels.com/photos/10648394/pexels-photo-10648394.jpeg?auto=compress&cs=tinysrgb&w=900"
  }
];

/* ================= BUILD CAROUSEL ================= */
const track = document.getElementById('carTrack');
const dotsWrap = document.getElementById('carDots');

function starString(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

DISHES.forEach((d) => {
  const card = document.createElement('div');
  card.className = 'dish-card';
  card.innerHTML = `
    <div class="dish-img-wrap">
      <div class="price-blob ${d.featured ? 'gold' : 'white'}">$${d.price}</div>
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
  const card = document.createElement('div');
  card.className = 'dish-card clone';
  card.innerHTML = `
    <div class="dish-img-wrap">
      <div class="price-blob ${d.featured ? 'gold' : 'white'}">$${d.price}</div>
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
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
}

let currentSlide = 0;
let cardWidthWithGap = 0;
let visibleCount = 3;

function measure() {
  const cards = track.querySelectorAll('.dish-card');
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
  const dots = dotsWrap.querySelectorAll('span');
  dots.forEach((d, idx) => d.classList.toggle('active', idx === currentSlide));
  const offset = currentSlide * cardWidthWithGap;
  if (window.gsap) {
    gsap.to(track, { x: -offset, duration: 0.7, ease: 'power3.out' });
  } else {
    track.style.transform = `translateX(-${offset}px)`;
  }
}

document.getElementById('carPrev').addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  restartAutoplay();
});
document.getElementById('carNext').addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  restartAutoplay();
});

let autoplayTimer;
function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4200);
}

// swipe support
let startX = 0, isDragging = false;
track.addEventListener('pointerdown', (e) => { isDragging = true; startX = e.clientX; });
window.addEventListener('pointerup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.clientX - startX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
    restartAutoplay();
  }
});

window.addEventListener('resize', () => { measure(); goToSlide(currentSlide); });
window.addEventListener('load', () => { measure(); goToSlide(0); restartAutoplay(); });

/* ================= SPOTLIGHT GALLERY ================= */
const thumbsWrap = document.getElementById('spotlightThumbs');
const spotImg = document.getElementById('spotlightImg');
const spotName = document.getElementById('spotlightName');
const spotDesc = document.getElementById('spotlightDesc');
const spotPrice = document.getElementById('spotlightPrice');

SPOTLIGHT_ITEMS.forEach((item, idx) => {
  const thumb = document.createElement('div');
  thumb.className = 'thumb' + (idx === 0 ? ' active' : '');
  thumb.innerHTML = `<img src="${item.img}" alt="${item.name}"><span class="thumb-label">${item.name}</span>`;
  thumb.addEventListener('click', () => setSpotlight(idx));
  thumbsWrap.appendChild(thumb);
});

function setSpotlight(idx) {
  const item = SPOTLIGHT_ITEMS[idx];
  const thumbs = thumbsWrap.querySelectorAll('.thumb');
  thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));

  if (window.gsap) {
    gsap.to(spotImg, {
      opacity: 0, duration: 0.22, onComplete: () => {
        spotImg.src = item.img;
        gsap.to(spotImg, { opacity: 1, duration: 0.35 });
      }
    });
    gsap.fromTo('#spotlightName, #spotlightDesc, #spotlightPrice',
      { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 });
  } else {
    spotImg.src = item.img;
  }
  spotName.textContent = item.name;
  spotDesc.textContent = item.desc;
  spotPrice.textContent = item.price;
}

/* ================= NAVBAR / MOBILE MENU ================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}));

/* ================= FORMS ================= */
document.getElementById('reserveForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('reserveConfirm');
  msg.textContent = "Table request received — we'll confirm by phone shortly.";
  e.target.reset();
});

document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('newsletterConfirm');
  msg.textContent = "You're on the list!";
  e.target.reset();
});

document.getElementById('watchBtn').addEventListener('click', () => {
  window.scrollTo({ top: document.getElementById('popular').offsetTop - 60, behavior: 'smooth' });
});

document.getElementById('year').textContent = new Date().getFullYear();

/* ================= GSAP ANIMATIONS ================= */
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // hero entrance
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.eyebrow[data-reveal]', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
    .to('.hero-title span', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.25)
    .to('.hero-desc[data-reveal]', { opacity: 1, y: 0, duration: 0.6 }, 0.55)
    .to('.hero-actions[data-reveal]', { opacity: 1, y: 0, duration: 0.6 }, 0.68)
    .to('.hero-stats[data-reveal]', { opacity: 1, y: 0, duration: 0.6 }, 0.8)
    .fromTo('.hero-img-frame', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.15 }, 0.3)
    .fromTo('.hero-badge-card', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, 1.1);

  // count-up stats
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    gsap.to(el, {
      textContent: target,
      duration: 1.8,
      ease: 'power2.out',
      snap: { textContent: 1 },
      delay: 1.1,
      onUpdate: function () { el.textContent = Math.floor(el.textContent); }
    });
  });

  // floating parallax on hero images (mousemove)
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to('.img-a', { x: relX * 16, y: relY * 16, duration: 0.6, ease: 'power2.out' });
      gsap.to('.img-b', { x: relX * -12, y: relY * -12, duration: 0.6, ease: 'power2.out' });
      gsap.to('.hero-badge-card', { x: relX * 10, y: relY * 10, duration: 0.6, ease: 'power2.out' });
    });
  }

  // generic scroll reveals
  gsap.utils.toArray('.craft-card[data-reveal], .chef-card[data-reveal]').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.7, delay: (i % 4) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // section heads
  gsap.utils.toArray('.section-head').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // spotlight
  gsap.fromTo('.spotlight-feature', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.8,
    scrollTrigger: { trigger: '.spotlight-grid', start: 'top 80%' }
  });
  gsap.fromTo('.spotlight-thumbs', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 0.8,
    scrollTrigger: { trigger: '.spotlight-grid', start: 'top 80%' }
  });

  // popular carousel reveal
  gsap.fromTo('.dish-card', { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
    scrollTrigger: { trigger: '#carousel', start: 'top 85%' }
  });

  // reserve CTA
  gsap.fromTo('.reserve-inner > *', { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.1,
    scrollTrigger: { trigger: '.reserve-inner', start: 'top 85%' }
  });

  // navbar entrance
  gsap.fromTo('.navbar', { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
} else {
  // fallback: just show everything if GSAP failed to load
  document.querySelectorAll('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

/* ================= EMBER PARTICLES (canvas) ================= */
(function emberField() {
  const canvas = document.getElementById('emberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      alpha: Math.random() * 0.5 + 0.25
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  if (!prefersReduced) tick();
})();
