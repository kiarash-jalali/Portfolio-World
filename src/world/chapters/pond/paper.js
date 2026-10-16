/**
 * Paints the thirteen parchment pieces of the opening. Every piece is torn by
 * hand from its own seed: its own size, outline, missing corner, tone, fibres
 * and foxing. Each gets a dry version and a wet one that it soaks into after
 * touching the water. The seeds are fixed, so a piece looks the same on every
 * visit.
 */

/** Size range of a piece in CSS pixels, before the portrait scale. */
const SIZE = { minWidth: 40, maxWidth: 56, minHeight: 54, maxHeight: 72 };
/** Painted at twice the CSS size so the edges stay sharp on dense screens. */
const PIXEL_RATIO = 2;
/** How far the torn edge can wander in from the rectangle, in CSS pixels. */
const TEAR = { inset: 2, wander: 3.2, fibre: 1.1, step: 2.4 };

/** A small seeded random generator (Park–Miller), so pieces tear the same way every time. */
function seeded(seed) {
  let state = (seed * 7919 + 104729) % 2147483647;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

const between = (random, min, max) => min + random() * (max - min);

/** The outline of a torn piece: a list of [x, y] points in CSS pixels. */
function tearOutline(random, width, height) {
  // Two slow waves per side give the tear its large shape; jitter adds the fibres.
  const waves = Array.from({ length: 4 }, () => [random() * 6.28, between(random, 1, 2.6)]);
  // One corner, sometimes two, is torn off or folded away.
  const lostCorners = new Set([Math.floor(random() * 4)]);
  if (random() < 0.35) lostCorners.add(Math.floor(random() * 4));
  const cornerBite = between(random, 5, 11);

  const corners = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const points = [];

  corners.forEach((from, side) => {
    const to = corners[(side + 1) % 4];
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const steps = Math.max(4, Math.round(length / TEAR.step));
    // Inward normal of this side.
    const nx = (from[1] - to[1]) / length;
    const ny = (to[0] - from[0]) / length;
    const [phase, cycles] = waves[side];

    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      let inset =
        TEAR.inset +
        (Math.sin(t * cycles * 6.28 + phase) * 0.5 + 0.5) * TEAR.wander +
        (random() - 0.5) * 2 * TEAR.fibre;
      // Bite into the corner this side starts at, or the one it ends at.
      if (lostCorners.has(side)) inset += Math.max(0, 1 - t * (length / cornerBite)) * cornerBite;
      if (lostCorners.has((side + 1) % 4)) inset += Math.max(0, 1 - (1 - t) * (length / cornerBite)) * cornerBite;

      points.push([from[0] + (to[0] - from[0]) * t + nx * inset, from[1] + (to[1] - from[1]) * t + ny * inset]);
    }
  });
  return points;
}

function tracePath(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

/** Aged parchment: a warm base, mottled stains, fibres, foxing and a darkened torn edge. */
function paintParchment(ctx, random, width, height, outline, tone) {
  tracePath(ctx, outline);
  ctx.save();
  ctx.clip();

  // Base: light where the sun has bleached it, darker toward one edge.
  const angle = random() * 6.28;
  const gradient = ctx.createLinearGradient(
    width / 2 - (Math.cos(angle) * width) / 2,
    height / 2 - (Math.sin(angle) * height) / 2,
    width / 2 + (Math.cos(angle) * width) / 2,
    height / 2 + (Math.sin(angle) * height) / 2,
  );
  gradient.addColorStop(0, `hsl(${tone.hue} ${tone.saturation}% ${tone.light + 8}%)`);
  gradient.addColorStop(1, `hsl(${tone.hue - 4} ${tone.saturation - 8}% ${tone.light - 12}%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Mottling: soft stains of darker and lighter paper.
  for (let n = 0; n < 26; n++) {
    const x = random() * width;
    const y = random() * height;
    const radius = between(random, 3, 14);
    const stain = ctx.createRadialGradient(x, y, 0, x, y, radius);
    const dark = random() < 0.6;
    stain.addColorStop(0, dark ? `hsl(${tone.hue - 6} 45% 38% / 0.12)` : 'hsl(46 70% 92% / 0.16)');
    stain.addColorStop(1, 'hsl(40 40% 50% / 0)');
    ctx.fillStyle = stain;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  // Fibres: short hairlines, mostly running with the grain.
  const grain = between(random, -0.3, 0.3);
  ctx.lineWidth = 0.35;
  for (let n = 0; n < 46; n++) {
    const x = random() * width;
    const y = random() * height;
    const length = between(random, 2, 7);
    const a = grain + (random() - 0.5) * 0.9;
    ctx.strokeStyle = random() < 0.5 ? 'hsl(35 35% 35% / 0.18)' : 'hsl(48 60% 94% / 0.3)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * length, y + Math.sin(a) * length);
    ctx.stroke();
  }

  // Foxing: a few rust-brown age spots.
  const spots = Math.floor(between(random, 1, 5));
  for (let n = 0; n < spots; n++) {
    const x = random() * width;
    const y = random() * height;
    const radius = between(random, 0.6, 2);
    ctx.fillStyle = `hsl(24 55% ${between(random, 30, 45)}% / ${between(random, 0.25, 0.55)})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 6.28);
    ctx.fill();
  }

  // Sometimes an old fold runs across the piece.
  if (random() < 0.45) {
    const y = between(random, 0.3, 0.7) * height;
    const tilt = between(random, -5, 5);
    ctx.strokeStyle = 'hsl(36 35% 40% / 0.2)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, y - tilt);
    ctx.lineTo(width, y + tilt);
    ctx.stroke();
    ctx.strokeStyle = 'hsl(48 70% 94% / 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, y - tilt + 0.8);
    ctx.lineTo(width, y + tilt + 0.8);
    ctx.stroke();
  }

  // The torn edge is darker and slightly burnt-looking, soaked by years of handling.
  tracePath(ctx, outline);
  ctx.shadowColor = 'hsl(28 55% 22% / 0.65)';
  ctx.shadowBlur = 5;
  ctx.strokeStyle = 'hsl(30 45% 32% / 0.55)';
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.restore();

  // A thin lighter rim where the fibres of the tear catch the light.
  tracePath(ctx, outline);
  ctx.strokeStyle = 'hsl(45 60% 88% / 0.45)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

/** The same piece after soaking: darker, cooler, translucent where the water got in first. */
function paintSoaked(ctx, random, width, height, outline, dry) {
  ctx.drawImage(dry, 0, 0, width, height);

  ctx.save();
  tracePath(ctx, outline);
  ctx.clip();
  // Water creeps in from one side.
  const side = random() * 6.28;
  const cx = width / 2 + Math.cos(side) * width * 0.6;
  const cy = height / 2 + Math.sin(side) * height * 0.6;
  const soak = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 1.15);
  soak.addColorStop(0, 'hsl(165 30% 58% / 0.5)');
  soak.addColorStop(0.55, 'hsl(50 30% 62% / 0.32)');
  soak.addColorStop(1, 'hsl(45 30% 70% / 0.12)');
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = soak;
  ctx.fillRect(0, 0, width, height);

  // A tide line where the water stopped spreading.
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'hsl(32 40% 30% / 0.22)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(width, height) * between(random, 0.55, 0.8), 0, 6.28);
  ctx.stroke();
  ctx.restore();

  // Wet paper turns translucent: let a little of the pond through, most at the soaked side.
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  const clear = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height));
  clear.addColorStop(0, 'rgb(0 0 0 / 0.24)');
  clear.addColorStop(1, 'rgb(0 0 0 / 0.04)');
  ctx.fillStyle = clear;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * PIXEL_RATIO);
  canvas.height = Math.ceil(height * PIXEL_RATIO);
  const ctx = canvas.getContext('2d');
  ctx?.scale(PIXEL_RATIO, PIXEL_RATIO);
  return { canvas, ctx };
}

/**
 * Size and look of piece `index`. `dry` and `wet` are image URLs, or null where
 * canvas isn't available; the CSS then falls back to a plain parchment fill.
 */
export function paintPaper(index) {
  const random = seeded(index + 1);
  const width = Math.round(between(random, SIZE.minWidth, SIZE.maxWidth));
  const height = Math.round(between(random, SIZE.minHeight, SIZE.maxHeight));
  const piece = {
    width,
    height,
    // The letter is written by hand: never quite centered or upright.
    inkTilt: between(random, -7, 7),
    inkX: between(random, -2.5, 2.5),
    inkY: between(random, -2, 3),
    dry: null,
    wet: null,
  };

  const dry = makeCanvas(width, height);
  const wet = makeCanvas(width, height);
  if (!dry.ctx || !wet.ctx) return piece;

  const outline = tearOutline(random, width, height);
  const tone = {
    hue: between(random, 36, 46),
    saturation: between(random, 42, 62),
    light: between(random, 66, 76),
  };
  paintParchment(dry.ctx, random, width, height, outline, tone);
  paintSoaked(wet.ctx, random, width, height, outline, dry.canvas);

  piece.dry = dry.canvas.toDataURL();
  piece.wet = wet.canvas.toDataURL();
  return piece;
}
