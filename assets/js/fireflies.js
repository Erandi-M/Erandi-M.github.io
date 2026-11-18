/* Lumina — ambient fireflies + candlelight cursor trail (desktop only) */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '1',
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = canvas.width = innerWidth * DPR;
    h = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  addEventListener('resize', resize);

  // Ambient drifting motes
  const count = Math.min(28, Math.floor(innerWidth / 50));
  const motes = Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: (Math.random() * 1.6 + 0.6) * DPR,
    vx: (Math.random() - 0.5) * 0.25 * DPR,
    vy: (Math.random() - 0.5) * 0.25 * DPR,
    a: Math.random() * 0.5 + 0.2,
    phase: Math.random() * Math.PI * 2,
  }));

  // Cursor trail
  const trail = [];
  let mx = -100, my = -100, hasPointer = false;
  addEventListener('mousemove', (e) => {
    hasPointer = true; mx = e.clientX * DPR; my = e.clientY * DPR;
    trail.push({ x: mx, y: my, life: 1 });
    if (trail.length > 18) trail.shift();
  });

  function loop(t) {
    ctx.clearRect(0, 0, w, h);

    motes.forEach((m) => {
      m.x += m.vx; m.y += m.vy; m.phase += 0.02;
      if (m.x < 0 || m.x > w) m.vx *= -1;
      if (m.y < 0 || m.y > h) m.vy *= -1;
      const a = m.a * (0.6 + 0.4 * Math.sin(m.phase));
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,201,120,${a})`;
      ctx.shadowColor = 'rgba(255,201,120,.9)';
      ctx.shadowBlur = 8 * DPR;
      ctx.fill();
    });

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      p.life -= 0.035;
      if (p.life <= 0) continue;
      const r = 2.4 * DPR * p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,201,120,${p.life * 0.55})`;
      ctx.shadowColor = 'rgba(255,201,120,.95)';
      ctx.shadowBlur = 12 * DPR;
      ctx.fill();
    }
    while (trail.length && trail[0].life <= 0) trail.shift();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();