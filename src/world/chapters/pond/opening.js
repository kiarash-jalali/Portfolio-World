import { gsap } from 'gsap';
import { lockScroll } from '../../core/scroll-lock.js';

/** Thirteen letters, each on its own piece of parchment. The space is a gap, not a paper. */
export const LETTERS = 'KIARASHJALALI';
const FIRST_NAME_LENGTH = 7;

/**
 * Where each piece comes to rest in the open water, as fractions of the hero.
 * Authored one by one so the papers look scattered rather than gridded.
 */
const BERTHS = [
  [0.57, 0.39], [0.68, 0.43], [0.78, 0.37], [0.63, 0.54], [0.83, 0.56],
  [0.72, 0.64], [0.53, 0.68], [0.84, 0.73], [0.6, 0.8], [0.76, 0.83],
  [0.48, 0.49], [0.72, 0.32], [0.88, 0.46],
];

const MOBILE_WIDTH = 701;
/** Arriving here by scrolling or a deep link skips the intro. */
const TOP_OF_PAGE = 80;
/** Unlocks the page even if the timeline breaks, a little after it should have ended. */
const WATCHDOG_MS = 4800;

/** Every fourth paper is waterlogged: smaller, darker and partly sunk. */
const isWaterlogged = (i) => i % 4 === 0;
const tilt = (i) => (i % 2 ? 1 : -1);

/** How a paper floats once it has settled. */
function restingPose(i) {
  return {
    rotation: tilt(i) * (12 + i * 5),
    rotateX: 48 + (i % 3) * 8,
    scale: isWaterlogged(i) ? 0.84 : 1,
    opacity: isWaterlogged(i) ? 0.58 : 0.94,
  };
}

/**
 * The opening: the name stands on parchment pieces above the water, which come
 * apart, fall, touch the surface and float. The papers then stay in the pond.
 * Scroll is locked only while it plays; Skip, Escape, any in-page link, hiding
 * the tab and the watchdog all end it immediately.
 */
export function initOpening(motion, pond = { impact() {} }) {
  const hero = document.querySelector('#home');
  const stage = document.querySelector('#parchmentStage');
  const skip = document.querySelector('#skipIntro');
  let timeline;
  let watchdog;
  let running = false;
  let papers = [];

  function berth(i) {
    const mobile = hero.clientWidth < MOBILE_WIDTH;
    const [x, y] = BERTHS[i];
    // Portrait screens squeeze the same arrangement into the lower pond.
    const fx = mobile ? 0.14 + (x - 0.48) * 1.58 : x;
    const fy = mobile ? 0.68 + (y - 0.32) * 0.39 : y;
    return { x: fx * hero.clientWidth, y: fy * hero.clientHeight };
  }

  function createPapers() {
    stage.replaceChildren();
    papers = [...LETTERS].map((char, i) => {
      const element = document.createElement('span');
      element.className = 'parchment-letter';
      element.dataset.letter = char;
      // Each paper gets its own slow drift, so they never bob in unison.
      element.style.setProperty('--drift', `${-tilt(i) * (8 + (i % 4) * 3)}px`);
      element.style.setProperty('--float-time', `${13 + (i % 5) * 3}s`);
      element.style.setProperty('--float-delay', `${-i * 1.3}s`);

      const face = document.createElement('span');
      face.className = 'paper-face';
      face.textContent = char;
      element.append(face);
      stage.append(element);
      return { element, i };
    });
  }

  function settle() {
    papers.forEach(({ element, i }) => {
      const { x, y } = berth(i);
      gsap.set(element, { x, y, ...restingPose(i) });
      element.classList.add('afloat');
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
    const mobile = width < MOBILE_WIDTH;
    // The name starts as one centered line, with an empty slot between the two words.
    const step = mobile ? 23 : 48;
    const lineStart = (width - step * (LETTERS.length + 1)) / 2;
    const lineY = mobile ? Math.min(280, height * 0.28) : height * 0.31;

    timeline = gsap.timeline({ onComplete: finish });
    papers.forEach(({ element, i }) => {
      const target = berth(i);
      const slot = i + (i >= FIRST_NAME_LENGTH ? 1 : 0);
      const fallAt = 1.05 + i * 0.045;
      const landAt = 2.4 + i * 0.045;

      gsap.set(element, { x: lineStart + slot * step, y: lineY, rotation: 0, rotateX: 0, opacity: 0 });
      timeline
        .to(element, { opacity: 1, duration: 0.35 }, 0.12 + i * 0.022)
        // Fall to just above the berth, tilting away from the viewer.
        .to(
          element,
          {
            x: target.x + (i % 2 ? 18 : -14),
            y: target.y - 24,
            rotation: tilt(i) * (20 + i * 4),
            rotateX: 35,
            duration: 1.35,
            ease: 'power2.in',
          },
          fallAt,
        )
        .call(
          () => {
            pond.impact(target.x / width, target.y / height);
            element.classList.add('landed');
          },
          [],
          landAt,
        )
        // Touch the water and ease into the resting pose.
        .to(element, { x: target.x, y: target.y, ...restingPose(i), duration: 0.85, ease: 'sine.out' }, landAt);
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
