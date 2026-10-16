import { html } from './html.mjs';
import { seal } from './shared.mjs';

const paperLayer = (name, image) => html`
  <div class="paper-${name}">
    <img src="/art/phase2/${image}" width="1659" height="948" loading="lazy" alt="">
  </div>`;

/**
 * The atlas passage: a tall section with a sticky stage, where the paper layers
 * fold up into a diorama as you scroll (see chapters/atlas.js).
 */
export const atlas = () => html`
  <section class="atlas-passage" id="atlas" data-scene="atlas" data-theme="atlas" aria-label="An illustrated atlas unfolds">
    <div class="atlas-sticky">
      <img class="atlas-map" src="/art/atlas.webp" alt="" loading="lazy" width="1536" height="1024">
      <div class="atlas-vignette"></div>
      <div class="compass" aria-hidden="true">${seal}<span>N</span></div>
      <div class="paper-theatre" aria-hidden="true">
        ${paperLayer('mountains', 'terrain.webp')}
        ${paperLayer('wall', 'wall.webp')}
        ${paperLayer('snow', 'snow-foreground.webp')}
      </div>
      <div class="atlas-heraldry" aria-hidden="true"><span>❧</span><i></i><span>✧</span></div>
      <div class="atlas-title">
        <span class="eyebrow">THE UNCHARTED</span>
        <h2>There is always<br><em>more to discover.</em></h2>
        <p>Notes, experiments, and the tools that help me find a way.</p>
      </div>
      <span class="atlas-coordinate" aria-hidden="true">THE NORTHERN ATLAS</span>
    </div>
  </section>`;
