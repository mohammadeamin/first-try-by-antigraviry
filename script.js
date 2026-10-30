/**
 * ALEX MORGAN PORTFOLIO - CORE INTERACTION CONTROLLER
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light Mode)
  initTheme();

  // 2. Mobile Navigation Toggle
  initMobileNav();

  // 3. Active Nav Link on Scroll
  initScrollSpy();

  // 4. Project Category Filtering
  initProjectFilters();

  // 5. Interactive Copy Email
  initCopyEmail();

  // 6. Interactive Contact Form
  initContactForm();

  // 7. Dynamic Stats Counter Animation
  initStatsCounter();

  // 8. Auto Update Current Year in Footer
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLER
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  htmlRoot.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close mobile drawer when clicking a nav item
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Close when clicking outside navbar
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

/* --------------------------------------------------------------------------
   3. ACTIVE NAV LINK ON SCROLL (SCROLL SPY)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. COPY EMAIL TO CLIPBOARD
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailLink = document.getElementById('email-link');

  if (!copyBtn || !emailLink) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailLink.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email address copied to clipboard!');
    } catch (err) {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Email address copied to clipboard!');
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const msgSpan = toast.querySelector('.toast-message');
  if (msgSpan) msgSpan.textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM VALIDATION & SUBMISSION SIMULATION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Reset error messages
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = 'Please provide your email address.';
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = 'Please enter your message or project summary.';
      isValid = false;
    } else if (messageInput.value.trim().length < 15) {
      if (messageError) messageError.textContent = 'Message should be at least 15 characters.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending state
    submitBtn.disabled = true;
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;

      if (feedback) {
        feedback.style.display = 'block';
        feedback.className = 'form-feedback success';
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you, <strong>' + escapeHtml(nameInput.value.trim()) + '</strong>! Your message was sent successfully. I will get back to you soon.';
      }

      form.reset();

      setTimeout(() => {
        if (feedback) feedback.style.display = 'none';
      }, 7000);
    }, 1200);
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}

/* --------------------------------------------------------------------------
   7. STATS NUMBER COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (!statValues.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statValues.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const originalText = el.textContent;
          const suffix = originalText.includes('%') ? '%' : '+';

          let current = 0;
          const increment = target / 35;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}
