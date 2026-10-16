/**
 * Two individually authored koi. Each swims a slow closed loop through the open
 * water; `period` is the seconds per lap and `size` the body length in pixels.
 */
export const POND_FISH = [
  { asset: 'koi-coral.webp', phase: 0.4, period: 62, size: 182 },
  { asset: 'koi-gold.webp', phase: 3.1, period: 79, size: 156 },
];

/** Below this width the pond is recomposed for portrait screens. */
const MOBILE_WIDTH = 701;
const MOBILE_SCALE = 0.66;

/** Loop centers and radii as fractions of the pond. */
const DESKTOP_PATH = { x: 0.66, y: 0.57, rx: 0.15, ry: 0.23, wobble: 0.025 };
const MOBILE_PATH = { x: 0.47, y: 0.77, rx: 0.26, ry: 0.095 };

/** Where fish `index` is at `time` seconds, and which way it faces. */
export function fishPosition(time, index, width, height) {
  const fish = POND_FISH[index];
  const a = (time * Math.PI * 2) / fish.period + fish.phase;
  const mobile = width < MOBILE_WIDTH;
  let x, y, dx, dy;

  if (mobile) {
    const path = MOBILE_PATH;
    x = path.x + Math.cos(a) * path.rx;
    y = path.y + Math.sin(a) * path.ry;
    dx = -Math.sin(a) * path.rx;
    dy = Math.cos(a) * path.ry;
  } else {
    // A gentle figure-of-eight wobble keeps the desktop loop from looking mechanical.
    const path = DESKTOP_PATH;
    x = path.x + Math.cos(a) * path.rx + Math.sin(a * 2) * path.wobble;
    y = path.y + Math.sin(a) * path.ry;
    dx = -Math.sin(a) * path.rx + Math.cos(a * 2) * 0.05;
    dy = Math.cos(a) * path.ry;
  }

  return {
    x: x * width,
    y: y * height,
    angle: Math.atan2(dy * height, dx * width),
    width: mobile ? fish.size * MOBILE_SCALE : fish.size,
  };
}

/** The body is drawn as thin vertical strips so it can bend like a spine. */
const STRIPS = 56;
const OPACITY = 0.92;
/** Tail swing as a fraction of body length. */
const TAIL_SWING = 0.055;

/**
 * Draws every koi into `ctx`, a canvas the size of the pond in CSS pixels
 * scaled to device pixels by `scaleX` and `scaleY`.
 */
export function drawKoi(ctx, images, elapsed, width, height, scaleX, scaleY) {
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  ctx.clearRect(0, 0, width, height);

  images.forEach((image, i) => {
    const pos = fishPosition(elapsed, i, width, height);
    const fishWidth = pos.width;
    const fishHeight = (fishWidth * image.height) / image.width;
    const sourceStrip = image.width / STRIPS;
    const drawnStrip = fishWidth / STRIPS;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(pos.angle);
    ctx.globalAlpha = OPACITY;

    // The head leads; the swing grows smoothly toward the tail. Strips overlap to avoid seams.
    for (let n = 0; n < STRIPS; n++) {
      const along = n / (STRIPS - 1);
      const bend =
        Math.sin(elapsed * 2.5 + along * 5.4 + i) * Math.pow(1 - along, 2) * fishWidth * TAIL_SWING;
      ctx.drawImage(
        image,
        n * sourceStrip,
        0,
        Math.min(sourceStrip + 1, image.width - n * sourceStrip),
        image.height,
        -fishWidth / 2 + n * drawnStrip,
        -fishHeight / 2 + bend,
        drawnStrip + 0.65,
        fishHeight,
      );
    }

    ctx.restore();
  });
}
