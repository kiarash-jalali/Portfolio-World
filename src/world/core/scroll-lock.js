/**
 * Several things can lock page scrolling at once (the intro, the mobile menu,
 * the project dialog). Scrolling only comes back when every lock is released.
 */
const locks = new Set();

export function lockScroll(key, locked) {
  if (locked) locks.add(key);
  else locks.delete(key);
  document.documentElement.style.overflow = locks.size ? 'hidden' : '';
}
