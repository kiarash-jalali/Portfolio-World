import { gsap } from 'gsap';

/**
 * The atlas assembles like a pop-up book while the sticky stage is pinned:
 * mountains fold up, then the Wall, then the snowy foreground. Scrubbing ties
 * every step to scroll position, so scrolling back up folds it flat again.
 * Positions on the timeline are fractions of the passage.
 */
export function atlasScroll({ mobile }) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#atlas',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.45,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      '.paper-mountains',
      { rotateX: mobile ? -75 : -88, y: 35, opacity: 0.4 },
      { rotateX: 0, y: 0, opacity: 1, duration: 0.45, ease: 'sine.out' },
      0,
    )
    .fromTo(
      '.paper-wall',
      { rotateX: -88, opacity: 0.25 },
      { rotateX: 0, opacity: 1, duration: 0.5, ease: 'sine.out' },
      0.2,
    )
    .fromTo(
      '.paper-snow',
      { rotateX: -65, y: 45 },
      { rotateX: 0, y: 0, duration: 0.4, ease: 'sine.out' },
      0.55,
    )
    // The flat map fades back as the paper landscape takes over.
    .fromTo(
      '.atlas-map',
      { scale: 1.06, opacity: 0.8 },
      { scale: 1, opacity: 0.48, duration: 1, ease: 'none' },
      0,
    )
    .fromTo('.atlas-title', { y: 0 }, { y: -35, duration: 0.6, ease: 'none' }, 0.1);
}
