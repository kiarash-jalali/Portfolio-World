import { html, esc, each } from './html.mjs';

/** The eight-pointed seal used in the brand, the atlas compass and the footer. */
export const seal = html`
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 3 30 17 45 24 30 31 24 45 18 31 3 24 18 17Z"/>
    <circle cx="24" cy="24" r="13"/>
    <circle cx="24" cy="24" r="4"/>
  </svg>`;

export const tagList = (project) => each(project.tags, (tag) => `<span>${esc(tag)}</span>`);
