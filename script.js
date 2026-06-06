/* ============================================================
   Theme toggle — persists preference in localStorage
   ============================================================ */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ============================================================
   Header — add shadow on scroll
   ============================================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================================
   Mobile nav burger
   ============================================================ */
const navBurger = document.getElementById('navBurger');
const nav       = document.getElementById('nav');

navBurger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);

  const spans = navBurger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    navBurger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

/* ============================================================
   Typewriter effect
   ============================================================ */
const roles = [
  'Full-Stack Developer',
  'UI / UX Enthusiast',
  'Open-Source Contributor',
  'Problem Solver',
];

const typewriterEl = document.getElementById('typewriter');
let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
const TYPING_MS = 80;
const DELETE_MS = 45;
const PAUSE_MS  = 1800;

function type() {
  const current = roles[roleIndex];

  if (!isDeleting) {
    typewriterEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, PAUSE_MS);
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(type, isDeleting ? DELETE_MS : TYPING_MS);
}

type();

/* ============================================================
   Scroll-reveal — IntersectionObserver
   ============================================================ */
const revealTargets = [
  '.hero__inner',
  '.about__image-wrap',
  '.about__content',
  '.section__title',
  '.section__subtitle',
  '.projects__filters',
  '.card',
  '.contact__form',
  '.contact__socials',
];

revealTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   Project filter
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.classList.add('reveal');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
});

/* ============================================================
   Contact form — client-side validation
   ============================================================ */
const form         = document.getElementById('contactForm');
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess  = document.getElementById('formSuccess');

function showError(inputEl, errorId, msg) {
  inputEl.classList.add('invalid');
  document.getElementById(errorId).textContent = msg;
}
function clearError(inputEl, errorId) {
  inputEl.classList.remove('invalid');
  document.getElementById(errorId).textContent = '';
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  if (!nameInput.value.trim()) {
    showError(nameInput, 'nameError', 'Name is required.');
    valid = false;
  } else {
    clearError(nameInput, 'nameError');
  }

  if (!emailInput.value.trim()) {
    showError(emailInput, 'emailError', 'Email is required.');
    valid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    showError(emailInput, 'emailError', 'Please enter a valid email.');
    valid = false;
  } else {
    clearError(emailInput, 'emailError');
  }

  if (!messageInput.value.trim()) {
    showError(messageInput, 'messageError', 'Message is required.');
    valid = false;
  } else {
    clearError(messageInput, 'messageError');
  }

  if (!valid) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent  = 'Sending…';
  submitBtn.disabled     = true;

  setTimeout(() => {
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled    = false;
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});

[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    const errorId = input.id + 'Error';
    clearError(input, errorId);
  });
});

/* ============================================================
   Footer year
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
