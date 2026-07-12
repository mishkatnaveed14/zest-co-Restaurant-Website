// script.js
const carouselEl = document.querySelector("#home2Carousel");

if (carouselEl) {
  const carousel = new bootstrap.Carousel(carouselEl, {
    interval: 3500,
    ride: "carousel",
    pause: "hover",
    wrap: true
  });
}