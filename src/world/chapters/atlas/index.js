import { paintWall, paintCastle } from './paper-wall.js';
import { initSnowfall } from './snowfall.js';

export { atlasScroll } from './scroll.js';

/** The cards are painted a little before the atlas scrolls into view, not at page load. */
const PAINT_AHEAD = '1500px 0px';

/** Paints the Wall and Castle Black cards when needed, and sets up the snow. */
export function initAtlas(motion) {
  const section = document.querySelector('#atlas');
  const painters = { wall: paintWall, castle: paintCastle };

  const painter = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      painter.disconnect();
      section.querySelectorAll('[data-paper]').forEach((canvas) => painters[canvas.dataset.paper]?.(canvas));
    },
    { rootMargin: PAINT_AHEAD },
  );
  painter.observe(section);
  initSnowfall(motion);
}
