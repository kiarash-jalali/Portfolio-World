/**
 * Hand-made pixel art. A frame is written as rows of characters, one character
 * per pixel, and a palette maps characters to colours ("." is transparent).
 * Frames are drawn at their native size into a canvas that CSS scales up with
 * `image-rendering: pixelated`, so every pixel stays a crisp square.
 */

/** Checks that every row of every frame has the same width; a typo shows up at once. */
export function frameSize(frames) {
  const first = Object.values(frames)[0];
  const width = first[0].length;
  const height = first.length;
  for (const [name, rows] of Object.entries(frames)) {
    if (rows.length !== height) throw Error(`Pixel frame "${name}" is ${rows.length} rows, expected ${height}`);
    rows.forEach((row, y) => {
      if (row.length !== width) throw Error(`Pixel frame "${name}" row ${y} is ${row.length} wide, expected ${width}`);
    });
  }
  return { width, height };
}

/** Draws one frame into `ctx` at (x, y), optionally mirrored to face left. */
export function drawFrame(ctx, rows, palette, { x = 0, y = 0, flip = false } = {}) {
  const width = rows[0].length;
  rows.forEach((row, py) => {
    for (let px = 0; px < width; px++) {
      const colour = palette[row[px]];
      if (!colour) continue;
      ctx.fillStyle = colour;
      ctx.fillRect(x + (flip ? width - 1 - px : px), y + py, 1, 1);
    }
  });
}

/**
 * A sprite: a canvas showing one frame at a time.
 * `frames` is an object of named frames, all the same size.
 */
export function createSprite(frames, palette, className) {
  const { width, height } = frameSize(frames);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.className = className;
  const ctx = canvas.getContext('2d');
  let current = null;
  let facingLeft = false;

  return {
    canvas,
    width,
    height,
    /** Shows frame `name`; facing left mirrors it. Redraws only when something changed. */
    show(name, left = facingLeft) {
      if (!ctx || (name === current && left === facingLeft)) return;
      current = name;
      facingLeft = left;
      ctx.clearRect(0, 0, width, height);
      drawFrame(ctx, frames[name], palette, { flip: left });
    },
    get frame() {
      return current;
    },
  };
}
