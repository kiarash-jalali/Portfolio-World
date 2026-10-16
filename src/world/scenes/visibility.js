/** Scenes start loading their art this far before they scroll into view. */
const PRELOAD_DISTANCE = '800px 0px';

/**
 * Marks scenes that are on screen with `.scene-active` (CSS pauses ambient loops
 * elsewhere) and announces it with a `scenevisibility` event for scripts.
 */
export function initSceneVisibility() {
  const scenes = [...document.querySelectorAll('[data-scene]')];

  const visibility = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        target.classList.toggle('scene-active', isIntersecting);
        target.dispatchEvent(new CustomEvent('scenevisibility', { detail: isIntersecting }));
      });
    },
    { rootMargin: '0px', threshold: 0 },
  );

  // Lazy images and the stained glass load once, shortly before their scene arrives.
  const preloader = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        if (target.dataset.scene === 'glass') {
          target.style.setProperty(
            '--glass-image',
            `url("${import.meta.env.BASE_URL}art/phase2/glass-triptych.webp")`,
          );
        }
        target.querySelectorAll('img[loading=lazy]').forEach((img) => {
          img.loading = 'eager';
          img.decode?.().catch(() => {});
        });
        preloader.unobserve(target);
      });
    },
    { rootMargin: PRELOAD_DISTANCE },
  );

  scenes.forEach((scene) => {
    visibility.observe(scene);
    preloader.observe(scene);
  });

  return () => {
    visibility.disconnect();
    preloader.disconnect();
  };
}
