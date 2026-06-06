/* ================================================================
   Theme toggle — light mode default, persists via localStorage
   ================================================================ */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('sr-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sr-theme', next);
});

/* ================================================================
   Header — shadow on scroll
   ================================================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ================================================================
   Mobile navigation burger
   ================================================================ */
const navBurger = document.getElementById('navBurger');
const nav       = document.getElementById('nav');

navBurger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', String(open));

  const [top, mid, bot] = navBurger.querySelectorAll('span');
  if (open) {
    top.style.transform = 'translateY(7px) rotate(45deg)';
    mid.style.opacity   = '0';
    bot.style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    [top, mid, bot].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

nav.querySelectorAll('.nav__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    nav.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    navBurger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

/* ================================================================
   Published Works — Carousel
   ================================================================ */
(function () {
  const track   = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track || !prevBtn || !nextBtn) return;

  const cards       = Array.from(track.querySelectorAll('.carousel-card'));
  const totalCards  = cards.length;
  let currentIndex  = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 580) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalCards - getVisibleCount());
  }

  function getStep() {
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return cards[0].offsetWidth + gap;
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    track.style.transform = `translateX(-${currentIndex * getStep()}px)`;

    prevBtn.classList.toggle('carousel-btn--hidden', currentIndex === 0);
    nextBtn.classList.toggle('carousel-btn--hidden', currentIndex >= maxIndex);
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; updateCarousel(); }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) { currentIndex++; updateCarousel(); }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const t = track.style.transition;
      track.style.transition = 'none';
      updateCarousel();
      requestAnimationFrame(() => { track.style.transition = t; });
    }, 200);
  }, { passive: true });

  updateCarousel();
})();

/* ================================================================
   Scroll-reveal — IntersectionObserver
   ================================================================ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const siblings = el.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => { if (sib === el) delay = idx * 80; });
      setTimeout(() => el.classList.add('visible'), Math.min(delay, 400));
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ================================================================
   Hero elements — entrance animation on load
   ================================================================ */
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero__content > *').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms`;
    requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
  });
});

/* ================================================================
   Active nav link highlight on scroll
   ================================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__btn');

function setActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.classList.toggle('active', href.slice(1) === current);
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

/* ================================================================
   Contact form — validation + simulated submit
   ================================================================ */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

function setError(id, errorId, msg) {
  const el = document.getElementById(id);
  el.classList.add('invalid');
  document.getElementById(errorId).textContent = msg;
}

function clearError(id, errorId) {
  document.getElementById(id).classList.remove('invalid');
  document.getElementById(errorId).textContent = '';
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('cname').value.trim();
  const email   = document.getElementById('cemail').value.trim();
  const message = document.getElementById('cmessage').value.trim();

  if (!name) {
    setError('cname', 'cnameError', 'Please enter your name.');
    valid = false;
  } else { clearError('cname', 'cnameError'); }

  if (!email) {
    setError('cemail', 'cemailError', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('cemail', 'cemailError', 'Please enter a valid email address.');
    valid = false;
  } else { clearError('cemail', 'cemailError'); }

  if (!message) {
    setError('cmessage', 'cmessageError', 'Please enter a message.');
    valid = false;
  } else { clearError('cmessage', 'cmessageError'); }

  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled    = false;
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 6000);
  }, 1400);
});

['cname', 'cemail', 'cmessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, id + 'Error');
  });
});

/* ================================================================
   Footer — current year
   ================================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
