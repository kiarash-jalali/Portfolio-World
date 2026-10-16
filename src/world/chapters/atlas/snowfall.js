/**
 * Light snow over the finished diorama, drawn on a canvas at a held cadence.
 * It only runs while the atlas is on screen and its snow layer is showing
 * (the scroll timeline fades it in at the end).
 */

const STEP_MS = 1000 / 24; // 24 frames per second
const FLAKES = { desktop: 190, mobile: 90 };
const MOBILE_WIDTH = 701;

export function initSnowfall(motion) {
  const canvas = document.querySelector('.atlas-snow');
  const section = canvas.closest('section');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let flakes = [];
  let timer = 0;
  let visible = false;

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = innerWidth < MOBILE_WIDTH ? FLAKES.mobile : FLAKES.desktop;
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      size: 1.2 + Math.random() * 2.8,
      fall: 0.6 + Math.random() * 1.4,
      sway: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f7fafcf0';
    for (const flake of flakes) {
      // Bigger flakes are nearer, so they fall faster.
      flake.y += flake.fall * flake.size;
      flake.sway += 0.04;
      flake.x += Math.sin(flake.sway) * 0.5;
      if (flake.y > height + 4) {
        flake.y = -4;
        flake.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick() {
    // The scroll timeline controls the layer's opacity; no snow, no work.
    if (Number(getComputedStyle(canvas).opacity) > 0.02) draw();
  }

  function sync() {
    clearInterval(timer);
    timer = 0;
    if (visible && !document.hidden && !motion.paused) timer = setInterval(tick, STEP_MS);
  }

  resize();
  addEventListener('resize', resize);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(section);
  document.addEventListener('visibilitychange', sync);
  motion.onChange(sync);
}
