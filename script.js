// ─── Screen navigation ───
const screens = { s1: document.getElementById('s1'), s2: document.getElementById('s2'), s3: document.getElementById('s3') };

function goTo(id) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[id].classList.remove('hidden');
  if (id === 's3') setTimeout(burstConfetti, 350);
}

document.getElementById('tapReveal').addEventListener('click', () => goTo('s2'));
document.getElementById('toBtnS3').addEventListener('click', () => goTo('s3'));
document.getElementById('backToS1').addEventListener('click', () => goTo('s1'));

// ─── Screen 1: Gold dust particles ───
(function initDust() {
  const cv = document.getElementById('dustCanvas');
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, parts;

  function init() {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(40, Math.round(W * H / 9000));
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.5,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.6 + 0.2,
      tw: Math.random() * Math.PI * 2
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y += p.vy; p.x += p.vx; p.tw += 0.04;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      const al = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(212,175,55,${al.toFixed(3)})`;
      ctx.shadowColor = 'rgba(233,205,126,.9)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  init();
  window.addEventListener('resize', init);
  tick();
})();

// ─── Screen 3: Gold confetti burst ───
function burstConfetti() {
  const cv = document.getElementById('confettiCanvas');
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = cv.clientWidth || window.innerWidth;
  const H = cv.clientHeight || window.innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cols = ['#e9cd7e', '#d4af37', '#c5a55a', '#f2ead4', '#a9863f'];
  let bits = Array.from({ length: 160 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.5,
    y: -20 - Math.random() * H * 0.3,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 2 + 1.5,
    w: Math.random() * 6 + 4,
    h: Math.random() * 4 + 3,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.3,
    col: cols[(Math.random() * cols.length) | 0],
    life: 1
  }));

  const start = performance.now();
  function tick(t) {
    ctx.clearRect(0, 0, W, H);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.vy += 0.05; b.rot += b.vr; b.vx *= 0.995;
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.rot);
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.fillStyle = b.col;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
      if (b.y > H + 30) b.life -= 0.02;
    }
    bits = bits.filter(b => b.life > 0);
    if (t - start < 5200 && bits.length) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  }
  requestAnimationFrame(tick);
}
