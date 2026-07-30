document.addEventListener('DOMContentLoaded', () => {
  
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------------
     1. CUSTOM GLOW CURSOR FOLLOWER
     ------------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');

  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;

    gsap.to(cursorDot, {
      x: x,
      y: y,
      duration: 0.1,
      ease: 'power2.out'
    });

    gsap.to(cursorFollower, {
      x: x,
      y: y,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  // Hover state triggers for custom cursor
  document.querySelectorAll('a, button, .gallery-card, .insta-card, [data-cursor="hover"]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
  });


  /* ------------------------------------------------------------------------
     2. HERO GSAP REVEAL ANIMATIONS
     ------------------------------------------------------------------------ */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

  heroTL
    .from('.hero-badge-pill', { opacity: 0, y: 30, delay: 0.2 })
    .from('.hero-title', { opacity: 0, y: 40 }, '-=0.7')
    .from('.hero-lead', { opacity: 0, y: 30 }, '-=0.7')
    .from('.hero-cta-group', { opacity: 0, y: 20 }, '-=0.7')
    .from('.hero-stats-container', { opacity: 0, y: 20 }, '-=0.6')
    .from('.hero-3d-stage', { opacity: 0, scale: 0.9, duration: 1.2 }, '-=1');

  // Animated Counters
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;

    gsap.to(counter, {
      innerText: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 90%'
      },
      snap: { innerText: isFloat ? 0.1 : 1 },
      onUpdate: function () {
        if (isFloat) {
          counter.innerText = parseFloat(this.targets()[0].innerText).toFixed(1);
        }
      }
    });
  });
  // Initialize Vanilla Tilt on designated cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      glare: true,
      'max-glare': 0.2,
      scale: 1.02
    });
  }

  // Parallax Effect on Hero Stage based on mouse position
  const stage = document.getElementById('hero3DStage');
  if (stage) {
    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const xOffset = (e.clientX / innerWidth - 0.5) * 30;
      const yOffset = (e.clientY / innerHeight - 0.5) * 30;

      gsap.to('.main-card', { rotationY: xOffset, rotationX: -yOffset, ease: 'power1.out', duration: 0.5 });
      gsap.to('.sub-card-1', { x: xOffset * 1.5, y: yOffset * 1.5, ease: 'power1.out', duration: 0.5 });
      gsap.to('.sub-card-2', { x: -xOffset * 1.5, y: -yOffset * 1.5, ease: 'power1.out', duration: 0.5 });
      gsap.to('.glass-float-badge', { x: xOffset * 0.8, y: yOffset * 0.8, ease: 'power1.out', duration: 0.5 });
    });
  }


  /* ------------------------------------------------------------------------
     4. CATEGORY FILTERING SYSTEM
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCat === filterValue) {
          item.classList.remove('hide-item');
          gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
        } else {
          item.classList.add('hide-item');
          gsap.to(item, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.out' });
        }
      });
    });
  });


  /* ------------------------------------------------------------------------
     5. SHOWCASE PARALLAX SCROLLTRIGGER
     ------------------------------------------------------------------------ */
  gsap.to('#showcaseParallax', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.featured-showcase-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });


  /* ------------------------------------------------------------------------
     6. CUSTOMER MOMENTS SWIPER SLIDER
     ------------------------------------------------------------------------ */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.customerMomentsSwiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.swiper-next-btn',
        prevEl: '.swiper-prev-btn'
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }


  /* ------------------------------------------------------------------------
     7. FULLSCREEN LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  const lightbox = document.getElementById('customLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  let currentGalleryIndex = 0;
  const triggers = Array.from(document.querySelectorAll('.btn-lightbox-trigger'));

  const updateLightboxContent = (index) => {
    const trigger = triggers[index];
    if (!trigger) return;

    const imgSrc = trigger.getAttribute('data-img-src');
    const title = trigger.getAttribute('data-title');
    const desc = trigger.getAttribute('data-desc');

    gsap.to(lightboxImg, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      onComplete: () => {
        lightboxImg.src = imgSrc;
        lightboxTitle.innerText = title;
        lightboxDesc.innerText = desc;

        gsap.to(lightboxImg, { opacity: 1, scale: 1, duration: 0.3 });
      }
    });
  };

  triggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', () => {
      currentGalleryIndex = idx;
      updateLightboxContent(currentGalleryIndex);
      lightbox.classList.add('active');
    });
  });

  const closeLightbox = () => lightbox.classList.remove('active');

  closeBtn.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + triggers.length) % triggers.length;
    updateLightboxContent(currentGalleryIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % triggers.length;
    updateLightboxContent(currentGalleryIndex);
  });

  // Close lightbox on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

});