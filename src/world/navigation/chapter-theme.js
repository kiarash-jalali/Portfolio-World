import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The navigation keeps its place and shape everywhere. Only its material changes
 * with the chapter, matching each section's `data-theme`.
 */
export const NAV_THEMES = {
  pond: { bg: 'rgba(12,43,41,0.94)', fg: '#eee6cd', line: 'rgba(223,216,182,0.23)' },
  shire: { bg: 'rgba(28,48,38,0.94)', fg: '#eee6cd', line: 'rgba(223,216,182,0.23)' },
  city: { bg: 'rgba(222,225,207,0.95)', fg: '#2d453e', line: 'rgba(46,69,54,0.24)' },
  tree: { bg: 'rgba(17,32,43,0.94)', fg: '#e8d5ab', line: 'rgba(223,195,142,0.25)' },
  glass: { bg: 'rgba(18,27,24,0.95)', fg: '#e8d5ab', line: 'rgba(223,195,142,0.25)' },
  atlas: { bg: 'rgba(24,30,37,0.94)', fg: '#dfe7ec', line: 'rgba(205,220,230,0.22)' }, // frost and iron
  archive: { bg: 'rgba(32,25,18,0.94)', fg: '#ecdcb6', line: 'rgba(225,200,150,0.24)' },
  workshop: { bg: 'rgba(38,27,19,0.94)', fg: '#eadbb8', line: 'rgba(225,200,150,0.24)' },
  dusk: { bg: 'rgba(13,30,40,0.94)', fg: '#e8e3cf', line: 'rgba(223,216,182,0.22)' },
};

/** How long the colors take to blend into the next chapter's. */
const BLEND_SECONDS = 0.7;
/** A chapter becomes current when its top passes this line below the navigation. */
const ACTIVATION_LINE = '100px';

/** Sections without their own navigation entry highlight their parent chapter. */
const NAV_TARGET = { 'collected-work': 'projects', atlas: 'ai' };

export function initChapterTheme(motion) {
  const sections = [...document.querySelectorAll('[data-theme]')];
  const links = document.querySelectorAll('.navigation nav a');
  let currentTheme;

  function activate(section) {
    const key = section.dataset.theme;
    if (key !== currentTheme) {
      currentTheme = key;
      const theme = NAV_THEMES[key];
      gsap.to(document.documentElement, {
        '--nav-bg': theme.bg,
        '--nav-fg': theme.fg,
        '--nav-line': theme.line,
        duration: motion.paused ? 0 : BLEND_SECONDS,
        overwrite: true,
      });
    }

    const id = NAV_TARGET[section.id] ?? section.id;
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  sections.forEach((section) =>
    ScrollTrigger.create({
      trigger: section,
      start: `top ${ACTIVATION_LINE}`,
      end: `bottom ${ACTIVATION_LINE}`,
      onEnter: () => activate(section),
      onEnterBack: () => activate(section),
    }),
  );

  activate(sections[0]);
}
