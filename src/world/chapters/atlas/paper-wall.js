/**
 * The Wall and Castle Black as die-cut pop-up cards, painted in canvas to sit
 * beside the painted mountain and snowfield cards: watercolour washes, etched
 * ink hatching and a cream paper edge. The Wall is seen straight on, so it can
 * stand on a straight fold, which a perspective painting never could.
 * Seeded, so the cards look the same on every visit.
 */

/** Card sizes in canvas pixels. Both are drawn at this size and scaled by CSS. */
export const WALL_CARD = { width: 2400, height: 620 };
export const CASTLE_CARD = { width: 1400, height: 520 };

const PAPER = '#efe5cb';
const PAPER_EDGE = '#9c8a64';
const PAPER_MARGIN = 14;

function seeded(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

/** Strokes a die-cut outline: a cream paper margin with a thin inked cut line. */
function paperEdge(ctx, trace) {
  ctx.save();
  trace();
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = PAPER_MARGIN * 2;
  ctx.stroke();
  trace();
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.restore();
}
function cutLine(ctx, trace) {
  ctx.save();
  // The cut line sits just outside the paper margin.
  ctx.globalCompositeOperation = 'destination-over';
  trace();
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PAPER_EDGE;
  ctx.lineWidth = PAPER_MARGIN * 2 + 3;
  ctx.stroke();
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* The Wall                                                            */
/* ------------------------------------------------------------------ */

/** The Wall's silhouette: a long, slightly uneven crest and a drifted base. */
function wallOutline(random, width, height) {
  const top = [];
  const base = [];
  const crest = height * 0.13;
  const foot = height * 0.9;
  for (let x = 0; x <= width; x += 24) {
    // The crest is broken by small slumps and overhangs; it falls away at both ends.
    const ends = Math.min(x, width - x) / width;
    const fall = ends < 0.06 ? (0.06 - ends) * height * 5 : 0;
    top.push([x, crest + fall + (random() - 0.5) * 10 + Math.sin(x / 190) * 6]);
    base.push([x, foot + Math.sin(x / 140 + 1) * 12 + (random() - 0.5) * 8]);
  }
  return { top, base };
}

function traceShape({ top, base }) {
  return (ctx) => {
    ctx.beginPath();
    top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    [...base].reverse().forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
  };
}

/** Paints the Wall card into `canvas` and returns it. */
export function paintWall(canvas) {
  const { width, height } = WALL_CARD;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const random = seeded(4242);
  const shape = wallOutline(random, width, height);
  const trace = traceShape(shape);

  paperEdge(ctx, () => trace(ctx));
  ctx.save();
  trace(ctx);
  ctx.clip();

  // Wash: pale at the sunlit crest, deepening to cold blue at the foot.
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0.1, '#f3f7f8');
  wash.addColorStop(0.35, '#cfdfe7');
  wash.addColorStop(0.7, '#a2bfd0');
  wash.addColorStop(0.95, '#87a7bc');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // Great ice slabs: broad vertical bands of shade, darker toward the base.
  for (let n = 0; n < 46; n++) {
    const x = random() * width;
    const w = 30 + random() * 120;
    const slab = ctx.createLinearGradient(0, height * 0.15, 0, height);
    const dark = random() < 0.6;
    slab.addColorStop(0, dark ? '#5d84a000' : '#ffffff00');
    slab.addColorStop(1, dark ? '#5d84a033' : '#ffffff2e');
    ctx.fillStyle = slab;
    ctx.fillRect(x, 0, w, height);
  }

  // Broad light and shadow: the low sun catches some buttresses, others fall into shade.
  for (let n = 0; n < 9; n++) {
    const x = random() * width;
    const r = 180 + random() * 320;
    const lit = n % 3 !== 0;
    const patch = ctx.createRadialGradient(x, height * 0.45, 0, x, height * 0.45, r);
    patch.addColorStop(0, lit ? '#fffaf03d' : '#4a6f8c33');
    patch.addColorStop(1, lit ? '#fffaf000' : '#4a6f8c00');
    ctx.fillStyle = patch;
    ctx.fillRect(x - r, 0, r * 2, height);
  }

  // Striations: thin, slightly wavering vertical streaks of light and shadow.
  for (let x = 0; x < width; x += 6 + random() * 16) {
    const light = random() < 0.45;
    ctx.strokeStyle = light ? `rgb(255 255 255 / ${0.06 + random() * 0.14})` : `rgb(70 105 130 / ${0.04 + random() * 0.11})`;
    ctx.lineWidth = 0.8 + random() * 3;
    ctx.beginPath();
    let sx = x;
    ctx.moveTo(sx, height * 0.12);
    for (let y = height * 0.12; y < height; y += 40) {
      sx += (random() - 0.5) * 4;
      ctx.lineTo(sx, y);
    }
    ctx.stroke();
  }

  // Faint horizontal strata, the seasons of ice laid down over centuries.
  ctx.strokeStyle = '#ffffff30';
  ctx.lineWidth = 1.5;
  for (let y = height * 0.22; y < height * 0.85; y += 34 + random() * 30) {
    ctx.beginPath();
    for (let x = 0; x < width; x += 60) {
      if (random() < 0.25) ctx.moveTo(x, y + (random() - 0.5) * 6);
      else ctx.lineTo(x, y + (random() - 0.5) * 6);
    }
    ctx.stroke();
  }

  // Etched hatching in the shadowed lower face, like an engraved map plate.
  ctx.strokeStyle = '#2f4b6033';
  ctx.lineWidth = 1;
  for (let n = 0; n < 1400; n++) {
    const x = random() * width;
    const y = height * (0.45 + random() * 0.45);
    const len = 8 + random() * 22;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (random() - 0.5) * 2, y + len);
    ctx.stroke();
  }

  // Deep crevasses.
  ctx.strokeStyle = '#3a5d7a33';
  for (let n = 0; n < 18; n++) {
    const x = random() * width;
    ctx.lineWidth = 1.5 + random() * 2;
    ctx.beginPath();
    ctx.moveTo(x, height * (0.15 + random() * 0.2));
    ctx.lineTo(x + (random() - 0.5) * 10, height * (0.6 + random() * 0.3));
    ctx.stroke();
  }

  // The switchback stair up the face, and the winch cage at the top.
  const stairX = width * 0.6;
  ctx.strokeStyle = '#3a465055';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  let sy = height * 0.86;
  let left = true;
  ctx.moveTo(stairX, sy);
  while (sy > height * 0.18) {
    sy -= 30 + random() * 8;
    ctx.lineTo(stairX + (left ? -16 : 16) + (random() - 0.5) * 6, sy);
    left = !left;
  }
  ctx.stroke();
  ctx.strokeStyle = '#2b2a2a88';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(width * 0.66, height * 0.13);
  ctx.lineTo(width * 0.66, height * 0.5);
  ctx.stroke();
  ctx.fillStyle = '#2b2a2a99';
  ctx.fillRect(width * 0.66 - 5, height * 0.5, 10, 12);

  // Snow along the crest, with icicle drips below it.
  ctx.fillStyle = '#fbfdff';
  ctx.beginPath();
  shape.top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y - 4) : ctx.moveTo(x, y - 4)));
  [...shape.top].reverse().forEach(([x, y]) => ctx.lineTo(x, y + 12 + random() * 14));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffffbb';
  ctx.lineWidth = 2;
  shape.top.forEach(([x, y]) => {
    if (random() < 0.5) return;
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + 1, y + 30 + random() * 40);
    ctx.stroke();
  });

  // Drifts piled against the foot, with cool blue shadows.
  for (let x = -40; x < width; x += 70 + random() * 90) {
    const r = 50 + random() * 70;
    const y = height * 0.9;
    const drift = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    drift.addColorStop(0, '#ffffff');
    drift.addColorStop(0.75, '#e6eef4');
    drift.addColorStop(1, '#e6eef400');
    ctx.fillStyle = drift;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.6, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Inked contour along the crest and ends, as on the painted cards.
  ctx.save();
  trace(ctx);
  ctx.strokeStyle = '#3b4f5e88';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
  cutLine(ctx, () => trace(ctx));
  return canvas;
}

/* ------------------------------------------------------------------ */
/* Castle Black                                                        */
/* ------------------------------------------------------------------ */

/** The castle's buildings: [left, width, height, kind] as fractions of the card. */
const BUILDINGS = [
  [0.02, 0.1, 0.22, 'hall'],
  [0.1, 0.05, 0.42, 'tower'],
  [0.15, 0.16, 0.3, 'hall'],
  [0.3, 0.06, 0.62, 'keep'],
  [0.36, 0.14, 0.34, 'hall'],
  [0.49, 0.05, 0.48, 'tower'],
  [0.54, 0.18, 0.28, 'hall'],
  [0.71, 0.07, 0.56, 'keep'],
  [0.78, 0.14, 0.3, 'hall'],
  [0.91, 0.05, 0.4, 'tower'],
];

/** Paints the Castle Black card into `canvas` and returns it. */
export function paintCastle(canvas) {
  const { width, height } = CASTLE_CARD;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const random = seeded(777);
  const ground = height * 0.86;

  // Each building as a path; together they make the die-cut silhouette.
  const shapes = BUILDINGS.map(([left, w, h, kind]) => {
    const x = left * width;
    const bw = w * width;
    const top = ground - h * height;
    const roof = kind === 'hall' ? bw * 0.22 : kind === 'tower' ? bw * 0.7 : 0;
    return { x, bw, top, roof, kind };
  });
  const traceAll = () => {
    ctx.beginPath();
    shapes.forEach(({ x, bw, top, roof, kind }) => {
      ctx.moveTo(x, ground + 30);
      ctx.lineTo(x, top);
      if (kind === 'keep') {
        // Crenellations.
        for (let c = 0; c < 4; c++) {
          const cx = x + (c * bw) / 4;
          ctx.lineTo(cx, top - 10);
          ctx.lineTo(cx + bw / 8, top - 10);
          ctx.lineTo(cx + bw / 8, top);
          ctx.lineTo(cx + bw / 4, top);
        }
      } else {
        ctx.lineTo(x + bw / 2, top - roof);
      }
      ctx.lineTo(x + bw, top);
      ctx.lineTo(x + bw, ground + 30);
      ctx.closePath();
    });
    // The snowy ground the castle stands on.
    ctx.rect(0, ground - 6, width, height - ground + 6);
  };

  paperEdge(ctx, traceAll);
  ctx.save();
  traceAll();
  ctx.clip();

  // Dark timber and stone, lit coldly from the left.
  shapes.forEach(({ x, bw, top, roof }) => {
    const stone = ctx.createLinearGradient(x, 0, x + bw, 0);
    stone.addColorStop(0, '#5a5550');
    stone.addColorStop(0.35, '#3d3a37');
    stone.addColorStop(1, '#24221f');
    ctx.fillStyle = stone;
    ctx.fillRect(x, top - roof - 12, bw, ground - top + roof + 40);
    // Timber courses and hatching.
    ctx.strokeStyle = '#1612104d';
    ctx.lineWidth = 1;
    for (let y = top + 8; y < ground; y += 9) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + bw, y);
      ctx.stroke();
    }
    // Snow on every roof.
    ctx.fillStyle = '#f7fbff';
    ctx.beginPath();
    ctx.moveTo(x - 4, top + 3);
    ctx.lineTo(x + bw / 2, top - roof - 4);
    ctx.lineTo(x + bw + 4, top + 3);
    ctx.lineTo(x + bw, top + 8);
    ctx.lineTo(x + bw / 2, top - roof + 6);
    ctx.lineTo(x, top + 8);
    ctx.closePath();
    ctx.fill();
    // Warm firelit windows.
    const rows = Math.max(1, Math.floor((ground - top) / 46));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < Math.max(1, Math.floor(bw / 34)); c++) {
        if (random() < 0.45) continue;
        const wx = x + 10 + c * 34;
        const wy = top + 22 + r * 46;
        ctx.fillStyle = '#ffb347';
        ctx.shadowColor = '#ffae42';
        ctx.shadowBlur = 10;
        ctx.fillRect(wx, wy, 6, 10);
        ctx.shadowBlur = 0;
      }
    }
  });

  // Snow ground with soft blue shadows.
  const snow = ctx.createLinearGradient(0, ground - 6, 0, height);
  snow.addColorStop(0, '#f6f9fc');
  snow.addColorStop(1, '#cddbe6');
  ctx.fillStyle = snow;
  ctx.fillRect(0, ground - 6, width, height);
  ctx.restore();

  ctx.save();
  traceAll();
  ctx.strokeStyle = '#1d1a1799';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  cutLine(ctx, traceAll);
  return canvas;
}
