const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    menuToggle.textContent = isOpen ? '✕' : '☰';
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka menu');
      menuToggle.textContent = '☰';
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => observer.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();

/* ===== Video hero ===== */
const heroVideo = document.querySelector('.hero-media video');
if (heroVideo) {
  const markLoaded = () => heroVideo.classList.add('is-loaded');
  if (heroVideo.readyState >= 2) markLoaded();
  else heroVideo.addEventListener('loadeddata', markLoaded, { once: true });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {});
  }
}

/* ===== Scroll: progress bar, topbar, parallax ===== */
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.scroll-progress');
const heroMedia = document.querySelector('.hero-media');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  if (topbar) topbar.classList.toggle('is-scrolled', y > 12);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  if (heroMedia && !reduceMotion) {
    heroMedia.style.transform = y < window.innerHeight ? `translateY(${y * 0.16}px)` : '';
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ===== Scrollspy: tandai nav aktif sesuai section ===== */
const spyLinks = [...document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="/#"]')];
const spyTargets = spyLinks
  .map((a) => document.getElementById(a.hash.slice(1)))
  .filter(Boolean);
if (spyLinks.length && spyTargets.length) {
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        spyLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${entry.target.id}`));
      }
    }
  }, { rootMargin: '-35% 0px -55% 0px' });
  spyTargets.forEach((section) => spy.observe(section));
}

/* ===== Cursor glow halus (khusus pointer presisi) ===== */
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  let gx = -500, gy = -500, tx = gx, ty = gy;
  window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function follow() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx - 170}px, ${gy - 170}px)`;
    requestAnimationFrame(follow);
  })();
}
