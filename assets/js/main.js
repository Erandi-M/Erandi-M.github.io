/* Lumina — shared behaviour */
(function () {
  'use strict';

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((a) => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // "Currently exploring" lantern rotation
  const textEl = document.querySelector('.lantern__text');
  if (textEl) {
    const items = [
      'open source contributions',
      'teaching & mentoring',
      'a Java side project',
      'learning something new',
    ];
    let i = 0;
    setInterval(() => {
      textEl.style.opacity = 0;
      setTimeout(() => {
        i = (i + 1) % items.length;
        textEl.textContent = items[i];
        textEl.style.opacity = 1;
      }, 400);
    }, 3800);
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }
})();