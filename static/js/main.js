/* ===== Utilitas & preferensi ===== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined';
const hasScrollTrigger = hasGsap && typeof window.ScrollTrigger !== 'undefined';
const root = document.documentElement;
window.__slzReady = true;

/* ===== Transisi antar halaman ===== */
if (root.classList.contains('is-transitioning')) {
  requestAnimationFrame(() => window.setTimeout(() => root.classList.remove('is-transitioning'), 140));
}
if (root.classList.contains('is-leaving')) root.classList.remove('is-leaving');

const internalLink = (link) => {
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return false;
  if (link.origin !== location.origin) return false;
  if (/^(mailto:|tel:|javascript:)/i.test(link.getAttribute('href') || '')) return false;
  if (link.pathname === location.pathname) return false;
  return true;
};

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!internalLink(link) || reduceMotion) return;
  event.preventDefault();
  root.classList.add('is-leaving');
  try { sessionStorage.setItem('slz-transition', '1'); } catch (e) {}
  window.setTimeout(() => { location.href = link.href; }, 660);
});

/* ===== Menu ===== */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu');
    menuToggle.textContent = '☰';
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    menuToggle.textContent = isOpen ? '✕' : '☰';
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

/* ===== Reveal saat masuk viewport ===== */
const revealTargets = document.querySelectorAll('.reveal, .reveal-scale');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== Video hero ===== */
const heroVideo = document.querySelector('.hero-media video');
if (heroVideo) {
  const markLoaded = () => heroVideo.classList.add('is-loaded');
  if (heroVideo.readyState >= 2) markLoaded();
  else heroVideo.addEventListener('loadeddata', markLoaded, { once: true });
  if (reduceMotion) heroVideo.pause();
  else heroVideo.play().catch(() => {});
}

/* ===== Scroll: progress, topbar, back-to-top ===== */
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.scroll-progress');
const backTop = document.querySelector('.back-top');
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  if (topbar) topbar.classList.toggle('is-scrolled', y > 12);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  if (backTop) backTop.classList.toggle('is-visible', y > 620);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ===== Scrollspy ===== */
const spyLinks = [...document.querySelectorAll('.nav-links a[href*="#"]')];
const spyTargets = spyLinks
  .map((a) => {
    const hash = a.href.split('#')[1];
    return hash ? document.getElementById(hash) : null;
  })
  .filter(Boolean);
if (spyLinks.length && spyTargets.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        spyLinks.forEach((a) => {
          const isCurrent = a.href.split('#')[1] === entry.target.id;
          a.classList.toggle('is-active', isCurrent);
          if (isCurrent) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }
    }
  }, { rootMargin: '-35% 0px -55% 0px' });
  spyTargets.forEach((section) => spy.observe(section));
}

/* ===== Cursor glow ===== */
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  let gx = -600, gy = -600, tx = gx, ty = gy;
  window.addEventListener('pointermove', (event) => { tx = event.clientX; ty = event.clientY; }, { passive: true });
  (function follow() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx - 210}px, ${gy - 210}px)`;
    requestAnimationFrame(follow);
  })();
}

/* ===== Swiper: portofolio pilihan ===== */
if (window.Swiper) {
  document.querySelectorAll('.works-swiper').forEach((el) => {
    new Swiper(el, {
      slidesPerView: 1.08,
      spaceBetween: 18,
      speed: 720,
      grabCursor: true,
      watchOverflow: true,
      keyboard: { enabled: true },
      a11y: { prevSlideMessage: 'Proyek sebelumnya', nextSlideMessage: 'Proyek berikutnya' },
      autoplay: reduceMotion ? false : { delay: 5600, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
      navigation: { prevEl: el.querySelector('.swiper-prev'), nextEl: el.querySelector('.swiper-next') },
      breakpoints: {
        640: { slidesPerView: 1.55, spaceBetween: 20 },
        960: { slidesPerView: 2.15, spaceBetween: 22 },
        1180: { slidesPerView: 2, spaceBetween: 22 },
      },
    });
  });
}

/* ===== GSAP: hero, parallax, counter ===== */
if (hasGsap) {
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (!reduceMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('[data-hero]', { y: 30, opacity: 0, duration: 1, stagger: 0.085, delay: 0.12 })
      .from('[data-hero-card]', { y: 46, opacity: 0, rotate: 7, duration: 1.15, ease: 'power3.out' }, '-=0.7');

    if (hasScrollTrigger) {
      gsap.utils.toArray('.hero-float img').forEach((img, index) => {
        gsap.to(img, {
          y: index === 0 ? -46 : 32,
          rotate: index === 0 ? -5 : 5,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-feature', start: 'top top', end: 'bottom top', scrub: true },
        });
      });

      const media = document.querySelector('.hero-media');
      if (media) {
        gsap.to(media, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-feature', start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      gsap.utils.toArray('.section-head h2, .playground-copy h2, .contact-copy h2').forEach((heading) => {
        gsap.from(heading, {
          y: 34,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        });
      });
    }
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const runCounter = (el) => {
      const target = Number(el.dataset.count || 0);
      if (reduceMotion) { el.textContent = target; return; }
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.5,
        onUpdate: () => { el.textContent = Math.round(state.value); },
      });
    };
    counters.forEach(runCounter);
  }
} else {
  document.querySelectorAll('.counter').forEach((el) => { el.textContent = el.dataset.count || '0'; });
}

/* ===== Motion One: tombol magnetik & tilt kartu ===== */
const motion = window.Motion;
if (motion && motion.animate && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const spring = { type: 'spring', stiffness: 320, damping: 26, mass: 0.6 };

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.28;
      motion.animate(el, { x, y }, spring);
    });
    el.addEventListener('pointerleave', () => {
      motion.animate(el, { x: 0, y: 0 }, spring);
    });
  });

  document.querySelectorAll('.work-cover').forEach((cover) => {
    cover.addEventListener('pointermove', (event) => {
      const rect = cover.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      motion.animate(cover, {
        rotateX: -py * 7,
        rotateY: px * 9,
        scale: 1.012,
      }, { duration: 0.4, easing: [0.22, 0.61, 0.36, 1] });
    });
    cover.addEventListener('pointerleave', () => {
      motion.animate(cover, { rotateX: 0, rotateY: 0, scale: 1 }, spring);
    });
  });
}

/* ===== Lightbox galeri ===== */
const lightbox = document.querySelector('#lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const img = lightbox.querySelector('img');
  const title = lightbox.querySelector('h3');
  const desc = lightbox.querySelector('p');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lightbox]');
    if (!trigger) return;
    event.preventDefault();
    img.src = trigger.dataset.src;
    img.alt = trigger.dataset.title || '';
    title.textContent = trigger.dataset.title || '';
    desc.textContent = trigger.dataset.desc || '';
    lightbox.showModal();
  });

  const closeLightbox = () => lightbox.close();
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('close', () => {
    img.removeAttribute('src');
  });
}

/* ===== Parallax ringan untuk elemen dekoratif ===== */
if (hasScrollTrigger && !reduceMotion) {
  gsap.utils.toArray('.about-bow, .flower-mascot').forEach((el, index) => {
    gsap.to(el, {
      y: index % 2 === 0 ? -26 : 18,
      rotate: index % 2 === 0 ? 2 : -3,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });
}
