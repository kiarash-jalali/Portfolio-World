import { html, esc } from './html.mjs';
import { tagList } from './shared.mjs';

const MOTES = 12;

/** Gold motes drifting up from the Erdtree's roots, spread across the scene. */
const motes = () =>
  Array.from(
    { length: MOTES },
    (_, i) => `<i style="--i:${i};left:${8 + ((i * 37) % 86)}%;top:${30 + ((i * 23) % 60)}%"></i>`,
  ).join('');

/**
 * The Erdtree chapter, laid out after work1.png: the Tarnished on the ledge to
 * the left, the Erdtree to the right, and Rootine in a tall panel between
 * them. Rootine is honestly labeled as a private alpha.
 */
export const projects = ({ copy, projects: [rootine] }) => html`
  <section id="projects" class="chapter tree-world" data-scene="tree" data-theme="tree" aria-labelledby="workTitle">
    <div class="scene-art" aria-hidden="true">
      <picture>
        <source media="(max-width:700px)" srcset="/art/phase2/erdtree-mobile.webp">
        <img src="/art/phase2/erdtree.webp" alt="" width="1659" height="948" loading="lazy">
      </picture>
    </div>
    <div class="tree-light" aria-hidden="true"></div>
    <div class="dusk-veil" aria-hidden="true"></div>
    <div class="gold-motes" aria-hidden="true">${motes()}</div>

    <div class="tree-layout">
      <article class="rootine-panel">
        <header class="work-header">
          <span class="eyebrow">SOMETHING WORTH BUILDING</span>
          <h2 id="workTitle">Small beginnings.<br><em>Room to grow.</em></h2>
        </header>
        <div class="grace-rule" aria-hidden="true"><i></i></div>
        <div class="rootine-story">
          <span class="eyebrow">FEATURED PROJECT</span>
          <h3>Rootine</h3>
          <p class="project-subtitle">${esc(copy.projects.rootineTagline)}</p>
          <p>${esc(rootine.description)}</p>
          <div class="tags">${tagList(rootine)}</div>
          <div class="actions">
            <button class="button" data-project="rootine" type="button">Inside the project <span>↗</span></button>
            <a class="text-link" href="${rootine.live}" target="_blank" rel="noopener">Visit Rootine ↗</a>
          </div>
          <a class="project-repo" href="${rootine.repo}" target="_blank" rel="noopener">View source on GitHub ↗</a>
          <small class="project-status">PRIVATE ALPHA · IN PROGRESS</small>
        </div>
      </article>
    </div>

    <p class="landscape-caption">An idea becomes a practice.<br>A practice becomes a world.</p>
  </section>`;
