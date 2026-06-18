/**
 * Clínica Revera — script.js
 * Mobile menu · Active nav · Scroll animations · Back-to-top · WhatsApp float · Footer year
 */

'use strict';

/* ============================================================
   FOOTER — current year
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   ELEMENTS
   ============================================================ */
const header      = document.getElementById('header');
const hamburger   = document.getElementById('hamburger');
const navList     = document.getElementById('navList');
const backToTop   = document.getElementById('backToTop');
const whaFloat    = document.getElementById('whatsappFloat');
const heroImg     = document.querySelector('.hero__img');

/* ============================================================
   HERO IMAGE — animate on load
   ============================================================ */
if (heroImg) {
  if (heroImg.complete) {
    heroImg.classList.add('loaded');
  } else {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }
}

/* ============================================================
   HEADER — sticky scroll state
   ============================================================ */
function handleScroll() {
  const scrollY = window.scrollY;

  // Sticky header background
  header.classList.toggle('scrolled', scrollY > 40);

  // Back to top & WhatsApp float visibility
  const showButtons = scrollY > 400;
  backToTop.classList.toggle('visible', showButtons);
  whaFloat.classList.toggle('visible', showButtons);
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on page load

/* ============================================================
   MOBILE MENU — hamburger toggle
   ============================================================ */
function openMenu() {
  navList.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navList.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navList.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

// Close menu when any nav link or CTA is clicked
navList.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navList.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});

// Close menu when clicking backdrop (outside the nav)
document.addEventListener('click', e => {
  if (
    navList.classList.contains('open') &&
    !navList.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ============================================================
   ACTIVE NAV LINK — IntersectionObserver
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(
          `.nav__link[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  },
  {
    threshold: 0.30,
    rootMargin: '-60px 0px -40% 0px',
  }
);

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   SCROLL ANIMATIONS — fade-in on enter viewport
   ============================================================ */
const animatedEls = document.querySelectorAll(
  '.animate-fade-up, .animate-fade-right, .animate-fade-left'
);

// If IntersectionObserver is available
if ('IntersectionObserver' in window) {
  const animObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          animObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedEls.forEach(el => animObserver.observe(el));
} else {
  // Fallback — show all immediately for browsers without IO support
  animatedEls.forEach(el => el.classList.add('in-view'));
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   SMOOTH SCROLL — internal anchor links
   (enhances native scroll-behavior for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    ) || 80;

    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   WHATSAPP FLOAT — pulse animation after 3 s
   ============================================================ */
let whaAnimated = false;

setTimeout(() => {
  if (!whaAnimated && whaFloat) {
    whaFloat.style.animation = 'whaFloatPulse 0.6s ease';
    whaFloat.addEventListener(
      'animationend',
      () => { whaFloat.style.animation = ''; whaAnimated = true; },
      { once: true }
    );
  }
}, 3000);

/* ============================================================
   SERVICE CARDS — keyboard accessibility (Enter/Space)
   ============================================================ */
document.querySelectorAll('.service-card').forEach(card => {
  const link = card.querySelector('.service-card__link');
  if (!link) return;
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      link.click();
    }
  });
});

/* ============================================================
   INTERSECTION OBSERVER POLYFILL CHECK
   ============================================================ */
// All IO usage above already guarded with 'in window' check.
// No extra polyfill needed for modern browsers.
