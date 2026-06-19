const card = document.getElementById('card');
const confettiBtn = document.getElementById('confettiBtn');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

card.addEventListener('click', (e) => {
  if (!card.classList.contains('opened')) {
    card.classList.add('opened');
    launchConfetti();
  }
});

confettiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  launchConfetti();
});

const particles = [];
const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff78ae', '#a66cff'];

function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1) * 14 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.15 + Math.random() * 0.1,
      opacity: 1,
    });
  }
  if (particles.length <= 120) animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.vy += p.gravity;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.opacity -= 0.005;

    if (p.opacity <= 0 || p.y > canvas.height + 20) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(animate);
  }
}
