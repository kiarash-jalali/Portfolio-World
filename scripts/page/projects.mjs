import { html, esc } from './html.mjs';
import { tagList } from './shared.mjs';

const MOTES = 9;

/** Gold motes drifting around the Erdtree, spread across the scene. */
const motes = () =>
  Array.from({ length: MOTES }, (_, i) => `<i style="--i:${i};left:${20 + i * 8}%;top:${20 + ((i * 13) % 65)}%"></i>`).join('');

/** The Erdtree chapter. Rootine is the featured project, honestly labeled as a private alpha. */
export const projects = ({ copy, projects: [rootine] }) => html`
  <section id="projects" class="chapter tree-world" data-scene="tree" data-theme="tree" aria-labelledby="workTitle">
    <div class="scene-art" aria-hidden="true">
      <picture>
        <source media="(max-width:700px)" srcset="/art/phase2/erdtree-mobile.webp">
        <img src="/art/phase2/erdtree.webp" alt="" width="1659" height="948" loading="lazy">
      </picture>
    </div>
    <div class="tree-light" aria-hidden="true"></div>
    <div class="gold-motes" aria-hidden="true">${motes()}</div>

    <div class="content-width work-header">
      <span class="eyebrow">SOMETHING WORTH BUILDING</span>
      <h2 id="workTitle">Small beginnings.<br><em>Room to grow.</em></h2>
    </div>

    <article class="rootine-story">
      <span class="eyebrow">FEATURED PROJECT</span>
      <h3>Rootine<span>✦</span></h3>
      <p class="project-subtitle">${esc(copy.projects.rootineTagline)}</p>
      <p>${esc(rootine.description)}</p>
      <div class="tags">${tagList(rootine)}</div>
      <div class="actions">
        <button class="button" data-project="rootine" type="button">Inside the project <span>↗</span></button>
        <a class="text-link" href="${rootine.live}" target="_blank" rel="noopener">Visit Rootine ↗</a>
      </div>
      <a class="project-repo" href="${rootine.repo}" target="_blank" rel="noopener">View source on GitHub ↗</a>
      <small class="project-status">PRIVATE ALPHA · IN PROGRESS</small>
    </article>

    <p class="landscape-caption">An idea becomes a practice.<br>A practice becomes a world.</p>
    <div class="glass-approach" aria-hidden="true"></div>
  </section>`;
