import { html } from './html.mjs';
import { seal } from './shared.mjs';

/**
 * One pop-up card: a die-cut paper piece hinged on a fold line drawn on the
 * map, with the shadow it casts back onto the map when it stands up.
 */
const popUp = (name, art) => html`
  <div class="fold fold-${name}">
    <i class="fold-crease"></i>
    <i class="fold-shadow"></i>
    <div class="fold-card">${art}</div>
  </div>`;

const painting = (image) => `<img src="/art/phase2/${image}" width="1659" height="948" loading="lazy" alt="">`;
/** The Wall and Castle Black are painted into these canvases (chapters/atlas/paper-wall.js). */
const paperCanvas = (name) => `<canvas data-paper="${name}"></canvas>`;

/**
 * The atlas passage: a tall section with a sticky stage. As you scroll, the
 * map of the North tilts back into a tabletop and the pop-up pieces rise from
 * their folds, back to front: the mountains, the Wall, Castle Black, and the
 * snowfield with the weirwood. Scrolling up folds it flat again
 * (see chapters/atlas/scroll.js).
 */
export const atlas = () => html`
  <section class="atlas-passage" id="atlas" data-scene="atlas" data-theme="atlas" aria-label="An illustrated atlas unfolds">
    <div class="atlas-sticky">
      <div class="atlas-table" aria-hidden="true">
        <div class="atlas-sheet">
          <img class="atlas-map" src="/art/atlas.webp" alt="" loading="lazy" width="1536" height="1024">
          ${popUp('peaks', painting('terrain.webp'))}
          ${popUp('wall', paperCanvas('wall'))}
          ${popUp('castle', paperCanvas('castle'))}
          ${popUp('snow', painting('snow-foreground.webp'))}
        </div>
      </div>
      <canvas class="atlas-snow" aria-hidden="true"></canvas>
      <div class="atlas-shade" aria-hidden="true"></div>
      <div class="compass" aria-hidden="true">${seal}<span>N</span></div>
      <div class="atlas-title">
        <span class="eyebrow">THE UNCHARTED</span>
        <h2>There is always<br><em>more to discover.</em></h2>
        <p>Notes, experiments, and the tools that help me find a way.</p>
      </div>
      <span class="atlas-coordinate" aria-hidden="true">THE NORTHERN ATLAS</span>
    </div>
  </section>`;
