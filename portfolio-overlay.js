(function () {
  const overlay = document.getElementById('project-overlay');
  if (!overlay) return;
  const projects = window.PROJECT_DATA || {};
  const closeBtn = overlay.querySelector('.project-overlay__close');
  const titleEl = document.getElementById('overlay-title');
  const metaEl = document.getElementById('overlay-meta');
  const descEl = document.getElementById('overlay-desc');
  const roleEl = document.getElementById('overlay-role');
  const toolsEl = document.getElementById('overlay-tools');
  const heroEl = document.getElementById('overlay-hero');
  const galleryEl = document.getElementById('overlay-gallery');
  const backBtn = document.getElementById('overlay-back');
  let lastFocusedElement = null;

  function openProject(id) {
    const p = projects[id];
    if (!p) return;
    lastFocusedElement = document.activeElement;
    titleEl.textContent = p.title;
    metaEl.textContent = p.meta;
    descEl.textContent = p.description;
    roleEl.textContent = p.role;
    toolsEl.textContent = p.tools;
    heroEl.src = p.hero;
    heroEl.alt = p.heroAlt || '';
    if (p.gallery && p.gallery.length) {
      galleryEl.innerHTML = p.gallery.map(function (g) {
        return '<img src="' + g.src + '" alt="' + (g.alt || '') + '" loading="lazy">';
      }).join('');
      galleryEl.hidden = false;
    } else {
      galleryEl.innerHTML = '';
      galleryEl.hidden = true;
    }
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    overlay.scrollTop = 0;
    requestAnimationFrame(function () { closeBtn.focus(); });
  }

  function closeProject() {
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll('[data-project]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openProject(btn.dataset.project);
    });
  });

  closeBtn.addEventListener('click', closeProject);
  if (backBtn) backBtn.addEventListener('click', closeProject);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeProject();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
      closeProject();
    }
  });
})();
