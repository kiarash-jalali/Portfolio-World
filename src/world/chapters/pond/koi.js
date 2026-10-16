/**
 * Three individually authored koi, each with its own markings, size, pace and
 * loop through the open water, so they never read as copies of one another.
 *
 * - `asset` is the painted fish; `recolor` names a variant painted from it in code.
 * - `size` is the body length in pixels; `period` the seconds per lap.
 * - `path` and `mobilePath` are loop centers and radii as fractions of the pond.
 *   A negative `rx` swims the loop the other way round.
 */
export const POND_FISH = [
  {
    name: 'kohaku',
    asset: 'koi-coral.webp',
    size: 205,
    period: 64,
    phase: 0.4,
    path: { x: 0.61, y: 0.47, rx: 0.12, ry: 0.2, wobble: 0.025 },
    mobilePath: { x: 0.5, y: 0.8, rx: 0.3, ry: 0.08 },
  },
  {
    name: 'yamabuki',
    asset: 'koi-gold.webp',
    size: 182,
    period: 81,
    phase: 2.6,
    path: { x: 0.75, y: 0.36, rx: -0.1, ry: 0.15, wobble: 0.02 },
    mobilePath: { x: 0.56, y: 0.86, rx: -0.26, ry: 0.06 },
  },
  {
    name: 'tancho',
    asset: 'koi-coral.webp',
    recolor: 'tancho',
    size: 138,
    period: 47,
    phase: 4.8,
    path: { x: 0.5, y: 0.63, rx: 0.07, ry: 0.1, wobble: 0.015 },
    mobilePath: { x: 0.42, y: 0.75, rx: 0.2, ry: 0.05 },
  },
];

/** Below this width the pond is recomposed for portrait screens. */
const MOBILE_WIDTH = 701;
const MOBILE_SCALE = 0.62;

/** Where fish `index` is at `time` seconds, and which way it faces. */
export function fishPosition(time, index, width, height) {
  const fish = POND_FISH[index];
  const a = (time * Math.PI * 2) / fish.period + fish.phase;
  const mobile = width < MOBILE_WIDTH;
  const path = mobile ? fish.mobilePath : fish.path;
  // A gentle figure-of-eight wobble keeps the loops from looking mechanical.
  const wobble = path.wobble || 0;

  const x = path.x + Math.cos(a) * path.rx + Math.sin(a * 2) * wobble;
  const y = path.y + Math.sin(a) * path.ry;
  const dx = -Math.sin(a) * path.rx + Math.cos(a * 2) * wobble * 2;
  const dy = Math.cos(a) * path.ry;

  return {
    x: x * width,
    y: y * height,
    angle: Math.atan2(dy * height, dx * width),
    width: mobile ? fish.size * MOBILE_SCALE : fish.size,
  };
}

/* ------------------------------------------------------------------ */
/* Preparing the fish images                                           */
/* ------------------------------------------------------------------ */

/** Tancho: a pure cream koi with a single round coral crown on its head. */
const TANCHO = {
  crown: { x: 0.875, y: 0.49, radius: 0.062 }, // fractions of the image width/height
  cream: [240, 232, 214],
};

/** Repaints the kohaku as a tancho: every red patch except the crown turns cream. */
function paintTancho(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return image;
  ctx.drawImage(image, 0, 0);

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;
  const crownX = TANCHO.crown.x * canvas.width;
  const crownY = TANCHO.crown.y * canvas.height;
  const crownRadius = TANCHO.crown.radius * canvas.width;
  const [creamR, creamG, creamB] = TANCHO.cream;

  for (let p = 0; p < data.length; p += 4) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    // How red this pixel is, from 0 (cream, fin, shadow) to 1 (a full coral patch).
    const redness = Math.min(Math.max((r - Math.max(g, b) - 40) / 110, 0), 1);
    if (!redness) continue;

    const px = (p / 4) % canvas.width;
    const py = Math.floor(p / 4 / canvas.width);
    const fromCrown = Math.hypot(px - crownX, (py - crownY) * 1.15) / crownRadius;
    // Inside the crown keep the red, with a soft painted edge.
    const keep = Math.min(Math.max((1.25 - fromCrown) / 0.25, 0), 1);
    const amount = redness * (1 - keep);
    if (!amount) continue;

    // The red channel still carries the scale pattern; reuse it as the cream's shading.
    const shade = Math.min(Math.max(r / 215, 0.72), 1.06);
    data[p] = r + (creamR * shade - r) * amount;
    data[p + 1] = g + (creamG * shade - g) * amount;
    data[p + 2] = b + (creamB * shade - b) * amount;
  }

  ctx.putImageData(pixels, 0, 0);
  return canvas;
}

/** How far the shadow falls on the pond floor, in body lengths, and how dark it is. */
const SHADOW = { x: 0.08, y: 0.13, opacity: 0.34, blurPasses: 10, blur: 0.012 };

/**
 * A soft dark silhouette of the fish, made once. It's blurred by stamping the
 * silhouette in a small ring rather than with `ctx.filter`, which Safari lacks.
 */
function paintShadow(image) {
  const pad = Math.ceil(image.width * SHADOW.blur * 2);
  const silhouette = document.createElement('canvas');
  silhouette.width = image.width;
  silhouette.height = image.height;
  const solid = silhouette.getContext('2d');
  solid.drawImage(image, 0, 0);
  solid.globalCompositeOperation = 'source-in';
  solid.fillStyle = '#022a2e';
  solid.fillRect(0, 0, silhouette.width, silhouette.height);

  const canvas = document.createElement('canvas');
  canvas.width = image.width + pad * 2;
  canvas.height = image.height + pad * 2;
  const ctx = canvas.getContext('2d');
  const radius = image.width * SHADOW.blur;
  ctx.globalAlpha = 1.6 / SHADOW.blurPasses;
  for (let n = 0; n < SHADOW.blurPasses; n++) {
    const a = (n / SHADOW.blurPasses) * Math.PI * 2;
    ctx.drawImage(silhouette, pad + Math.cos(a) * radius, pad + Math.sin(a) * radius);
  }
  return { canvas, pad };
}

/** Turns the loaded images into everything `drawKoi` needs, one entry per fish. */
export function prepareKoi(images) {
  return POND_FISH.map((fish, i) => {
    const body = fish.recolor === 'tancho' ? paintTancho(images[i]) : images[i];
    return { body, shadow: paintShadow(body) };
  });
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

/** The body is drawn as thin vertical strips so it can bend like a spine. */
const STRIPS = 56;
/** Tail swing as a fraction of body length. */
const TAIL_SWING = 0.06;

/** Draws `image` centered on the origin, bent along the spine by `bend(along)`. */
function drawBent(ctx, image, length, bend, pad = 0) {
  const sourceWidth = image.width - pad * 2;
  const thickness = (length * image.height) / sourceWidth;
  const sourceStrip = sourceWidth / STRIPS;
  const drawnStrip = length / STRIPS;
  const drawnPad = (pad * length) / sourceWidth;

  for (let n = 0; n < STRIPS; n++) {
    const along = n / (STRIPS - 1);
    // Strips overlap slightly so no seams show between them.
    ctx.drawImage(
      image,
      pad + n * sourceStrip,
      0,
      Math.min(sourceStrip + 1, sourceWidth - n * sourceStrip),
      image.height,
      -length / 2 + n * drawnStrip,
      -thickness / 2 + bend(along),
      drawnStrip + 0.65,
      thickness,
    );
  }
  // Shadow canvases carry blur padding at both ends; draw those edges unbent.
  if (pad) {
    ctx.drawImage(image, 0, 0, pad, image.height, -length / 2 - drawnPad, -thickness / 2 + bend(0), drawnPad, thickness);
    ctx.drawImage(image, image.width - pad, 0, pad, image.height, length / 2, -thickness / 2 + bend(1), drawnPad, thickness);
  }
}

/**
 * Draws every koi, shadows first, into `ctx`: a canvas the size of the pond in
 * CSS pixels scaled to device pixels by `scaleX` and `scaleY`.
 */
export function drawKoi(ctx, koi, elapsed, width, height, scaleX, scaleY) {
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const poses = koi.map((_, i) => {
    const pos = fishPosition(elapsed, i, width, height);
    // The head leads; the swing grows smoothly toward the tail. Smaller fish beat faster.
    const beat = 2.2 + (POND_FISH[i].size < 160 ? 1 : 0);
    const bend = (along) =>
      Math.sin(elapsed * beat + along * 5.4 + i) * Math.pow(1 - along, 2) * pos.width * TAIL_SWING;
    return { ...pos, bend };
  });

  // Shadows fall on the floor below and to the right, whichever way the fish faces.
  poses.forEach((pose, i) => {
    const { canvas, pad } = koi[i].shadow;
    ctx.save();
    ctx.translate(pose.x + pose.width * SHADOW.x, pose.y + pose.width * SHADOW.y);
    ctx.rotate(pose.angle);
    ctx.globalAlpha = SHADOW.opacity;
    drawBent(ctx, canvas, pose.width, pose.bend, pad);
    ctx.restore();
  });

  poses.forEach((pose, i) => {
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    drawBent(ctx, koi[i].body, pose.width, pose.bend);
    ctx.restore();
  });
}
