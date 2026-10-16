import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SMALL_SCREEN = '(max-width:600px)';

/**
 * Runs the scroll-linked motion of every chapter inside one GSAP context.
 * Each chapter passes a function that builds its timelines; they are rebuilt from
 * scratch when reduced motion or the screen size changes, and skipped entirely
 * while motion is paused.
 */
export function initScrollMotion(motion, chapters) {
  const smallScreen = matchMedia(SMALL_SCREEN);
  let context;

  function build() {
    context?.revert();
    context = gsap.context(() => {
      if (motion.paused) return;
      const mobile = smallScreen.matches;
      chapters.forEach((buildChapter) => buildChapter({ mobile }));
    });
    ScrollTrigger.refresh();
  }

  build();
  motion.onChange(build);
  smallScreen.addEventListener('change', build);

  // Late fonts and images change section heights, so measure again once they arrive.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  return () => context?.revert();
}
