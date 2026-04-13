// ─── NAV DROPDOWN ──────────────────────────────────────
// Script is at bottom of body — DOM is already ready, run immediately
function initPage() {

  // ─── HAMBURGER MENU ────────────────────────────────
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav-links');
  let burger = null;

  function closeMobileMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('mobile-open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (nav && navLinks) {
    /* ── Lang toggle ── */
    const currentLang = (window.HHA_LANG && window.HHA_LANG.current()) || 'en';
    const langToggle = document.createElement('button');
    langToggle.id = 'lang-toggle';
    langToggle.className = 'lang-toggle';
    langToggle.setAttribute('aria-label', 'Switch language / Changer de langue');
    langToggle.innerHTML =
      `<span data-lang-opt="en" ${currentLang === 'en' ? 'class="lt-active"' : ''}>EN</span>` +
      `<span class="lt-sep">|</span>` +
      `<span data-lang-opt="fr" ${currentLang === 'fr' ? 'class="lt-active"' : ''}>FR</span>`;
    langToggle.addEventListener('click', () => {
      if (window.HHA_LANG) window.HHA_LANG.toggle();
    });
    /* Insert as last <li> inside nav-links so it stays in the flex row */
    const langLi = document.createElement('li');
    langLi.appendChild(langToggle);
    navLinks.appendChild(langLi);

    burger = document.createElement('button');
    burger.className = 'nav-hamburger';
    burger.setAttribute('aria-label', 'Toggle menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('mobile-open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) closeMobileMenu();
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => closeMobileMenu());
    });
  }

  // ─── NAV DROPDOWN ──────────────────────────────────
  const toggles = document.querySelectorAll('.nav-dropdown .dropdown-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-dropdown');
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.nav-dropdown.open').forEach(d => {
        if (d !== parent) d.classList.remove('open');
      });
      parent.classList.toggle('open', !isOpen);
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      closeMobileMenu();
    }
  });

  // ─── NAV ACTIVE STATE ──────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a[href]').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (href === path) link.classList.add('nav-active');
  });
  const projectPages = ['tipe.html','thepnlab.html','amje.html','cnn-lispen.html',
    'fsam.html','pwc.html','planeur.html','tournimap.html','projects.html'];
  if (projectPages.includes(path)) {
    const toggle = document.querySelector('.dropdown-toggle');
    if (toggle) toggle.classList.add('nav-active');
  }

  // ─── LAZY LOADING (non-hero images) ───────────────
  document.querySelectorAll('img:not(.hero-avatar img)').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });

  // ─── SCROLL REVEAL ─────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll(
    '.p-card, .content-section, .institution, .sidebar-box, #about .section, #projects .marquee-section'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ─── PROJ CAROUSELS ──────────────────────────────────
  document.querySelectorAll('.proj-carousel').forEach(carousel => {
    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length <= 1) return; // skip if only 1 image

    const dotsContainer = carousel.querySelector('.carousel-dots');
    let current = 0;

    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => show(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('span');

    function show(index) {
      images.forEach((img, i) => {
        img.classList.toggle('show', i === index);
        if (dots[i]) dots[i].classList.toggle('active', i === index);
      });
      current = index;
    }

    carousel.querySelector('.prev').addEventListener('click', () => {
      show((current - 1 + images.length) % images.length);
    });
    carousel.querySelector('.next').addEventListener('click', () => {
      show((current + 1) % images.length);
    });

    show(0);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
