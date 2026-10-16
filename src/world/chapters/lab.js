const GRID_COLUMNS = 10;
const GRID_CELLS = 100;
/** Cells within this distance of the selection ripple with it. */
const RIPPLE_RADIUS = 3;
const RIPPLE_STEP_MS = 40;

/** Spring that pulls the inkstone back to the center, and how much speed each frame keeps. */
const SPRING = 0.035;
const DAMPING = 0.82;
/** Below this much total motion the stone is considered at rest. */
const REST = 0.15;
/** The stone's half-size, so it never leaves its stage. */
const STONE_HALF = { x: 53, y: 63 };
/** How far one arrow-key press moves the stone. */
const KEY_NUDGE = 30;

/** The Lab: two small hands-on experiments. */
export function initLab(motion) {
  initSpringGrid(motion);
  initInkstone(motion);
}

/** A 10×10 grid with exactly one selected cell; choosing a cell sends a ripple out from it. */
function initSpringGrid(motion) {
  const grid = document.querySelector('#springGrid');
  const cells = [...grid.children];

  function select(index) {
    cells.forEach((cell, i) => {
      cell.setAttribute('aria-pressed', String(i === index));
      cell.tabIndex = i === index ? 0 : -1;
    });
    if (motion.paused) return;

    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);
    cells.forEach((cell, i) => {
      const distance = Math.hypot(i % GRID_COLUMNS - column, Math.floor(i / GRID_COLUMNS) - row);
      if (distance > RIPPLE_RADIUS || i === index) return;
      cell.animate([{ transform: 'scale(1)' }, { transform: 'scale(.76)' }, { transform: 'scale(1)' }], {
        duration: 500,
        delay: distance * RIPPLE_STEP_MS,
        easing: 'cubic-bezier(.2,.8,.3,1)',
      });
    });
  }

  grid.addEventListener('click', (event) => {
    const index = cells.indexOf(event.target);
    if (index >= 0) select(index);
  });

  const ARROW_STEPS = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -GRID_COLUMNS, ArrowDown: GRID_COLUMNS };
  grid.addEventListener('keydown', (event) => {
    let index = cells.indexOf(event.target);
    const step = ARROW_STEPS[event.key];
    if (index < 0 || step === undefined) return;
    event.preventDefault();
    index = Math.max(0, Math.min(GRID_CELLS - 1, index + step));
    select(index);
    cells[index].focus();
  });
}

/** An elastic inkstone: drag it (or use the arrow keys) and it springs back to the center. */
function initInkstone(motion) {
  const stage = document.querySelector('#inkStage');
  const stone = document.querySelector('#inkstone');
  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  let dragging = false;
  let lastPointer;
  let frame = 0;
  let visible = false;

  const clamp = (value, max) => Math.max(-max, Math.min(max, value));

  function bounds() {
    return {
      x: Math.max(0, stage.clientWidth / 2 - STONE_HALF.x),
      y: Math.max(0, stage.clientHeight / 2 - STONE_HALF.y),
    };
  }

  function keepInside() {
    const limit = bounds();
    x = clamp(x, limit.x);
    y = clamp(y, limit.y);
  }

  /** The stone stretches and leans in the direction it is moving. */
  function draw() {
    const stretch = 1 + Math.min(0.14, Math.abs(vx) * 0.001);
    const squash = 1 - Math.min(0.1, Math.abs(vx) * 0.0007);
    stone.style.transform = `translate(${x}px,${y}px) scale(${stretch},${squash}) rotate(${clamp(vx * 0.03, 12)}deg)`;
  }

  function stop() {
    x = y = vx = vy = 0;
    draw();
  }

  function wake() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function tick() {
    frame = 0;
    if (!visible || document.hidden || dragging) return;
    vx = (-x * SPRING + vx) * DAMPING;
    vy = (-y * SPRING + vy) * DAMPING;
    x += vx;
    y += vy;
    keepInside();
    draw();
    if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) < REST) {
      stop();
      return;
    }
    wake();
  }

  function release() {
    dragging = false;
    stone.style.cursor = 'grab';
    if (motion.paused) stop();
    else wake();
  }

  stone.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    stone.setPointerCapture(event.pointerId);
    stone.style.cursor = 'grabbing';
  });

  stone.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    vx = event.clientX - lastPointer.x;
    vy = event.clientY - lastPointer.y;
    x += vx;
    y += vy;
    keepInside();
    lastPointer = { x: event.clientX, y: event.clientY };
    draw();
  });

  stone.addEventListener('pointerup', release);
  stone.addEventListener('pointercancel', release);
  stone.addEventListener('lostpointercapture', () => {
    if (dragging) release();
  });

  // Arrow keys pull the stone; Space lets it go.
  const KEY_PULLS = {
    ArrowLeft: [-KEY_NUDGE, 0],
    ArrowRight: [KEY_NUDGE, 0],
    ArrowUp: [0, -KEY_NUDGE],
    ArrowDown: [0, KEY_NUDGE],
  };
  stone.addEventListener('keydown', (event) => {
    const pull = KEY_PULLS[event.key];
    if (pull) {
      event.preventDefault();
      x += pull[0];
      y += pull[1];
      keepInside();
      draw();
    }
    if (event.code === 'Space') {
      event.preventDefault();
      release();
    }
  });

  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: 0 },
  ).observe(stage);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) wake();
  });
  motion.onChange(stop);
  new ResizeObserver(() => {
    keepInside();
    draw();
  }).observe(stage);
}
