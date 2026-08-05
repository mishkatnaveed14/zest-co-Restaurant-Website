document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================================
     1. CUSTOM GLOW CURSOR FOLLOWER
     ====================================================================== */
  const cursorDot = document.getElementById("cursorDot");
  const cursorFollower = document.getElementById("cursorFollower");

  if (cursorDot && cursorFollower) {
    window.addEventListener("mousemove", (e) => {
      const { clientX: x, clientY: y } = e;
      if (window.gsap) {
        gsap.to(cursorDot, { x, y, duration: 0.1, ease: "power2.out" });
        gsap.to(cursorFollower, { x, y, duration: 0.3, ease: "power2.out" });
      } else {
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        cursorFollower.style.transform = `translate(${x}px, ${y}px)`;
      }
    });

    document
      .querySelectorAll('a, button, .faq-item, [data-cursor="hover"]')
      .forEach((el) => {
        el.addEventListener("mouseenter", () =>
          cursorFollower.classList.add("active"),
        );
        el.addEventListener("mouseleave", () =>
          cursorFollower.classList.remove("active"),
        );
      });
  }

  /* ======================================================================
     2. HERO ENTRANCE ANIMATION (GSAP)
     ====================================================================== */
  if (window.gsap) {
    const heroTL = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1 },
    });
    heroTL
      .from(".hero-badge-gold", { opacity: 0, y: 30, delay: 0.2 })
      .from(".hero-title", { opacity: 0, y: 40 }, "-=0.7")
      .from(".hero-lead-gold", { opacity: 0, y: 30 }, "-=0.7")
      .from(".faq-search-wrap", { opacity: 0, y: 24 }, "-=0.6");
  } else {
    // Fallback: show everything
    document
      .querySelectorAll(
        ".hero-badge-gold, .hero-title, .hero-lead-gold, .faq-search-wrap",
      )
      .forEach((el) => (el.style.opacity = "1"));
  }

  /* ======================================================================
     3. ACCORDION (smooth open/close, one-at-a-time)
     ====================================================================== */
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all others
      items.forEach((other) => {
        if (other !== item && other.classList.contains("open")) {
          other.classList.remove("open");
          other.querySelector(".faq-answer").style.maxHeight = "0px";
          other
            .querySelector(".faq-question")
            .setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = "0px";
        question.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ======================================================================
     4. CATEGORY FILTER
     ====================================================================== */
  const filterBtns = document.querySelectorAll(".faq-filter-btn");
  const groups = document.querySelectorAll(".faq-group");
  const emptyState = document.getElementById("faqEmpty");

  function applyFilters() {
    const activeFilter = document.querySelector(".faq-filter-btn.active");
    const filter = activeFilter
      ? activeFilter.getAttribute("data-filter")
      : "all";
    const searchTerm = (document.getElementById("faqSearchInput").value || "")
      .trim()
      .toLowerCase();

    let visibleGroups = 0;

    groups.forEach((group) => {
      const groupCat = group.getAttribute("data-group");
      const matchesFilter = filter === "all" || groupCat === filter;

      // Determine if any items in this group match the search
      let groupHasMatch = false;
      const itemsInGroup = group.querySelectorAll(".faq-item");
      itemsInGroup.forEach((it) => {
        const text = it.textContent.toLowerCase();
        const matchesSearch = !searchTerm || text.includes(searchTerm);
        it.style.display = matchesSearch ? "" : "none";
        if (matchesSearch) groupHasMatch = true;
      });

      const show = matchesFilter && groupHasMatch;
      group.classList.toggle("hidden-group", !show);
      if (show) visibleGroups++;
    });

    // Show / hide empty state
    if (emptyState) emptyState.classList.toggle("d-none", visibleGroups > 0);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (window.gsap) {
        gsap.fromTo(
          btn,
          { scale: 0.9 },
          { scale: 1, duration: 0.3, ease: "back.out(2)" },
        );
      }
      applyFilters();

      // Recompute open answer heights after filter (to avoid clipping)
      document.querySelectorAll(".faq-item.open .faq-answer").forEach((a) => {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    });
  });

  /* ======================================================================
     5. LIVE SEARCH
     ====================================================================== */
  const searchInput = document.getElementById("faqSearchInput");
  const searchClear = document.getElementById("faqSearchClear");

  function onSearch() {
    const val = searchInput.value.trim();
    searchClear.classList.toggle("show", val.length > 0);
    applyFilters();
  }

  searchInput.addEventListener("input", onSearch);
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    onSearch();
    searchInput.focus();
  });

  /* ======================================================================
     6. ANIMATED COUNTERS (IntersectionObserver)
     ====================================================================== */
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const isFloat = el.getAttribute("data-decimal") === "1";
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const value = target * eased;
          el.textContent = isFloat
            ? value.toFixed(1)
            : Math.round(value).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ======================================================================
     7. FAQ GROUPS REVEAL ON SCROLL (IntersectionObserver — reliable)
     ====================================================================== */
  const groupObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = entry.target;
        group.classList.add("revealed");
        if (window.gsap) {
          gsap.fromTo(
            group,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          );
        } else {
          group.style.opacity = "1";
          group.style.transform = "translateY(0)";
        }
        obs.unobserve(group);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  groups.forEach((g) => groupObserver.observe(g));

  // CTA parallax (only if GSAP + ScrollTrigger are available)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to("#faqCtaParallax", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".faq-cta-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
});
