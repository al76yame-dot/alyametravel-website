// ━━━━━━━━━━ Currency Switcher ━━━━━━━━━━
(function() {
  const rates = { USD: 1, LYD: 5.45, EGP: 49.5 };
  const symbols = {
    USD: { code: '$', name: 'دولار', flag: '🇺🇸' },
    LYD: { code: 'د.ل', name: 'دينار', flag: '🇱🇾' },
    EGP: { code: 'ج.م', name: 'جنيه', flag: '🇪🇬' }
  };

  function updatePrices(currency) {
    document.querySelectorAll('[data-usd]').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      if (isNaN(usd)) return;
      const converted = Math.round(usd * rates[currency]);
      const formatted = converted.toLocaleString('en-US');
      el.textContent = currency === 'USD'
        ? '$' + formatted
        : formatted + ' ' + symbols[currency].code;
    });
    localStorage.setItem('alyame-currency', currency);
    document.querySelectorAll('.currency-switcher button').forEach(b => {
      b.classList.toggle('active', b.dataset.currency === currency);
    });
  }

  // Always build the switcher on every page
  if (!document.querySelector('.currency-switcher')) {
    const switcher = document.createElement('div');
    switcher.className = 'currency-switcher';
    switcher.innerHTML = `
      <button data-currency="USD" title="دولار أمريكي">USD</button>
      <button data-currency="LYD" title="دينار ليبي">LYD</button>
      <button data-currency="EGP" title="جنيه مصري">EGP</button>
    `;
    document.body.appendChild(switcher);
    switcher.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (btn) updatePrices(btn.dataset.currency);
    });
    updatePrices(localStorage.getItem('alyame-currency') || 'USD');
  }
})();

// Mobile menu
const toggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('show'));
}

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .dest-card, .offer-card, .stat-num').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Background Audio Player
(function() {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  const tooltip = document.getElementById('musicTooltip');
  if (!audio || !toggle) return;

  audio.volume = 0.5;
  const userPref = localStorage.getItem('alyame-music');

  function play() {
    audio.play().then(() => {
      toggle.classList.add('playing');
      toggle.innerHTML = '<i class="fas fa-pause"></i>';
      if (tooltip) tooltip.classList.add('hidden');
      localStorage.setItem('alyame-music', 'on');
    }).catch(() => {
      const onFirstInteraction = () => {
        audio.play().then(() => {
          toggle.classList.add('playing');
          toggle.innerHTML = '<i class="fas fa-pause"></i>';
          if (tooltip) tooltip.classList.add('hidden');
        });
        document.removeEventListener('click', onFirstInteraction);
        document.removeEventListener('touchstart', onFirstInteraction);
      };
      document.addEventListener('click', onFirstInteraction, { once: true });
      document.addEventListener('touchstart', onFirstInteraction, { once: true });
    });
  }
  function pause() {
    audio.pause();
    toggle.classList.remove('playing');
    toggle.innerHTML = '<i class="fas fa-music"></i>';
    localStorage.setItem('alyame-music', 'off');
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) play(); else pause();
  });

  if (userPref !== 'off') {
    setTimeout(play, 500);
  } else {
    if (tooltip) tooltip.classList.add('hidden');
  }
})();

// Contact form -> mailto fallback (works without backend)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const phone = data.get('phone');
    const email = data.get('email');
    const service = data.get('service');
    const message = data.get('message');
    const subject = encodeURIComponent(`طلب جديد - ${service || 'استفسار'}`);
    const body = encodeURIComponent(
      `الاسم: ${name}\nالجوال: ${phone}\nالبريد: ${email}\nالخدمة: ${service}\n\nالرسالة:\n${message}`
    );
    window.location.href = `mailto:info@alyametravel.com?subject=${subject}&body=${body}`;
  });
}
