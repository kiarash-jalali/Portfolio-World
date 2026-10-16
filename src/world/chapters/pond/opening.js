import { gsap } from 'gsap';
import { lockScroll } from '../../core/scroll-lock.js';
import { paintPaper } from './paper.js';

/** Thirteen letters, each on its own piece of parchment. The space is a gap, not a paper. */
export const LETTERS = 'KIARASHJALALI';
const FIRST_NAME_LENGTH = 7;

/**
 * Where each piece comes to rest, as fractions of the hero. Authored one by one
 * so the papers look scattered rather than gridded, in the open water between
 * the text and the lotus cluster (see `.floating-botanics` in pond.css).
 */
const BERTHS = [
  [0.52, 0.36], [0.6, 0.3], [0.71, 0.35], [0.79, 0.27], [0.88, 0.34],
  [0.56, 0.48], [0.67, 0.44],
  [0.76, 0.5], [0.86, 0.46], [0.47, 0.58], [0.58, 0.6], [0.5, 0.71], [0.43, 0.82],
];
/** On portrait screens the papers gather in the lower pond, below the text. */
const MOBILE_BERTHS = [
  [0.09, 0.7], [0.22, 0.675], [0.36, 0.705], [0.48, 0.675], [0.15, 0.77],
  [0.3, 0.785], [0.44, 0.765],
  [0.56, 0.8], [0.7, 0.79], [0.85, 0.8], [0.76, 0.88], [0.9, 0.925], [0.08, 0.835],
];

const MOBILE_WIDTH = 701;
/** Papers are drawn smaller on portrait screens; keep in step with `--paper-scale` in pond.css. */
const MOBILE_PAPER_SCALE = 0.62;
/** Arriving here by scrolling or a deep link skips the intro. */
const TOP_OF_PAGE = 80;
/** Unlocks the page even if the timeline breaks, a little after it should have ended. */
const WATCHDOG_MS = 4800;

/** The sun is high and to the upper left, so shadows fall down and to the right. */
const LIGHT = { x: 0.55, y: 0.85 };
/** Shadow distance in pixels while a paper is held up in the air, and once it floats. */
const SHADOW_IN_AIR = 34;
const SHADOW_AFLOAT = 4;

/** Every fourth paper is waterlogged: it partly sinks below the surface. */
const isWaterlogged = (i) => i % 4 === 0;
const tilt = (i) => (i % 2 ? 1 : -1);
/** A fixed pseudo-random number in [0, 1) for paper `i`, so poses are authored, not rolled. */
const fixedRandom = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** How a paper floats once it has settled: almost flat on the water, seen from above. */
function restingPose(i) {
  return {
    rotation: tilt(i) * (8 + fixedRandom(i, 1) * 58),
    rotateX: 4 + fixedRandom(i, 2) * 12,
    scale: isWaterlogged(i) ? 0.92 : 1,
    opacity: 1,
  };
}

/**
 * The shadow is drawn inside the rotated paper, so turn the world-space light
 * direction into the paper's own frame.
 */
function shadowOffset(distance, rotation) {
  const a = (-rotation * Math.PI) / 180;
  const x = LIGHT.x * distance;
  const y = LIGHT.y * distance;
  return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) };
}

/**
 * The opening: the name stands on parchment pieces above the water, which come
 * apart, fall, touch the surface, wobble, soak and float. The papers then stay
 * in the pond. Scroll is locked only while it plays; Skip, Escape, any in-page
 * link, hiding the tab and the watchdog all end it immediately.
 */
export function initOpening(motion, pond = { impact() {} }) {
  const hero = document.querySelector('#home');
  const stage = document.querySelector('#parchmentStage');
  const skip = document.querySelector('#skipIntro');
  let timeline;
  let watchdog;
  let running = false;
  let papers = [];

  const isMobile = () => hero.clientWidth < MOBILE_WIDTH;
  const paperScale = () => (isMobile() ? MOBILE_PAPER_SCALE : 1);

  function berth(i) {
    const [x, y] = (isMobile() ? MOBILE_BERTHS : BERTHS)[i];
    return { x: x * hero.clientWidth, y: y * hero.clientHeight };
  }

  function createPapers() {
    stage.replaceChildren();
    papers = [...LETTERS].map((char, i) => {
      const piece = paintPaper(i);
      const element = document.createElement('span');
      element.className = 'parchment-letter';
      element.dataset.letter = char;
      element.style.setProperty('--paper-w', `${piece.width}px`);
      element.style.setProperty('--paper-h', `${piece.height}px`);
      if (piece.dry) {
        element.classList.add('painted');
        // Data URLs are absolute, so they're safe inside custom properties.
        element.style.setProperty('--paper-dry', `url("${piece.dry}")`);
        element.style.setProperty('--paper-wet', `url("${piece.wet}")`);
      }
      // Each paper gets its own slow drift, so they never bob in unison.
      element.style.setProperty('--drift', `${-tilt(i) * (8 + (i % 4) * 3)}px`);
      element.style.setProperty('--float-time', `${13 + (i % 5) * 3}s`);
      element.style.setProperty('--float-delay', `${-i * 1.3}s`);
      element.style.setProperty('--sink-angle', `${Math.round(fixedRandom(i, 3) * 360)}deg`);

      const paper = document.createElement('span');
      paper.className = 'paper';
      const shadow = document.createElement('span');
      shadow.className = 'paper-shadow';
      const face = document.createElement('span');
      face.className = 'paper-face';
      const ink = document.createElement('span');
      ink.className = 'paper-ink';
      ink.textContent = char;
      ink.style.transform = `translate(${piece.inkX}px, ${piece.inkY}px) rotate(${piece.inkTilt}deg)`;

      face.append(ink);
      paper.append(shadow, face);
      element.append(paper);
      stage.append(element);
      return { element, shadow, piece, i };
    });
  }

  function settle() {
    papers.forEach(({ element, shadow, i }) => {
      const { x, y } = berth(i);
      const pose = restingPose(i);
      gsap.set(element, { x, y, xPercent: -50, yPercent: -50, ...pose });
      gsap.set(shadow, { ...shadowOffset(SHADOW_AFLOAT * paperScale(), pose.rotation), opacity: 0.5 });
      element.classList.add('afloat', 'wet');
      element.classList.toggle('waterlogged', isWaterlogged(i));
    });
    hero.classList.add('papers-landed');
  }

  function finish() {
    clearTimeout(watchdog);
    timeline?.kill();
    running = false;
    lockScroll('intro', false);
    hero.classList.remove('intro-running');
    skip.hidden = true;
    settle();
  }

  /**
   * Where each paper stands in the opening line: the name on one line, or on
   * portrait screens one word per line. Returns centers in pixels.
   */
  function lineSlots(width, height) {
    const scale = paperScale();
    const gap = 5 * scale;
    const words = isMobile()
      ? [papers.slice(0, FIRST_NAME_LENGTH), papers.slice(FIRST_NAME_LENGTH)]
      : [papers];
    const rowHeight = 78 * scale * 1.25;
    const top = isMobile() ? Math.min(250, height * 0.24) : height * 0.31;
    const wordGap = isMobile() ? 0 : 34;
    const slots = [];

    words.forEach((row, r) => {
      const rowWidth =
        row.reduce((sum, { piece }) => sum + piece.width * scale + gap, -gap) +
        (isMobile() ? 0 : wordGap);
      let x = (width - rowWidth) / 2;
      row.forEach(({ piece, i }) => {
        if (!isMobile() && i === FIRST_NAME_LENGTH) x += wordGap;
        const w = piece.width * scale;
        slots[i] = { x: x + w / 2, y: top + r * rowHeight };
        x += w + gap;
      });
    });
    return slots;
  }

  function play() {
    if (running) return;
    createPapers();

    const deepLink = location.hash && location.hash !== '#home';
    if (motion.paused || scrollY > TOP_OF_PAGE || deepLink) {
      finish();
      return;
    }

    running = true;
    hero.classList.remove('papers-landed');
    hero.classList.add('intro-running');
    lockScroll('intro', true);
    skip.hidden = false;
    // Independent of the timeline, so it survives animation errors and image failures.
    watchdog = setTimeout(finish, WATCHDOG_MS);

    const width = hero.clientWidth;
    const height = hero.clientHeight;
    const scale = paperScale();
    const slots = lineSlots(width, height);

    timeline = gsap.timeline({ onComplete: finish });
    papers.forEach(({ element, shadow, i }) => {
      const target = berth(i);
      const pose = restingPose(i);
      const slot = slots[i];
      // Pieces come apart from the middle of each word outward, a little unevenly.
      const fallAt = 1.05 + i * 0.045 + fixedRandom(i, 4) * 0.12;
      const landAt = 2.4 + i * 0.045 + fixedRandom(i, 4) * 0.12;

      // Held up toward the viewer: larger, with the shadow far away on the water.
      gsap.set(element, {
        x: slot.x,
        y: slot.y,
        xPercent: -50,
        yPercent: -50,
        rotation: (fixedRandom(i, 5) - 0.5) * 6,
        rotateX: 0,
        scale: 1.22,
        opacity: 0,
      });
      gsap.set(shadow, { ...shadowOffset(SHADOW_IN_AIR * scale, 0), opacity: 0.16 });

      timeline
        .to(element, { opacity: 1, duration: 0.35 }, 0.12 + i * 0.022)
        // Fall toward the water, turning and drifting on the air.
        .to(
          element,
          {
            x: target.x + tilt(i) * 16,
            y: target.y - 18,
            rotation: pose.rotation * 1.35,
            rotateX: 28,
            scale: 1.04,
            duration: 1.35,
            ease: 'power2.in',
          },
          fallAt,
        )
        // The shadow closes in on the paper as it nears the surface.
        .to(
          shadow,
          {
            ...shadowOffset(SHADOW_AFLOAT * 2 * scale, pose.rotation),
            opacity: 0.4,
            duration: 1.35,
            ease: 'power2.in',
          },
          fallAt,
        )
        .call(
          () => {
            pond.impact(target.x / width, target.y / height);
            element.classList.add('landed', 'wet');
            element.classList.toggle('waterlogged', isWaterlogged(i));
          },
          [],
          landAt,
        )
        // Touch the water, slide a little, and wobble flat as it settles.
        .to(
          element,
          { x: target.x, y: target.y, rotation: pose.rotation, scale: pose.scale, duration: 0.95, ease: 'sine.out' },
          landAt,
        )
        .to(element, { rotateX: pose.rotateX, duration: 1.1, ease: 'elastic.out(1, 0.35)' }, landAt)
        .to(
          shadow,
          { ...shadowOffset(SHADOW_AFLOAT * scale, pose.rotation), opacity: 0.5, duration: 0.6 },
          landAt,
        );
    });
    timeline.to({}, { duration: 0.35 });
  }

  skip.addEventListener('click', finish);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && running) finish();
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) =>
    link.addEventListener('click', () => {
      if (running) finish();
    }),
  );

  const finishOrResettle = () => (running ? finish() : settle());
  motion.onChange(finishOrResettle);
  addEventListener('resize', finishOrResettle);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) finish();
  });

  // A new page load at the top always replays, and so does a tab restored from the back/forward cache.
  addEventListener('pageshow', (event) => {
    if (event.persisted && scrollY < TOP_OF_PAGE) play();
  });

  play();
  return {
    finish,
    replay: play,
    get running() {
      return running;
    },
  };
}
