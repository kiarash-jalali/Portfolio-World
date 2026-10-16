import { gsap } from 'gsap';

/** The pond caption lifts and fades as the hero scrolls away. */
export function pondCaptionScroll() {
  gsap.to('.pond-caption', {
    y: -25,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: '70% top', end: 'bottom top', scrub: true },
  });
}
