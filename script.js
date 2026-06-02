// Minimal progressive enhancement. No frameworks, no dependencies.

(() => {
  'use strict';

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
})();
