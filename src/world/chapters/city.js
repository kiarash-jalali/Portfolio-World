import { gsap } from 'gsap';

/** Minas Tirith drifts slightly slower than the page, for depth. Desktop only. */
export function cityScroll({ mobile }) {
  if (mobile) return;
  gsap.fromTo(
    '.city-art img',
    { y: -15 },
    {
      y: 25,
      ease: 'none',
      scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}
