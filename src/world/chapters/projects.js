import { gsap } from 'gsap';

/** The Erdtree's glow brightens as the chapter scrolls to the center. Desktop only. */
export function projectsScroll({ mobile }) {
  if (mobile) return;
  gsap.fromTo(
    '.tree-light',
    { opacity: 0.3 },
    {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom',
        end: 'center center',
        scrub: true,
      },
    },
  );
}
