import { html, esc } from './html.mjs';

const GRID_CELLS = 100;
/** The one cell that starts selected, near the middle of the grid. */
const FIRST_SELECTED = 44;

const springCells = () =>
  Array.from(
    { length: GRID_CELLS },
    (_, i) =>
      `<button type="button" aria-label="Spring cell ${i + 1}" aria-pressed="${i === FIRST_SELECTED}" tabindex="${i === FIRST_SELECTED ? 0 : -1}" style="--cell:${i}"></button>`,
  ).join('');

const inkstone = () => html`
  <article class="lab-experiment">
    <header>
      <span class="eyebrow">A STUDY IN MOTION</span>
      <h3>Elastic possibilities.</h3>
      <p>Drag the inkstone. Let it go. A small study in springs, momentum, and getting back into shape.</p>
    </header>
    <div id="inkStage" class="ink-stage" role="group" aria-label="Elastic inkstone experiment">
      <div class="lab-rules" aria-hidden="true"></div>
      <button id="inkstone" class="inkstone" type="button" aria-label="Inkstone: drag, or use arrow keys to move and Space to release"><span>✧</span></button>
      <span class="experiment-hint">DRAG TO EXPLORE · ARROW KEYS ALSO WORK</span>
    </div>
  </article>`;

const springGrid = (body) => html`
  <article class="lab-experiment">
    <header>
      <span class="eyebrow">A STUDY IN CHOICE</span>
      <h3>A hundred small decisions.</h3>
      <p>${esc(body)}</p>
    </header>
    <div id="springGrid" class="spring-grid" role="group" aria-label="Choose one of one hundred spring cells">${springCells()}</div>
  </article>`;

/** The workshop: two small hands-on experiments on graph paper pinned to the bench (see chapters/lab.js). */
export const lab = ({ copy }) => html`
  <section id="lab" class="chapter workshop" data-theme="workshop" aria-labelledby="labTitle">
    <div class="workshop-board content-width">
      <header class="workshop-heading">
        <div>
          <span class="eyebrow">FIELD NOTES / EXPERIMENTS</span>
          <h2 id="labTitle">The little<br><em>workshop.</em></h2>
        </div>
        <p>${esc(copy.lab.subtitle)}</p>
      </header>
      <div class="lab-grid">
        ${inkstone()}
        ${springGrid(copy.lab.trailBody)}
      </div>
    </div>
  </section>`;
