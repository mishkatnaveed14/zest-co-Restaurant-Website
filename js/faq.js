document.addEventListener('DOMContentLoaded', () => {
  /* ======================================================================
     1. CUSTOM GLOW CURSOR FOLLOWER
     ====================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursorDot && cursorFollower) {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      if (window.gsap) {
        gsap.to(cursorDot, { x, y, duration: 0.1, ease: 'power2.out' });
        gsap.to(cursorFollower, { x, y, duration: 0.3, ease: 'power2.out' });
      } else {
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        cursorFollower.style.transform = `translate(${x}px, ${y}px)`;
      }
    });

    document
      .querySelectorAll('a, button, .faq-item, [data-cursor="hover"]')
      .forEach((el) => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
      });
  }

  /* ======================================================================
     2. HERO ENTRANCE ANIMATION (GSAP)
     ====================================================================== */
  if (window.gsap) {
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    heroTL
      .from('.hero-badge-gold', { opacity: 0, y: 30, delay: 0.2 })
      .from('.hero-title', { opacity: 0, y: 40 }, '-=0.7')
      .from('.hero-lead-gold', { opacity: 0, y: 30 }, '-=0.7')
      .from('.faq-search-wrap', { opacity: 0, y: 24 }, '-=0.6');
  } else {
    document.querySelectorAll('.hero-badge-gold, .hero-title, .hero-lead-gold, .faq-search-wrap')
      .forEach((el) => (el.style.opacity = '1'));
  }

  /* ======================================================================
     3. ACCORDION (smooth open/close, one-at-a-time)
     ====================================================================== */
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach((other) => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = '0px';
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0px';
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ======================================================================
     4. EXPAND / COLLAPSE ALL
     ====================================================================== */
  const expandAllBtn = document.getElementById('faqExpandAll');
  const collapseAllBtn = document.getElementById('faqCollapseAll');

  function expandAll() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const answer = item.querySelector('.faq-answer');
      const question = item.querySelector('.faq-question');
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      question.setAttribute('aria-expanded', 'true');
    });
  }

  function collapseAll() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const answer = item.querySelector('.faq-answer');
      const question = item.querySelector('.faq-question');
      item.classList.remove('open');
      answer.style.maxHeight = '0px';
      question.setAttribute('aria-expanded', 'false');
    });
  }

  expandAllBtn?.addEventListener('click', expandAll);
  collapseAllBtn?.addEventListener('click', collapseAll);

  /* ======================================================================
     5. CATEGORY FILTER + LIVE SEARCH
     ====================================================================== */
  const filterBtns = document.querySelectorAll('.faq-filter-btn');
  const groups = document.querySelectorAll('.faq-group');
  const emptyState = document.getElementById('faqEmpty');
  const searchInput = document.getElementById('faqSearchInput');
  const searchClear = document.getElementById('faqSearchClear');
const resultsCountEl = document.getElementById('faqResultsCount');

  function applyFilters() {
    const activeFilter = document.querySelector('.faq-filter-btn.active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    const searchTerm = (searchInput ? searchInput.value : '').trim().toLowerCase();

    let visibleCount = 0;
    let visibleGroups = 0;

    groups.forEach((group) => {
      const groupCat = group.getAttribute('data-group');
      const matchesFilter = filter === 'all' || groupCat === filter;

      let groupHasMatch = false;
      group.querySelectorAll('.faq-item').forEach((it) => {
        const text = it.textContent.toLowerCase();
        const matchesSearch = !searchTerm || text.includes(searchTerm);
        it.style.display = matchesSearch ? '' : 'none';
        if (matchesSearch) {
          groupHasMatch = true;
          visibleCount++;
        }
      });

      const show = matchesFilter && groupHasMatch;
      group.style.display = show ? '' : 'none';
      if (show) visibleGroups++;
    });

// Update counts
    if (resultsCountEl) resultsCountEl.textContent = visibleCount;

    // Empty state
    if (emptyState) emptyState.classList.toggle('d-none', visibleGroups > 0);

    // Recompute open answer heights after filtering
    document.querySelectorAll('.faq-item.open .faq-answer').forEach((a) => {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (window.gsap) {
        gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }
      applyFilters();
    });
  });

  function onSearch() {
    const val = searchInput ? searchInput.value.trim() : '';
    searchClear.classList.toggle('show', val.length > 0);
    applyFilters();
  }

  searchInput?.addEventListener('input', onSearch);
  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    onSearch();
    searchInput.focus();
  });
// Set total count on load
  if (resultsCountEl) resultsCountEl.textContent = items.length;

  /* ======================================================================
     6. ANIMATED COUNTERS (IntersectionObserver)
     ====================================================================== */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const isFloat = el.getAttribute('data-decimal') === '1';
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const value = target * eased;
          el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toLocaleString();
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
     7. FAQ GROUPS REVEAL ON SCROLL + CTA PARALLAX
     ====================================================================== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    groups.forEach((group, i) => {
      gsap.to(group, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: group,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    gsap.to('#faqCtaParallax', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.faq-cta-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  } else {
    document.querySelectorAll('.faq-group').forEach((g) => {
      g.style.opacity = '1';
      g.style.transform = 'none';
    });
  }

  /* ======================================================================
     8. BACK TO TOP BUTTON
     ====================================================================== */
  const backTop = document.getElementById('faqBackTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 600);
    });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
});
