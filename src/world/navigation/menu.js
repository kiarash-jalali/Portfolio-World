import { lockScroll } from '../core/scroll-lock.js';

/** Above this width the full navigation is visible and the disclosure menu is not used. */
const WIDE_LAYOUT = '(min-width:821px)';
/** Scroll distance after which the navigation bar gets its compact style. */
const SCROLLED_AFTER = 30;

/** The mobile disclosure menu. */
export function initMenu() {
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobileNav');

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    lockScroll('menu', open);
  }

  button.addEventListener('click', () => setOpen(menu.hidden));

  // Following a link closes the menu.
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      button.focus();
    }
  });

  // A click anywhere outside the menu closes it.
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

  matchMedia(WIDE_LAYOUT).addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/** The compact navigation style and the thin reading-progress rail. */
export function initScrollProgress() {
  const nav = document.querySelector('#nav');
  const rail = document.querySelector('.reading-progress');
  let scheduled = false;

  function update() {
    scheduled = false;
    nav.classList.toggle('scrolled', scrollY > SCROLLED_AFTER);
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const progress = scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0;
    rail.style.transform = `scaleX(${progress})`;
  }

  addEventListener(
    'scroll',
    () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );

  update();
}
