// footer year
document.getElementById("year").textContent = new Date().getFullYear();

// scroll reveal
const revealEls = document.querySelectorAll(".card, .strip, .hero");
revealEls.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// floating sparkles
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("sparkles");
  const ctx = canvas.getContext("2d");
  const colors = ["#ff8fb8", "#9b8cff", "#5fc9e8", "#ffd166", "#7fdcb5", "#ffffff"];
  let w, h, dpr, stars = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = Math.round((innerWidth * innerHeight) / 24000);
    stars = Array.from({ length: Math.max(18, count) }, spawn);
  }

  function spawn() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 5 + 3) * dpr,
      speed: (Math.random() * 0.3 + 0.1) * dpr,
      drift: Math.random() * Math.PI * 2,
      tw: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() < 0.6 ? "star" : "heart",
    };
  }

  function star(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 ? r * 0.28 : r;
      const a = (Math.PI / 4) * i - Math.PI / 2;
      ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  function heart(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y + r * 0.9);
    ctx.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.3, x, y - r * 0.4);
    ctx.bezierCurveTo(x + r * 0.7, y - r * 1.3, x + r * 1.6, y - r * 0.2, x, y + r * 0.9);
    ctx.fill();
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.y -= s.speed;
      s.x += Math.sin(t / 1800 + s.drift) * 0.35 * dpr;
      if (s.y < -20 * dpr) { s.y = h + 20 * dpr; s.x = Math.random() * w; }
      ctx.globalAlpha = 0.35 + 0.45 * Math.abs(Math.sin(t / 900 + s.tw));
      ctx.fillStyle = s.color;
      (s.shape === "star" ? star : heart)(s.x, s.y, s.r);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
