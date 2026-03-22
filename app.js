/* ===================================================
   SANOJ TRAVELS – Core JavaScript
   Navigation, Autocomplete, Passenger Management,
   WhatsApp Integration
   =================================================== */

(() => {
  'use strict';

  // ─── CONFIG ─────────────────────────────────────
  const SANOJ_PHONE = '918860586724';
  const WHATSAPP_BASE = `https://wa.me/${SANOJ_PHONE}`;

  // ─── ANTI-SPAM / RATE LIMITER ──────────────────
  const SPAM_CONFIG = {
    maxSubmissions: 5,       // max submissions per window
    windowMs: 10 * 60 * 1000, // 10 minute window
    cooldownMs: 30 * 1000,    // 30s cooldown between submissions
    storageKey: 'st_submissions'
  };

  function getSubmissionLog() {
    try {
      const raw = localStorage.getItem(SPAM_CONFIG.storageKey);
      if (!raw) return [];
      const log = JSON.parse(raw);
      const now = Date.now();
      // Purge entries older than the window
      return log.filter(ts => now - ts < SPAM_CONFIG.windowMs);
    } catch { return []; }
  }

  function recordSubmission() {
    const log = getSubmissionLog();
    log.push(Date.now());
    localStorage.setItem(SPAM_CONFIG.storageKey, JSON.stringify(log));
  }

  function canSubmit() {
    const log = getSubmissionLog();
    // Check rate limit
    if (log.length >= SPAM_CONFIG.maxSubmissions) {
      const oldest = log[0];
      const waitSec = Math.ceil((SPAM_CONFIG.windowMs - (Date.now() - oldest)) / 1000);
      const waitMin = Math.ceil(waitSec / 60);
      alert(`⚠️ Too many requests! You have reached the limit of ${SPAM_CONFIG.maxSubmissions} submissions. Please wait ${waitMin} minute${waitMin > 1 ? 's' : ''} before trying again.`);
      return false;
    }
    // Check cooldown
    if (log.length > 0) {
      const lastSubmission = log[log.length - 1];
      const elapsed = Date.now() - lastSubmission;
      if (elapsed < SPAM_CONFIG.cooldownMs) {
        const remainSec = Math.ceil((SPAM_CONFIG.cooldownMs - elapsed) / 1000);
        alert(`⚠️ Please wait ${remainSec} seconds before submitting again.`);
        return false;
      }
    }
    return true;
  }

  // Honeypot: inject a hidden field into every form
  function injectHoneypot(form) {
    if (!form || form.querySelector('.hp-field')) return;
    const hp = document.createElement('div');
    hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;height:0;width:0;overflow:hidden;opacity:0;pointer-events:none;';
    hp.setAttribute('aria-hidden', 'true');
    hp.innerHTML = '<input type="text" name="website_url" class="hp-field" tabindex="-1" autocomplete="off">';
    form.appendChild(hp);
  }

  function isHoneypotFilled(form) {
    const hp = form.querySelector('.hp-field');
    return hp && hp.value.length > 0; // bots fill this, humans don't see it
  }

  // Button cooldown countdown
  function lockButton(btn, seconds) {
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.pointerEvents = 'none';
    let remaining = seconds;
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Wait ${remaining}s`;
    const timer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(timer);
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
      } else {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Wait ${remaining}s`;
      }
    }, 1000);
  }

  // ─── NAVBAR SCROLL ─────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ─── HAMBURGER MENU ────────────────────────────
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── SCROLL ANIMATIONS ────────────────────────
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (animEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    animEls.forEach(el => obs.observe(el));
  }

  // ─── WHATSAPP HELPER (with spam guard) ─────────
  function sendWhatsApp(msg, submitBtn) {
    if (!canSubmit()) return false;
    if (submitBtn) {
      const form = submitBtn.closest('form');
      if (form && isHoneypotFilled(form)) {
        // Silent reject — bot detected
        console.warn('Spam submission blocked.');
        return false;
      }
    }
    recordSubmission();
    if (submitBtn) lockButton(submitBtn, 30);
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, '_blank');
    return true;
  }
  window.sendWhatsApp = sendWhatsApp;
  window.WHATSAPP_BASE = WHATSAPP_BASE;
  window.SANOJ_PHONE = SANOJ_PHONE;

  // ─── AUTOCOMPLETE COMPONENT ───────────────────
  function createAutocomplete(inputId, dataList, opts = {}) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'autocomplete-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    wrapper.appendChild(dropdown);

    let selectedIdx = -1;

    function filterAndShow(query) {
      const q = query.toLowerCase().trim();
      if (q.length < 1) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); return; }

      const matches = dataList.filter(item => {
        const text = typeof item === 'string' ? item : item.name;
        return text.toLowerCase().includes(q);
      }).slice(0, 12);

      if (!matches.length) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); return; }

      dropdown.innerHTML = matches.map((item, i) => {
        const text = typeof item === 'string' ? item : `${item.name} (${item.number})`;
        const highlighted = text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
        return `<div class="autocomplete-item${i === selectedIdx ? ' selected' : ''}" data-value="${typeof item === 'string' ? item : item.name}" data-index="${i}">${highlighted}</div>`;
      }).join('');
      dropdown.classList.add('open');
      selectedIdx = -1;
    }

    input.addEventListener('input', () => filterAndShow(input.value));
    input.addEventListener('focus', () => { if (input.value.length >= 1) filterAndShow(input.value); });

    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (item) {
        input.value = item.dataset.value;
        dropdown.innerHTML = '';
        dropdown.classList.remove('open');
        if (opts.onSelect) opts.onSelect(item.dataset.value);
        // Trigger change event
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('selected', i === selectedIdx));
        items[selectedIdx]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        items.forEach((el, i) => el.classList.toggle('selected', i === selectedIdx));
        items[selectedIdx]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && selectedIdx >= 0) {
        e.preventDefault();
        items[selectedIdx]?.click();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) { dropdown.classList.remove('open'); }
    });
  }

  // ─── ADD PASSENGER MANAGER ────────────────────
  function initPassengerManager(containerId, addBtnId) {
    const container = document.getElementById(containerId);
    const addBtn = document.getElementById(addBtnId);
    if (!container || !addBtn) return;

    let count = 1;
    renderPassenger(container, count);

    addBtn.addEventListener('click', () => {
      if (count >= 6) { alert('Maximum 6 passengers allowed per booking.'); return; }
      count++;
      renderPassenger(container, count);
      updatePassengerCount();
    });

    function updatePassengerCount() {
      const countEl = document.getElementById('passengerCountDisplay');
      if (countEl) countEl.textContent = count;
    }
  }

  function renderPassenger(container, num) {
    const card = document.createElement('div');
    card.className = 'passenger-card';
    card.dataset.passenger = num;
    card.innerHTML = `
      <div class="passenger-card__header">
        <span class="passenger-card__number">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Passenger ${num}
        </span>
        ${num > 1 ? `<button type="button" class="passenger-card__remove" onclick="this.closest('.passenger-card').remove(); document.getElementById('passengerCountDisplay') && (document.getElementById('passengerCountDisplay').textContent = document.querySelectorAll('.passenger-card').length);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Remove
        </button>` : ''}
      </div>
      <div class="form-row form-row--3">
        <div class="form-group">
          <label>Name <span class="required">*</span></label>
          <input type="text" name="pax_name_${num}" class="form-control" placeholder="Full name" required>
        </div>
        <div class="form-group">
          <label>Age <span class="required">*</span></label>
          <input type="number" name="pax_age_${num}" class="form-control" placeholder="Age" min="1" max="120" required>
        </div>
        <div class="form-group">
          <label>Gender <span class="required">*</span></label>
          <select name="pax_gender_${num}" class="form-control" required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(card);
  }

  function getPassengerDetails() {
    const cards = document.querySelectorAll('.passenger-card');
    let details = [];
    cards.forEach((card, i) => {
      const name = card.querySelector(`input[name^="pax_name"]`)?.value || '';
      const age = card.querySelector(`input[name^="pax_age"]`)?.value || '';
      const gender = card.querySelector(`select[name^="pax_gender"]`)?.value || '';
      if (name) {
        details.push(`  ${i + 1}. ${name}, Age: ${age}, ${gender}`);
      }
    });
    return details;
  }
  window.getPassengerDetails = getPassengerDetails;

  // ─── INIT AUTOCOMPLETES ───────────────────────
  if (typeof BOOKING_DATA !== 'undefined') {
    // Train stations
    createAutocomplete('trainFrom', BOOKING_DATA.stations);
    createAutocomplete('trainTo', BOOKING_DATA.stations);
    // Train name search
    createAutocomplete('trainName_search', BOOKING_DATA.trains);
    // Flight airports
    createAutocomplete('flightDeparture', BOOKING_DATA.airports);
    createAutocomplete('flightDestination', BOOKING_DATA.airports);
  }

  // ─── INIT PASSENGER MANAGERS ──────────────────
  initPassengerManager('trainPassengers', 'addTrainPassenger');
  initPassengerManager('flightPassengers', 'addFlightPassenger');
  initPassengerManager('hotelGuests_container', 'addHotelGuest');

  // ─── INJECT HONEYPOTS ON ALL FORMS ─────────────
  document.querySelectorAll('form').forEach(f => injectHoneypot(f));

  // ─── TRAIN BOOKING FORM ───────────────────────
  const trainForm = document.getElementById('trainBookingForm');
  if (trainForm) {
    trainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = trainForm.querySelector('[type="submit"]');
      const fd = new FormData(trainForm);
      const pax = getPassengerDetails();
      const msg = `🚆 *NEW TRAIN BOOKING REQUEST*

*Travel Date:* ${fd.get('date')}
*From:* ${fd.get('from')}
*To:* ${fd.get('to')}
*Train:* ${fd.get('train') || 'Any available'}
*Class:* ${fd.get('class')}
*Booking Type:* ${fd.get('tatkal')}
*Contact Number:* ${fd.get('mobile')}

*Passengers (${pax.length}):*
${pax.join('\n')}

_Sent from Sanoj Travel Booking Website_`;

      if (sendWhatsApp(msg, btn)) showSuccess(trainForm);
    });
  }

  // ─── FLIGHT BOOKING FORM ──────────────────────
  const flightForm = document.getElementById('flightBookingForm');
  if (flightForm) {
    flightForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = flightForm.querySelector('[type="submit"]');
      const fd = new FormData(flightForm);
      const pax = getPassengerDetails();
      const msg = `✈️ *NEW FLIGHT BOOKING REQUEST*

*Travel Date:* ${fd.get('date')}
*From:* ${fd.get('departure')}
*To:* ${fd.get('destination')}
*Trip:* ${fd.get('trip')}
*Airline Preference:* ${fd.get('airline') || 'Any / Best Price'}
*Budget:* ${fd.get('budget') || 'Not specified'}
*Contact Number:* ${fd.get('mobile')}

*Passengers (${pax.length}):*
${pax.join('\n')}

_Sent from Sanoj Travel Booking Website_`;

      if (sendWhatsApp(msg, btn)) showSuccess(flightForm);
    });
  }

  // ─── HOTEL BOOKING FORM ───────────────────────
  const hotelForm = document.getElementById('hotelBookingForm');
  if (hotelForm) {
    hotelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = hotelForm.querySelector('[type="submit"]');
      const fd = new FormData(hotelForm);
      const pax = getPassengerDetails();
      const guestInfo = pax.length ? `\n*Guests (${pax.length}):*\n${pax.join('\n')}` : '';
      const msg = `🏨 *NEW HOTEL BOOKING REQUEST*

*City:* ${fd.get('city')}
*Check-in:* ${fd.get('checkin')}
*Check-out:* ${fd.get('checkout')}
*Rooms:* ${fd.get('rooms') || '1'}
*Budget:* ${fd.get('budget')}
*Hotel Type:* ${fd.get('hotelType')}
*Contact:* ${fd.get('mobile')}${guestInfo}

_Sent from Sanoj Travel Booking Website_`;

      if (sendWhatsApp(msg, btn)) showSuccess(hotelForm);
    });
  }

  // ─── CONTACT FORM ─────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const fd = new FormData(contactForm);
      const msg = `📩 *NEW QUERY FROM WEBSITE*

*Name:* ${fd.get('name')}
*Mobile:* ${fd.get('mobile')}
*Subject:* ${fd.get('subject')}
*Message:* ${fd.get('message')}

_Sent from Sanoj Travel Booking Website_`;

      if (sendWhatsApp(msg, btn)) showSuccess(contactForm);
    });
  }

  // ─── SHOW SUCCESS ─────────────────────────────
  function showSuccess(form) {
    const s = form.parentElement.querySelector('.form-success');
    if (s) { form.style.display = 'none'; s.classList.add('show'); }
  }

  // ─── YEAR ─────────────────────────────────────
  const y = document.getElementById('currentYear');
  if (y) y.textContent = new Date().getFullYear();

  // ─── INIT LUCIDE ICONS ────────────────────────
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

})();
