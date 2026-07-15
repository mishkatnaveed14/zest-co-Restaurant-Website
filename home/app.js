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
