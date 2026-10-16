const VISIBLE_FOR_MS = 3200;
let hideTimer;

/** Shows a short status message at the bottom of the page. */
export function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => element.classList.remove('visible'), VISIBLE_FOR_MS);
}
