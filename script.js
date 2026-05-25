/**
 * Hero Section — Scroll & Header Logic
 * Fixes applied:
 *  - hamburger aria-hidden set on desktop toggle
 *  - smooth scroll targets #about section
 *  - header reveal threshold: 50% of hero height
 */

(function () {
  'use strict';

  const header     = document.getElementById('site-header');
  const scrollBtn  = document.getElementById('scroll-arrow');
  const hero       = document.getElementById('hero');
  const menuToggle = document.querySelector('.menu-toggle');

  if (!header || !hero) return;

  // ─── Header reveal on scroll ──────────────────────────────
  const THRESHOLD = 0.5; // reveal header after 50% of hero is scrolled past

  function onScroll() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const trigger    = window.innerHeight * (1 - THRESHOLD);

    if (heroBottom < trigger) {
      header.classList.add('is-visible');
    } else {
      header.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ─── Scroll arrow → smooth scroll to next section ─────────
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      const target = document.getElementById('about');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ─── Hamburger: hide from accessibility on desktop ────────
  function updateMenuToggleVisibility() {
    if (!menuToggle) return;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    menuToggle.setAttribute('aria-hidden', isDesktop ? 'true' : 'false');
    menuToggle.tabIndex = isDesktop ? -1 : 0;
  }

  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', updateMenuToggleVisibility);
  updateMenuToggleVisibility();

})();
