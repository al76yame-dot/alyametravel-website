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

// Background Music Player
(function() {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  const tooltip = document.getElementById('musicTooltip');
  if (!audio || !toggle) return;

  audio.volume = 0.25; // soft volume

  // Restore user preference
  const userPref = localStorage.getItem('alyame-music');

  function play() {
    audio.play().then(() => {
      toggle.classList.add('playing');
      toggle.innerHTML = '<i class="fas fa-pause"></i>';
      if (tooltip) tooltip.classList.add('hidden');
      localStorage.setItem('alyame-music', 'on');
    }).catch(() => {
      // autoplay blocked — wait for first interaction
      const onFirstInteraction = () => {
        audio.play().then(() => {
          toggle.classList.add('playing');
          toggle.innerHTML = '<i class="fas fa-pause"></i>';
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

  // Auto-start if user previously enabled, or first visit
  if (userPref !== 'off') {
    setTimeout(play, 800);
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
