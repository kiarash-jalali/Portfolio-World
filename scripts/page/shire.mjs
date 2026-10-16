import { html, esc, each } from './html.mjs';

const story = (about) => html`
  <article class="about-story manuscript">
    <div class="portrait-line">
      <img src="/images/kiarash.webp" width="64" height="64" alt="Portrait of Kiarash Jalali" loading="lazy">
      <span>Hi, I’m Kiarash.<small>FRONT-END DEVELOPER / STUDENT</small></span>
    </div>
    ${each(['p1', 'p2', 'p3'], (key) => `<p>${about[key]}</p>`)}
    <div class="signature" aria-hidden="true">Kiarash.</div>
  </article>`;

/** The round door is the page's one environmental interaction (see chapters/shire/door.js). */
const hobbitHole = () => html`
  <div class="home-vignette">
    <div class="door-surround">
      <div class="door-interior" aria-hidden="true"></div>
      <div class="hobbit character" aria-hidden="true"></div>
      <button class="hobbit-door" id="hobbitDoor" aria-label="Knock on the round door" type="button">
        <span class="door-grain"></span>
        <span class="door-knob"></span>
      </button>
    </div>
    <p class="door-note">Someone might be home.<span>Knock on the door</span></p>
    <div class="smoke" aria-hidden="true"></div>
    <p id="doorStatus" class="sr-only" role="status"></p>
  </div>`;

const education = (title, entries) => html`
  <aside class="education manuscript">
    <span class="eyebrow">THE ROAD HERE</span>
    <h3>${esc(title)}</h3>
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

const services = (items) => html`
  <div class="services content-width">
    ${each(
      items,
      (service) => html`
        <article>
          <span class="eyebrow">✧</span>
          <h3>${esc(service.title)}</h3>
          <p>${esc(service.body)}</p>
        </article>`,
    )}
  </div>`;

/**
 * About and education in the margins, the hobbit hole in the middle.
 * Gollum (#gollum) starts here; he roams the `.npc-habitat` of this chapter and the next.
 */
export const shire = ({ copy, education: path, services: offered }) => html`
  <section id="about" class="chapter shire" data-scene="shire" data-theme="shire" aria-labelledby="aboutTitle">
    <div class="scene-art" aria-hidden="true">
      <img src="/art/shire.webp" alt="" width="1536" height="1024" loading="lazy">
    </div>
    <div class="land-haze" aria-hidden="true"></div>
    <div class="cloud cloud-one" aria-hidden="true"></div>
    <div class="cloud cloud-two" aria-hidden="true"></div>

    <header class="chapter-heading">
      <span class="eyebrow">A PATH OF MY OWN</span>
      <h2 id="aboutTitle">A curious mind.<br><em>A winding path.</em></h2>
      <p>${esc(copy.about.subtitle)}</p>
    </header>

    <div class="shire-layout content-width">
      ${story(copy.about)}
      ${hobbitHole()}
      ${education(copy.education.title, path)}
    </div>

    ${services(offered)}

    <div class="npc-habitat" aria-hidden="true"></div>
    <div class="npc" id="gollum" aria-hidden="true">
      <span class="npc-ring"></span>
      <span class="npc-word"></span>
      <span class="character"></span>
    </div>
    <div class="land-exit" aria-hidden="true"></div>
  </section>`;
