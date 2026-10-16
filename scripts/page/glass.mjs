import { html, esc, each } from './html.mjs';
import { tagList } from './shared.mjs';

/** One tall leaded window. `--panel` picks its slice of the triptych painting. */
const glassPanel = (project, index) => html`
  <article class="glass-panel" style="--panel:${index}">
    <div class="glass-picture" aria-hidden="true"></div>
    <div class="glass-shine" aria-hidden="true"></div>
    <div class="window-title">
      <span>${esc(project.category)}</span>
      <h3>${esc(project.title)}</h3>
    </div>
    <div class="glass-copy">
      <p>${esc(project.description)}</p>
      <div class="tags">${tagList(project)}</div>
      <div class="actions">
        <button class="text-link" type="button" data-project="${project.key}">The details <span>↗</span></button>
        <a class="text-link" href="${project.live}" target="_blank" rel="noopener">Live project ↗</a>
      </div>
    </div>
  </article>`;

/** The stained-glass triptych: the three earlier projects, one per window. */
export const glass = ({ copy, projects: [, ...earlier] }) => html`
  <section id="collected-work" class="chapter glass-world" data-scene="glass" data-theme="glass" aria-labelledby="glassTitle">
    <header class="chapter-heading">
      <span class="eyebrow">STUDIES IN LIGHT</span>
      <h2 id="glassTitle">Three windows<br><em>into the work.</em></h2>
      <p>${esc(copy.projects.subtitle)}</p>
    </header>
    <div class="triptych content-width">${each(earlier, glassPanel)}</div>
    <div class="glass-footnote">
      <span>HTML · CSS · JAVASCRIPT</span>
      <span>Earlier work, kept intentionally. Every craft has a beginning.</span>
    </div>
  </section>`;
