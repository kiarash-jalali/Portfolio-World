import { gsap } from 'gsap';

/**
 * Where the round door sits in the Shire painting, as fractions of the image.
 * The clickable door is pinned there however the painting is cropped.
 */
const DOOR_IN_PAINTING = { x: 0.47, y: 0.527, width: 0.08, height: 0.153 };
/** The painting is cropped like `object-position: 47% center`. */
const FOCUS = { x: 0.47, y: 0.5 };
/** With reduced motion the door simply shows the resident for this long. */
const STILL_VISIT_MS = 2200;

/**
 * The hobbit door, the page's only environmental interaction. Clicking it opens
 * the door, a small resident waves and goes back inside, and the door closes.
 */
export function initDoor(motion) {
  const section = document.querySelector('#about');
  const button = document.querySelector('#hobbitDoor');
  const hobbit = document.querySelector('.hobbit');
  const status = document.querySelector('#doorStatus');
  const painting = section.querySelector('.scene-art img');
  const surround = button.parentElement;
  let busy = false;
  let timeline;

  // Position against the whole section, not the content column.
  section.append(surround);

  function placeDoor() {
    const scene = section.getBoundingClientRect();
    const box = painting.getBoundingClientRect();
    if (!painting.naturalWidth || !box.width) return;

    // The size the painting is drawn at with object-fit: cover.
    const scale = Math.max(box.width / painting.naturalWidth, box.height / painting.naturalHeight);
    const drawnWidth = painting.naturalWidth * scale;
    const drawnHeight = painting.naturalHeight * scale;
    const left = box.left - scene.left + (box.width - drawnWidth) * FOCUS.x;
    const top = box.top - scene.top + (box.height - drawnHeight) * FOCUS.y;

    surround.style.left = `${left + drawnWidth * DOOR_IN_PAINTING.x}px`;
    surround.style.top = `${top + drawnHeight * DOOR_IN_PAINTING.y}px`;
    surround.style.width = `${drawnWidth * DOOR_IN_PAINTING.width}px`;
    surround.style.height = `${drawnHeight * DOOR_IN_PAINTING.height}px`;
  }

  painting.addEventListener('load', placeDoor);
  new ResizeObserver(placeDoor).observe(section);
  placeDoor();

  function reset() {
    timeline?.kill();
    gsap.set(button, { rotateY: 0 });
    gsap.set(hobbit, { opacity: 0, y: 12, rotation: 0 });
    hobbit.classList.remove('waving');
    button.disabled = false;
    busy = false;
  }

  button.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    button.disabled = true;
    status.textContent = 'A friendly little resident opens the door and waves hello.';

    if (motion.paused) {
      gsap.set(button, { rotateY: -72 });
      gsap.set(hobbit, { opacity: 1, y: 0 });
      setTimeout(reset, STILL_VISIT_MS);
      return;
    }

    timeline = gsap
      .timeline({
        onComplete: () => {
          reset();
          status.textContent = 'The resident has gone back inside.';
        },
      })
      .to(button, { rotateY: -78, duration: 0.6, ease: 'power2.inOut' })
      .to(hobbit, { opacity: 1, y: 0, duration: 0.45 }, 0.4)
      .call(() => hobbit.classList.add('waving'), [], 0.85)
      .to(hobbit, { rotation: 3, duration: 0.22, repeat: 4, yoyo: true, ease: 'sine.inOut' }, 0.95)
      .call(() => hobbit.classList.remove('waving'), [], 2.3)
      .to(hobbit, { opacity: 0, y: 13, duration: 0.4 }, 2.45)
      .to(button, { rotateY: 0, duration: 0.55, ease: 'power2.inOut' }, 2.85);
  });

  motion.onChange(reset);
  section.addEventListener('scenevisibility', (event) => {
    if (!event.detail) reset();
  });
}
