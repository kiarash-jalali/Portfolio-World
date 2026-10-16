import { createSprite } from '../pixel/sprite.js';
import { GOLLUM_FRAMES, GOLLUM_PALETTE } from '../pixel/gollum-frames.js';
import { stealWord } from './gollum-words.js';

/** Gollum is drawn on a stepped cadence, like hand-animated sprites. */
const FRAME_MS = 125; // 8 frames per second
/** On-screen size of one sprite pixel. */
const PIXEL = { desktop: 4, mobile: 3 };
const MOBILE_WIDTH = 701;
/** Creeping speed in CSS pixels per second. */
const CREEP_SPEED = 46;
/** A habitat counts as visible between the navigation and the bottom of the screen. */
const NAV_HEIGHT = 95;
const VISIBLE_UNTIL = 0.94;
/** Seconds of ordinary life between special events, and before the first one. */
const FIRST_EVENT = [5, 8];
const BETWEEN_EVENTS = [16, 26];

const random = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** Thrown into a running behaviour to stop it at its next step. */
class Interrupted extends Error {}

/**
 * Gollum lives in the About and Skills chapters, on the ground strip marked by
 * each chapter's `.npc-habitat`. He creeps in soon after the area comes into
 * view and mostly idles and sneaks about. Now and then something happens: he
 * finds the ring and loses it again, falls asleep, or steals a word from the
 * page and runs off with it (see gollum-words.js; the page text never changes).
 */
export function initGollum(motion) {
  const npc = document.querySelector('#gollum');
  const habitats = [...document.querySelectorAll('.npc-habitat')];
  const sprite = createSprite(GOLLUM_FRAMES, GOLLUM_PALETTE, 'npc-sprite');
  npc.replaceChildren(sprite.canvas);

  const ring = createSprite(RING_FRAMES, GOLLUM_PALETTE, 'npc-ring');
  const sleepMark = document.createElement('span');
  sleepMark.className = 'npc-sleep';
  sleepMark.textContent = 'z';

  let habitat = null;
  let x = 0; // left edge of the sprite, relative to the habitat
  let facingLeft = false;
  let run = 0; // increases whenever the current behaviour must stop
  let returnStolen = null;

  const pixel = () => (innerWidth < MOBILE_WIDTH ? PIXEL.mobile : PIXEL.desktop);
  const spriteWidth = () => sprite.width * pixel();
  const room = () => Math.max(0, (habitat?.clientWidth || 0) - spriteWidth());

  function place() {
    if (!habitat) return;
    const scale = pixel();
    npc.style.width = `${sprite.width * scale}px`;
    npc.style.height = `${sprite.height * scale}px`;
    npc.style.transform = `translate(${Math.round(x)}px, 0)`;
  }

  function show(frame) {
    sprite.show(frame, facingLeft);
    place();
  }

  /** Waits one animation step, or throws if this behaviour has been cancelled. */
  function step(token, ms = FRAME_MS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => (token === run ? resolve() : reject(new Interrupted())), ms);
    });
  }

  async function idle(token, seconds) {
    const steps = Math.round((seconds * 1000) / FRAME_MS);
    for (let n = 0; n < steps; n++) {
      // Breathe every half second; glance the other way now and then.
      show(Math.floor(n / 4) % 2 ? 'idleLow' : 'idle');
      if (n > 6 && Math.random() < 0.012) facingLeft = !facingLeft;
      await step(token);
    }
  }

  async function creepTo(token, target, speed = CREEP_SPEED) {
    target = Math.min(Math.max(target, 0), room());
    facingLeft = target < x;
    let n = 0;
    while (Math.abs(target - x) > 1) {
      const move = (speed * FRAME_MS) / 1000;
      x += Math.sign(target - x) * Math.min(move, Math.abs(target - x));
      show(n++ % 2 ? 'creepB' : 'creepA');
      await step(token);
    }
  }

  /* -------------------------------------------------------------- */
  /* Special events                                                  */
  /* -------------------------------------------------------------- */

  async function findRing(token) {
    const scale = pixel();
    const spot = random(0.15, 0.85) * room();
    const ringX = spot + spriteWidth() * 0.55;
    habitat.append(ring.canvas);
    Object.assign(ring.canvas.style, {
      width: `${ring.width * scale}px`,
      height: `${ring.height * scale}px`,
      transform: `translate(${ringX}px, 0)`,
      opacity: 1,
      transition: 'none',
    });
    // The ring glints on the ground until he notices it.
    for (let n = 0; n < 10; n++) {
      ring.show(n % 3 ? 'ring' : 'ringGlint');
      await step(token);
    }
    ring.canvas.remove();

    await creepTo(token, spot, CREEP_SPEED * 1.6);
    facingLeft = false;
    show('ring');
    await step(token, 900);
    // My precious: he bounces with delight.
    for (let n = 0; n < 12; n++) {
      show(n % 2 ? 'ringJoy' : 'ring');
      await step(token, 170);
    }
    // It slips from his fingers, rolls away and is gone.
    habitat.append(ring.canvas);
    ring.show('ring');
    const away = Math.random() < 0.5 ? -1 : 1;
    Object.assign(ring.canvas.style, {
      transform: `translate(${x + spriteWidth() * 0.5}px, ${-sprite.height * scale * 0.5}px)`,
      transition: 'none',
    });
    await step(token, 40);
    Object.assign(ring.canvas.style, {
      transition: 'transform 1.2s cubic-bezier(.3,.6,.5,1), opacity 1.2s ease-in',
      transform: `translate(${x + spriteWidth() * 0.5 + away * 140}px, 0)`,
      opacity: 0,
    });
    show('lost');
    await step(token, 2600);
    ring.canvas.remove();
    // He goes looking for it.
    await creepTo(token, x + away * random(80, 160), CREEP_SPEED * 1.3);
  }

  async function sleep(token) {
    await creepTo(token, random(0.2, 0.8) * room());
    habitat.append(sleepMark);
    sleepMark.style.transform = `translate(${x + spriteWidth() * 0.78}px, 0)`;
    sleepMark.classList.add('drifting');
    const steps = Math.round(9000 / FRAME_MS);
    for (let n = 0; n < steps; n++) {
      show(Math.floor(n / 8) % 2 ? 'sleepHigh' : 'sleep');
      await step(token);
    }
    sleepMark.classList.remove('drifting');
    sleepMark.remove();
  }

  async function steal(token) {
    const section = habitat.closest('section');
    const scale = pixel();
    // Creep to the end of the habitat nearest the text first.
    const words = section.querySelector('[data-gollum-words]');
    if (!words) return;
    const textBox = words.getBoundingClientRect();
    const home = habitat.getBoundingClientRect();
    const towardText = textBox.left + textBox.width / 2 < home.left + home.width / 2 ? 0 : room();
    await creepTo(token, towardText, CREEP_SPEED * 1.2);

    const theft = stealWord(section, () => {
      // Where the word rides: just above his back.
      const box = npc.getBoundingClientRect();
      return { x: box.left + box.width * 0.4, y: box.top - 4 * scale };
    });
    if (!theft) return;
    returnStolen = theft.giveBack;

    facingLeft = towardText > 0;
    show('ringJoy');
    await step(token, 700);
    // Off he scuttles with it, then hides at the far end, giggling.
    await creepTo(token, towardText ? 0 : room(), CREEP_SPEED * 1.9);
    for (let n = 0; n < 14; n++) {
      show(n % 2 ? 'ringJoy' : 'ring');
      await step(token, 160);
    }
    await idle(token, 2.5);
    theft.giveBack();
    returnStolen = null;
    await idle(token, 1.5);
  }

  /* -------------------------------------------------------------- */
  /* His day                                                         */
  /* -------------------------------------------------------------- */

  async function live(token) {
    // He creeps in from the edge further from the text.
    x = Math.random() < 0.5 ? -spriteWidth() : room() + spriteWidth();
    npc.style.opacity = 1;
    await creepTo(token, random(0.3, 0.7) * room());

    let nextEvent = random(...FIRST_EVENT);
    let clock = 0;
    const events = [steal, findRing, sleep];
    let eventIndex = 0;

    for (;;) {
      if (clock >= nextEvent) {
        await events[eventIndex++ % events.length](token);
        nextEvent = clock + random(...BETWEEN_EVENTS);
      }
      const pause = random(2.5, 5);
      await idle(token, pause);
      clock += pause;
      if (Math.random() < 0.7) {
        const from = x;
        await creepTo(token, random(0, 1) * room());
        clock += Math.abs(x - from) / CREEP_SPEED;
      }
    }
  }

  /** Stops whatever he's doing and tidies up anything he left on the page. */
  function stop() {
    run++;
    returnStolen?.();
    returnStolen = null;
    ring.canvas.remove();
    sleepMark.remove();
  }

  function settleStill() {
    // Reduced motion: he simply sits there, visible and quiet.
    x = room() * 0.5;
    facingLeft = false;
    npc.style.opacity = 1;
    show('idle');
  }

  function arrive(next) {
    stop();
    habitat = next;
    habitat.append(npc);
    npc.style.opacity = 0;
    if (motion.paused) return settleStill();
    const token = run;
    live(token).catch((error) => {
      if (!(error instanceof Interrupted)) throw error;
    });
  }

  function leave() {
    stop();
    npc.style.opacity = 0;
    habitat = null;
  }

  function visibleHabitat() {
    return habitats.find((candidate) => {
      const box = candidate.getBoundingClientRect();
      return box.width && box.top < innerHeight * VISIBLE_UNTIL && box.bottom > NAV_HEIGHT;
    });
  }

  function check() {
    const current = document.hidden ? null : visibleHabitat();
    if (current === habitat) return;
    if (current) arrive(current);
    else leave();
  }

  // Layout can also shift without a scroll (late images, fonts), so check now and then too.
  const CHECK_EVERY_MS = 400;
  const poll = setInterval(check, CHECK_EVERY_MS);
  addEventListener('scroll', check, { passive: true });
  document.addEventListener('visibilitychange', check);
  addEventListener('resize', () => {
    if (habitat) arrive(habitat);
  });
  motion.onChange(() => {
    if (habitat) arrive(habitat);
  });
  check();

  return () => {
    clearInterval(poll);
    removeEventListener('scroll', check);
    leave();
  };
}

/** The ring on the ground: 5×4 pixels, with a glint frame. */
const RING_FRAMES = {
  ring: ['.rrr.', 'r...r', 'r...r', '.rrr.'],
  ringGlint: ['.rRr.', 'R...r', 'r...r', '.rrr.'],
};
