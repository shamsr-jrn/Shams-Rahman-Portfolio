/* ================================================================
   Theme toggle — persists across page loads via localStorage
   ================================================================ */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Apply saved preference immediately (before paint)
const savedTheme = localStorage.getItem('sr-theme') || 'dark';
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
   Scroll-reveal — IntersectionObserver
   ================================================================ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Stagger cards that appear in a grid
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
   Hero elements — auto-reveal on load
   ================================================================ */
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero__content > *').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
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
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('active', href === current);
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
  const el = document.getElementById(id);
  el.classList.remove('invalid');
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
  } else {
    clearError('cname', 'cnameError');
  }

  if (!email) {
    setError('cemail', 'cemailError', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('cemail', 'cemailError', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('cemail', 'cemailError');
  }

  if (!message) {
    setError('cmessage', 'cmessageError', 'Please enter a message.');
    valid = false;
  } else {
    clearError('cmessage', 'cmessageError');
  }

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

// Clear individual errors on input
['cname', 'cemail', 'cmessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, id + 'Error');
  });
});

/* ================================================================
   Footer — current year
   ================================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
