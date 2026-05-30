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
