import { data } from '../content.js';
import { escapeHtml as esc } from '../core/html.js';

const PROMPT_PLACEHOLDER = 'A little context changes everything.';

/**
 * The AI chapter: the workflow tabs (context → check → adapt → test) and the
 * illustrative before/after prompt. Nothing here calls a real API.
 */
export function initAiChapter() {
  initWorkflowTabs();
  initPromptExample();
}

function initWorkflowTabs() {
  const tabs = [...document.querySelectorAll('[data-step]')];
  const panel = document.querySelector('#stepDetail');

  function select(tab) {
    const step = data.aiSteps.find((s) => s.key === tab.dataset.step);
    tabs.forEach((other) => {
      const chosen = other === tab;
      other.setAttribute('aria-selected', String(chosen));
      other.tabIndex = chosen ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.innerHTML = `<span>${esc(step.title.toUpperCase())}</span><p>${esc(step.detail)}</p>`;
  }

  // Standard tab keyboard pattern: arrows wrap around, Home and End jump to the ends.
  function keyTarget(key, index) {
    if (key === 'ArrowRight') return (index + 1) % tabs.length;
    if (key === 'ArrowLeft') return (index - 1 + tabs.length) % tabs.length;
    if (key === 'Home') return 0;
    if (key === 'End') return tabs.length - 1;
    return null;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      const next = keyTarget(event.key, index);
      if (next === null) return;
      event.preventDefault();
      tabs[next].focus();
      select(tabs[next]);
    });
  });
}

function initPromptExample() {
  const before = document.querySelector('#promptBefore');
  const after = document.querySelector('#promptAfter');
  let index = 0;

  document.querySelector('#refinePrompt').addEventListener('click', () => {
    after.textContent = data.promptExamples[index].after;
  });

  document.querySelector('#nextPrompt').addEventListener('click', () => {
    index = (index + 1) % data.promptExamples.length;
    before.textContent = data.promptExamples[index].before;
    after.textContent = PROMPT_PLACEHOLDER;
  });
}
