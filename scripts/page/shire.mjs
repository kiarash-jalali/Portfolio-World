import { html, esc, each } from './html.mjs';

/** The left page: the chapter title and the About story. Gollum may borrow a word from it. */
const aboutPage = (about) => html`
  <article class="shire-page about-page">
    <header>
      <span class="eyebrow">A PATH OF MY OWN</span>
      <h2 id="aboutTitle">A curious mind.<br><em>A winding path.</em></h2>
      <p class="page-lead">${esc(about.subtitle)}</p>
    </header>
    <div class="portrait-line">
      <img src="/images/kiarash.webp" width="64" height="64" alt="Portrait of Kiarash Jalali" loading="lazy">
      <span>Hi, I’m Kiarash.<small>FRONT-END DEVELOPER / STUDENT</small></span>
    </div>
    <div class="about-story" data-gollum-words>
      ${each(['p1', 'p2', 'p3'], (key) => `<p>${about[key]}</p>`)}
    </div>
    <div class="signature" aria-hidden="true">Kiarash.</div>
  </article>`;

/** The right page: the road so far, newest first. */
const roadPage = (title, entries) => html`
  <aside class="shire-page road-page" aria-labelledby="roadTitle">
    <span class="eyebrow">THE ROAD HERE</span>
    <h3 id="roadTitle">${esc(title)}</h3>
    <ol>
      ${each(
        entries,
        (entry) => html`
          <li>
            <span class="date">${esc(entry.year)}</span>
            <h4>${esc(entry.title)}</h4>
            <p class="place">${esc(entry.place)}</p>
            <p>${esc(entry.body)}</p>
          </li>`,
      )}
    </ol>
  </aside>`;

/**
 * The round door, the page's one environmental interaction (chapters/shire/door.js).
 * It's pinned over the door in the painting; the leaf is a crop of the painting
 * itself, so when it swings open the painted door is what moves.
 */
const roundDoor = () => html`
  <div class="round-door">
    <div class="door-interior" aria-hidden="true"></div>
    <div class="door-resident" aria-hidden="true"></div>
    <div class="door-leaf" aria-hidden="true"></div>
    <button class="hobbit-door" id="hobbitDoor" type="button" aria-label="Knock on the round door"></button>
    <p class="door-note" aria-hidden="true">Someone might be home.<span>Knock on the door</span></p>
    <p id="doorStatus" class="sr-only" role="status"></p>
  </div>`;

const services = (items) => html`
  <div class="services content-width">
    ${each(
      items,
      (service) => html`
        <article>
          <span class="eyebrow" aria-hidden="true">✧</span>
          <h3>${esc(service.title)}</h3>
          <p>${esc(service.body)}</p>
        </article>`,
    )}
  </div>`;

/**
 * The Shire: About on the left page, the road so far on the right, and the
 * hobbit hole in the middle of the painting between them. Gollum (#gollum)
 * creeps about on the path below the door, and later in the next chapter.
 */
export const shire = ({ copy, education: path, services: offered }) => html`
  <section id="about" class="chapter shire" data-scene="shire" data-theme="shire" aria-labelledby="aboutTitle">
    <div class="shire-stage">
      <div class="shire-scene" aria-hidden="true">
        <img class="shire-painting" src="/art/shire.webp" alt="" width="1659" height="948" loading="lazy">
        <div class="shire-light"></div>
        <div class="cloud cloud-one"></div>
        <div class="cloud cloud-two"></div>
        <div class="chimney-smoke"><i></i><i></i><i></i></div>
      </div>
      ${roundDoor()}
      <div class="shire-layout">
        ${aboutPage(copy.about)}
        <div class="shire-window" aria-hidden="true">
          <div class="npc-habitat"></div>
        </div>
        ${roadPage(copy.education.title, path)}
      </div>
    </div>
    ${services(offered)}
    <div class="npc" id="gollum" aria-hidden="true"></div>
    <div class="land-exit" aria-hidden="true"></div>
  </section>`;
