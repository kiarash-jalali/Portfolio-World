import { gsap } from 'gsap';

/** The NPC's clock ticks this often. */
const TICK_MS = 250;
/** Seconds after arriving before the first walk and the first special event. */
const FIRST_WALK = 3;
const FIRST_EVENT = 21;
/** Seconds between walks, and between special events. */
const WALK_EVERY = 10;
const EVENT_EVERY = 37;
/** A special event also pushes the next walk back by this much. */
const WALK_AFTER_EVENT = 12;
/** A habitat counts as visible between the navigation and the bottom of the screen. */
const NAV_HEIGHT = 95;
const VISIBLE_UNTIL = 0.94;
/** Words worth stealing: five letters or more. */
const STEALABLE = /\b[A-Za-z]{5,}\b/;

/**
 * Gollum lives in the About and Skills chapters. He mostly idles and sneaks,
 * and now and then finds the ring, falls asleep or steals a word.
 */
export function initGollum(motion) {
  const npc = document.querySelector('#gollum');
  const ring = npc.querySelector('.npc-ring');
  const word = npc.querySelector('.npc-word');
  const habitats = [...document.querySelectorAll('.npc-habitat')];

  let habitat = null;
  let elapsed = 0;
  let nextWalk = FIRST_WALK;
  let nextEvent = FIRST_EVENT;
  let eventCount = 0;
  let timeline;
  let stolen;

  function returnWord() {
    if (stolen) {
      const parent = stolen.parentNode;
      stolen.replaceWith(...stolen.childNodes);
      parent?.normalize();
      stolen = null;
    }
    word.textContent = '';
  }

  function reset() {
    timeline?.kill();
    returnWord();
    npc.dataset.pose = 'idle';
    gsap.set(ring, { opacity: 0, x: 0, y: 0 });
  }

  /** Wraps the first long word of the section's intro paragraph so CSS can show it missing. */
  function wrapWord(section) {
    const paragraph =
      section.querySelector('.about-story p') || section.querySelector('.skill-layout>header>p');
    if (!paragraph) return;
    const node = [...paragraph.childNodes].find(
      (child) => child.nodeType === Node.TEXT_NODE && STEALABLE.test(child.textContent),
    );
    if (!node) return;
    const match = STEALABLE.exec(node.textContent);
    const range = document.createRange();
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].length);
    const span = document.createElement('span');
    range.surroundContents(span);
    return span;
  }

  function arrive(next) {
    reset();
    habitat = next;
    habitat.append(npc);
    elapsed = 0;
    nextWalk = FIRST_WALK;
    nextEvent = FIRST_EVENT;
    gsap.set(npc, { x: 0, y: 0, rotation: 0, opacity: 0 });
    gsap.to(npc, { opacity: 1, duration: motion.paused ? 0 : 0.7, delay: motion.paused ? 0 : 0.6 });
  }

  /** Sneaks to the left or right part of the habitat, alternating. */
  function walk() {
    if (!habitat) return;
    reset();
    npc.dataset.pose = 'sneak';
    const room = Math.max(0, habitat.clientWidth - npc.clientWidth);
    const target = Math.min(room, (eventCount % 2 ? 0.25 : 0.72) * room);
    timeline = gsap
      .timeline({ onComplete: () => (npc.dataset.pose = 'idle') })
      .to(npc, { x: target, duration: 4.8, ease: 'sine.inOut' });
  }

  function findRing() {
    npc.dataset.pose = 'ring';
    timeline = gsap
      .timeline({ onComplete: reset })
      .to(ring, { opacity: 1, duration: 0.3 })
      .to(npc, { y: -9, duration: 0.23, repeat: 3, yoyo: true }) // delight
      .to(ring, { x: 28, y: 26, duration: 0.8, ease: 'bounce.out' }) // and it slips away
      .to(npc, { rotation: 7, duration: 0.16, repeat: 5, yoyo: true })
      .to(npc, { rotation: 0, y: 0, duration: 0.5 })
      .to({}, { duration: 1.4 });
  }

  function stealWord() {
    stolen = wrapWord(habitat.closest('section'));
    if (stolen) {
      word.textContent = stolen.textContent;
      stolen.classList.add('stolen-word');
    }
    npc.dataset.pose = 'sneak';
    timeline = gsap
      .timeline({ onComplete: reset })
      .to(npc, { x: 0, duration: 3.8, ease: 'sine.inOut' })
      .to({}, { duration: 1.5 });
  }

  function sleep() {
    npc.dataset.pose = 'sleep';
    timeline = gsap
      .timeline({ onComplete: reset })
      .to(npc, { rotation: -8, y: 5, duration: 0.8 })
      .to({}, { duration: 5 })
      .to(npc, { rotation: 0, y: 0, duration: 0.8 });
  }

  const SPECIAL_EVENTS = [findRing, stealWord, sleep];

  function specialEvent() {
    reset();
    SPECIAL_EVENTS[eventCount++ % SPECIAL_EVENTS.length]();
  }

  function visibleHabitat() {
    return habitats.find((candidate) => {
      const box = candidate.getBoundingClientRect();
      return box.top < innerHeight * VISIBLE_UNTIL && box.bottom > NAV_HEIGHT;
    });
  }

  const timer = setInterval(() => {
    if (document.hidden) return;

    const current = visibleHabitat();
    if (!current) {
      if (habitat) {
        reset();
        gsap.set(npc, { opacity: 0 });
        habitat = null;
      }
      return;
    }
    if (current !== habitat) arrive(current);
    if (motion.paused) return;

    elapsed += TICK_MS / 1000;
    if (elapsed >= nextEvent) {
      nextEvent = elapsed + EVENT_EVERY;
      nextWalk = elapsed + WALK_AFTER_EVENT;
      specialEvent();
    } else if (elapsed >= nextWalk) {
      nextWalk = elapsed + WALK_EVERY;
      walk();
    }
  }, TICK_MS);

  motion.onChange(() => {
    reset();
    if (habitat) gsap.set(npc, { opacity: 1, rotation: 0, y: 0 });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
  addEventListener('resize', reset);

  return () => {
    clearInterval(timer);
    reset();
  };
}
