/**
 * Shared motion state. There is no visible motion toggle: the page follows the
 * visitor's `prefers-reduced-motion` setting and tells every module when it changes.
 */
export function createMotionState() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new Set();
  let paused = reducedMotion.matches;

  function sync() {
    document.documentElement.classList.toggle('motion-paused', paused);
    listeners.forEach((listener) => listener(paused));
  }

  reducedMotion.addEventListener('change', (event) => {
    paused = event.matches;
    sync();
  });

  // CSS uses this class to stop ambient loops while the tab is in the background.
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
  });

  sync();

  return {
    get paused() {
      return paused;
    },
    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
