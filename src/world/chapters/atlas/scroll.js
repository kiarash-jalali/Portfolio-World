import { gsap } from 'gsap';

/**
 * How the map is posed, from lying flat on the desk to a tabletop seen at an
 * angle with the North brought forward. `tilt` is in degrees, `y` and `x` in
 * percent of the sheet.
 */
const FLAT = { rotationX: 0, scale: 0.84, yPercent: 0, xPercent: 0 };
const TABLETOP = {
  desktop: { rotationX: 54, scale: 0.8, yPercent: 30, xPercent: 0 },
  mobile: { rotationX: 50, scale: 0.78, yPercent: 6, xPercent: 6 },
};

/**
 * When each pop-up piece rises, as [start, duration] on a timeline that runs
 * from 0 to 1 over the whole passage. Back to front.
 */
const RISE = {
  peaks: [0.26, 0.2],
  wall: [0.36, 0.2],
  castle: [0.47, 0.17],
  snow: [0.57, 0.2],
};
/** Cards stand straight up from the map. */
const STANDING = -90;

/**
 * The atlas assembles like a pop-up book while the sticky stage is pinned:
 * the map tilts back into a tabletop, then each piece unfolds from its crease
 * and its shadow spreads out behind it; snow and winter dusk come last.
 * Scrubbing ties every step to the scroll position, so scrolling back up
 * folds the book flat again.
 */
export function atlasScroll({ mobile }) {
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '#atlas',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .fromTo('.atlas-sheet', FLAT, { ...TABLETOP[mobile ? 'mobile' : 'desktop'], duration: 0.3, ease: 'power1.inOut' }, 0.04)
    .fromTo('.atlas-title', { y: 0 }, { y: -30, duration: 0.4 }, 0.05);

  for (const [name, [start, duration]] of Object.entries(RISE)) {
    const fold = `.fold-${name}`;
    timeline
      .fromTo(`${fold} .fold-crease`, { opacity: 0 }, { opacity: 1, duration: duration * 0.3 }, start - 0.03)
      // The card lifts off the page quickly, then slows as it straightens, like paper springing up.
      .fromTo(
        `${fold} .fold-card`,
        { rotationX: 0, opacity: 0 },
        { rotationX: STANDING, opacity: 1, duration, ease: 'power2.out' },
        start,
      )
      .fromTo(
        `${fold} .fold-shadow`,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.55, duration, ease: 'power2.out' },
        start,
      );
  }

  timeline
    .fromTo('.atlas-shade', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.72)
    .fromTo('.atlas-snow', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.76)
    // Hold the finished diorama for the last stretch of the passage.
    .to({}, { duration: 0.08 }, 0.92);
}
