// Minimal progressive enhancement. No frameworks, no dependencies.

(() => {
  'use strict';

  /* ---------------------------------------------------------------
     Smooth scroll via Lenis
     Lenis is loaded from CDN just before this script. If it's
     available and the user hasn't opted into reduced motion,
     we initialize it and drive it with requestAnimationFrame.
     --------------------------------------------------------------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  if (typeof Lenis !== 'undefined' && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // Hijack anchor links so they use Lenis-driven scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------------------------------------------------------------
     Nav: mobile toggle + hairline on scroll
     --------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const toggle = nav?.querySelector('.nav__toggle');
  const toggleLabel = toggle?.querySelector('.nav__toggle-label');
  const navLinks = nav?.querySelectorAll('.nav__links a');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (toggleLabel) toggleLabel.textContent = isOpen ? 'Close' : 'Menu';
    });

    navLinks?.forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        if (toggleLabel) toggleLabel.textContent = 'Menu';
      }
    }));
  }

  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 4);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------------
     Email obfuscation: build mailto links at runtime from data-user
     and data-domain attributes. This keeps the address out of the
     static HTML so casual scrapers don't pick it up.
     --------------------------------------------------------------- */
  document.querySelectorAll('.email-link').forEach(link => {
    const user = link.dataset.user;
    const domain = link.dataset.domain;
    if (!user || !domain) return;
    const email = `${user}@${domain}`;
    const subject = link.dataset.subject || 'Hello, Lidia';
    link.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    if (link.hasAttribute('data-replace-text')) {
      link.textContent = email;
    }
  });

  /* ---------------------------------------------------------------
     Contact form: assemble a mailto: URL on submit so we don't
     need a backend. Subject is fixed, body is composed from fields.
     --------------------------------------------------------------- */
  const contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = (data.get('name') || '').toString().trim();
      const fromEmail = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      const user = contactForm.dataset.user;
      const domain = contactForm.dataset.domain;
      if (!user || !domain) return;
      const to = `${user}@${domain}`;
      const subject = encodeURIComponent('Hello, Lidia');
      const body = encodeURIComponent(
        `${message}\n\nFrom: ${name}\nReply to: ${fromEmail}`
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  /* ---------------------------------------------------------------
     Footer: current year
     --------------------------------------------------------------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------
     Scroll-triggered reveals
     Elements with class="reveal" fade up when scrolled into view.
     Uses IntersectionObserver — no library, no scroll listener.
     --------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support, show everything immediately
    reveals.forEach(el => el.classList.add('is-revealed'));
  }
})();
