/* =========================================
   SHINING TITANS — script.js
   ========================================= */

/* --- NAVBAR: scroll state & mobile toggle --- */
const navbar   = document.getElementById('navbar');
const toggle   = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

toggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-label', 'Open menu');
  });
});


/* --- REVEAL ON SCROLL (Intersection Observer) --- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling cards
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            el.style.transitionDelay = `${idx * 80}ms`;
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* --- FOOTER YEAR --- */
document.getElementById('year').textContent = new Date().getFullYear();


/* --- CONTACT FORM VALIDATION & SUBMISSION --- */
const form       = document.getElementById('contact-form');
const successBox = document.getElementById('form-success');

function getVal(id) { return document.getElementById(id).value.trim(); }

function setError(fieldId, msg) {
  const input = document.getElementById(fieldId);
  const err   = document.getElementById(fieldId + '-error');
  input.classList.toggle('invalid', !!msg);
  err.textContent = msg || '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return phone.replace(/\D/g, '').length >= 10;
}

function validateForm() {
  let valid = true;

  const name = getVal('name');
  if (name.length < 2) {
    setError('name', 'Name must be at least 2 characters.');
    valid = false;
  } else {
    setError('name', '');
  }

  const company = getVal('company');
  if (company.length < 2) {
    setError('company', 'Company name is required.');
    valid = false;
  } else {
    setError('company', '');
  }

  const email = getVal('email');
  if (!validateEmail(email)) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError('email', '');
  }

  const phone = getVal('phone');
  if (!validatePhone(phone)) {
    setError('phone', 'Please enter a valid phone number.');
    valid = false;
  } else {
    setError('phone', '');
  }

  const spaceType = getVal('spaceType');
  if (!spaceType) {
    setError('spaceType', 'Please select a space type.');
    valid = false;
  } else {
    setError('spaceType', '');
  }

  const address = getVal('address');
  if (!address) {
    setError('address', 'Please enter the property address.');
    valid = false;
  } else {
    setError('address', '');
  }

  return valid;
}

// Live clear errors on input
['name', 'company', 'email', 'phone', 'spaceType', 'address'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => setError(id, ''));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending…';

  const formError = document.getElementById('form-error');
  if (formError) formError.remove();

  const payload = {
    name: getVal('name'),
    company: getVal('company'),
    email: getVal('email'),
    phone: getVal('phone'),
    spaceType: getVal('spaceType'),
    address: getVal('address'),
    message: getVal('message'),
    _subject: `New Quote Request from ${getVal('company')}`,
    _replyto: getVal('email'),
  };

  try {
    const res = await fetch('https://formsubmit.co/ajax/info@worryfreecleaning.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === 'false' || data.success === false) {
      throw new Error('Something went wrong. Please try again.');
    }

    successBox.classList.remove('hidden');
    form.reset();
    form.style.display = 'none';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'form-error';
    errorDiv.style.cssText = 'background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:14px;';
    errorDiv.textContent = err.message;
    form.insertBefore(errorDiv, form.firstChild);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  }
});


/* --- SMOOTH SCROLL for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
