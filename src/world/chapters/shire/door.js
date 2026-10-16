import { gsap } from 'gsap';
import { createSprite } from '../../pixel/sprite.js';
import { HOBBIT_FRAMES, HOBBIT_PALETTE } from '../../pixel/hobbit-frames.js';

/**
 * Where the green round door sits in the Shire painting: its center and size as
 * fractions of the image. The door overlay is pinned there however the painting
 * is cropped.
 */
const DOOR_IN_PAINTING = { x: 0.471, y: 0.527, width: 0.074, height: 0.133 };
/** Where the door should land when the painting is cropped (fractions of the scene). */
const DOOR_IN_SCENE = { x: 0.5, y: 0.56 };
/** The top of the chimney, where the smoke starts. */
const CHIMNEY_IN_PAINTING = { x: 0.433, y: 0.262 };
/** The hobbit is this many door-heights tall. */
const RESIDENT_HEIGHT = 0.78;
/** With reduced motion the door simply shows the resident for this long. */
const STILL_VISIT_MS = 2200;
/** Pixel art is animated on a stepped cadence. */
const WAVE_STEP = 0.18;

/**
 * The hobbit door, the page's only environmental interaction. Clicking it swings
 * the painted door open on a warm, lamplit hall; a small pixel-art hobbit steps
 * into the doorway, waves, steps back, and the door closes. About 3.5 seconds.
 */
export function initDoor(motion) {
  const stage = document.querySelector('.shire-stage');
  const scene = stage.querySelector('.shire-scene');
  const painting = scene.querySelector('.shire-painting');
  const door = stage.querySelector('.round-door');
  const button = door.querySelector('#hobbitDoor');
  const leaf = door.querySelector('.door-leaf');
  const resident = door.querySelector('.door-resident');
  const status = door.querySelector('#doorStatus');
  const hobbit = createSprite(HOBBIT_FRAMES, HOBBIT_PALETTE, 'resident-sprite');
  resident.append(hobbit.canvas);
  hobbit.show('stand');

  let busy = false;
  let timeline;

  /**
   * Crops the painting so the door sits where we want it, then pins the door
   * overlay and the leaf's own crop of the painting exactly over the painted door.
   */
  function placeDoor() {
    // The scene starts at the top-left of the stage, which the door is positioned in.
    const box = scene.getBoundingClientRect();
    if (!painting.naturalWidth || !box.width) return;

    // object-fit: cover, with an object-position that brings the door to DOOR_ON_STAGE.
    const scale = Math.max(box.width / painting.naturalWidth, box.height / painting.naturalHeight);
    const drawnWidth = painting.naturalWidth * scale;
    const drawnHeight = painting.naturalHeight * scale;
    const focus = (wanted, door, drawn, shown) =>
      drawn === shown ? 0.5 : Math.min(Math.max((wanted * shown - door * drawn) / (shown - drawn), 0), 1);
    const fx = focus(DOOR_IN_SCENE.x, DOOR_IN_PAINTING.x, drawnWidth, box.width);
    const fy = focus(DOOR_IN_SCENE.y, DOOR_IN_PAINTING.y, drawnHeight, box.height);
    painting.style.objectPosition = `${fx * 100}% ${fy * 100}%`;

    const left = (box.width - drawnWidth) * fx;
    const top = (box.height - drawnHeight) * fy;
    const width = drawnWidth * DOOR_IN_PAINTING.width;
    const height = drawnHeight * DOOR_IN_PAINTING.height;
    const doorLeft = left + drawnWidth * DOOR_IN_PAINTING.x - width / 2;
    const doorTop = top + drawnHeight * DOOR_IN_PAINTING.y - height / 2;

    Object.assign(door.style, {
      left: `${doorLeft}px`,
      top: `${doorTop}px`,
      width: `${width}px`,
      height: `${height}px`,
    });
    // The leaf shows the same patch of painting that it covers.
    Object.assign(leaf.style, {
      backgroundImage: `url("${painting.currentSrc || painting.src}")`,
      backgroundSize: `${drawnWidth}px ${drawnHeight}px`,
      backgroundPosition: `${left - doorLeft}px ${top - doorTop}px`,
    });

    scene.style.setProperty('--chimney-x', `${left + drawnWidth * CHIMNEY_IN_PAINTING.x}px`);
    scene.style.setProperty('--chimney-y', `${top + drawnHeight * CHIMNEY_IN_PAINTING.y}px`);

    // The hobbit is drawn at a whole-number pixel scale so the art stays crisp.
    const pixel = Math.max(1, Math.round((height * RESIDENT_HEIGHT) / hobbit.height));
    hobbit.canvas.style.width = `${hobbit.width * pixel}px`;
    hobbit.canvas.style.height = `${hobbit.height * pixel}px`;
  }

  painting.addEventListener('load', placeDoor);
  new ResizeObserver(placeDoor).observe(scene);
  placeDoor();

  function reset() {
    timeline?.kill();
    gsap.set(leaf, { rotateY: 0 });
    gsap.set(resident, { opacity: 0, y: '18%', scale: 0.9, filter: 'brightness(0.35)' });
    hobbit.show('stand');
    door.classList.remove('open');
    button.disabled = false;
    busy = false;
  }
  reset();

  button.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    button.disabled = true;
    door.classList.add('open');
    status.textContent = 'The round door opens. A friendly hobbit steps out and waves hello.';

    if (motion.paused) {
      gsap.set(leaf, { rotateY: -82 });
      gsap.set(resident, { opacity: 1, y: 0, scale: 1, filter: 'brightness(1)' });
      hobbit.show('waveUp');
      setTimeout(reset, STILL_VISIT_MS);
      return;
    }

    timeline = gsap.timeline({
      onComplete: () => {
        reset();
        status.textContent = 'The hobbit has gone back inside.';
      },
    });
    // The door swings inward on its left hinge.
    timeline.to(leaf, { rotateY: -82, duration: 0.65, ease: 'power2.inOut' });
    // Out of the dark hall and into the evening light, in held steps.
    timeline.to(
      resident,
      { opacity: 1, y: 0, scale: 1, filter: 'brightness(1)', duration: 0.5, ease: 'steps(4)' },
      0.45,
    );
    for (let n = 0; n < 8; n++) {
      timeline.call(() => hobbit.show(n % 2 ? 'waveOut' : 'waveUp'), [], 1.0 + n * WAVE_STEP);
    }
    timeline.call(() => hobbit.show('stand'), [], 1.0 + 8 * WAVE_STEP);
    timeline.to(
      resident,
      { opacity: 0, y: '18%', scale: 0.9, filter: 'brightness(0.35)', duration: 0.45, ease: 'steps(4)' },
      2.65,
    );
    timeline.to(leaf, { rotateY: 0, duration: 0.6, ease: 'power2.inOut' }, 2.95);
  });

  motion.onChange(reset);
  stage.closest('section').addEventListener('scenevisibility', (event) => {
    if (!event.detail) reset();
  });
}
