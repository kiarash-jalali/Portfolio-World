/**
 * Gollum's word stealing, done purely visually. The page text is never touched:
 * a word is found with a Range, a copy of it is laid over the page, and the
 * original is hidden under a small patch of the paper it's printed on. The copy
 * then rides along with Gollum and later flies back. Both overlays are
 * absolutely positioned, so nothing reflows.
 *
 * Only text inside `[data-gollum-words]` is eligible, and never inside links,
 * buttons, labels or headings.
 */

const WORD = /\b[A-Za-z]{5,}\b/g;
const OFF_LIMITS = 'a, button, label, input, textarea, select, summary, h1, h2, h3, h4, [aria-hidden="true"]';
/** Words under the navigation or below the fold are left alone. */
const NAV_HEIGHT = 100;
/** How quickly the stolen word catches up with Gollum (0–1 per frame). */
const FOLLOW = 0.18;
const FLY_BACK_MS = 900;

/** The solid paper colour behind an element, or null if it sits on a painting. */
function paperColour(element) {
  for (let node = element; node && node !== document.body; node = node.parentElement) {
    const colour = getComputedStyle(node).backgroundColor;
    const alpha = colour.startsWith('rgba') ? Number(colour.split(',')[3].replace(')', '')) : 1;
    if (colour !== 'transparent' && alpha > 0.92) return colour;
    if (colour !== 'transparent' && alpha > 0) return null;
  }
  return null;
}

/** Every visible, stealable word in the section, as { node, start, end, rect }. */
function candidates(section) {
  const found = [];
  section.querySelectorAll('[data-gollum-words]').forEach((container) => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement.closest(OFF_LIMITS)) continue;
      for (const match of node.textContent.matchAll(WORD)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rects = range.getClientRects();
        // Skip words broken across two lines.
        if (rects.length !== 1) continue;
        const rect = rects[0];
        if (rect.top < NAV_HEIGHT || rect.bottom > innerHeight - 20) continue;
        found.push({ node, word: match[0], rect });
      }
    }
  });
  return found;
}

/** Copies the typography of `element` onto `target`, so the copy looks identical. */
function copyType(element, target) {
  const style = getComputedStyle(element);
  for (const property of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'color', 'lineHeight']) {
    target.style[property] = style[property];
  }
}

/**
 * Lifts one word off the page. `carrier()` returns the viewport point the word
 * should follow. Returns `{ giveBack }`, or null if no word could be taken.
 */
export function stealWord(section, carrier) {
  const options = candidates(section).filter(({ node }) => paperColour(node.parentElement));
  if (!options.length) return null;
  const { node, word, rect } = options[Math.floor(Math.random() * options.length)];
  const home = { x: rect.left + scrollX, y: rect.top + scrollY };

  const patch = document.createElement('span');
  patch.className = 'word-patch';
  const colour = paperColour(node.parentElement);
  Object.assign(patch.style, {
    left: `${home.x - 2}px`,
    top: `${home.y}px`,
    width: `${rect.width + 4}px`,
    height: `${rect.height}px`,
    background: colour,
    boxShadow: `0 0 3px 2px ${colour}`,
  });

  const copy = document.createElement('span');
  copy.className = 'word-copy';
  copy.textContent = word;
  copyType(node.parentElement, copy);
  copy.style.left = `${home.x}px`;
  copy.style.top = `${home.y}px`;
  copy.style.height = `${rect.height}px`;

  document.body.append(patch, copy);

  // The copy drifts after Gollum, a little behind, with a lazy easing.
  let at = { ...home };
  let following = true;
  let frame = requestAnimationFrame(function follow() {
    if (!following) return;
    const target = carrier();
    const goal = { x: target.x + scrollX - rect.width / 2, y: target.y + scrollY - rect.height };
    at = { x: at.x + (goal.x - at.x) * FOLLOW, y: at.y + (goal.y - at.y) * FOLLOW };
    copy.style.transform = `translate(${at.x - home.x}px, ${at.y - home.y}px) rotate(${Math.sin(performance.now() / 160) * 6}deg)`;
    frame = requestAnimationFrame(follow);
  });

  let returned = false;
  function giveBack() {
    if (returned) return;
    returned = true;
    following = false;
    cancelAnimationFrame(frame);
    // Fly home, then show the original again.
    copy.style.transition = `transform ${FLY_BACK_MS}ms cubic-bezier(.5,0,.3,1)`;
    copy.style.transform = 'translate(0, 0)';
    setTimeout(() => {
      patch.remove();
      copy.remove();
    }, FLY_BACK_MS);
  }

  return { word, giveBack };
}
