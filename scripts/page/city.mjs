import { html, esc, each } from './html.mjs';

/** Skills are described honestly in words; there are no levels, bars or numbers. */
const skillGroups = (groups) => html`
  <div class="skill-groups">
    ${each(
      groups,
      (group) => html`
        <article>
          <h3>${esc(group.title)}</h3>
          <dl>
            ${each(group.items, (skill) => `<div><dt>${esc(skill.name)}</dt><dd>${esc(skill.status)}</dd></div>`)}
          </dl>
        </article>`,
    )}
  </div>`;

const tools = (list, learning) => html`
  <div class="tool-terrace">
    <span class="eyebrow">THE TOOLS AT MY TABLE</span>
    <div class="tool-list">${each(list, (tool) => `<span>${esc(tool.name)}</span>`)}</div>
    <p><strong>Currently exploring</strong><br>${esc(learning)}</p>
  </div>`;

const interests = (list) => html`
  <div class="interests content-width">
    <span class="eyebrow">AWAY FROM THE KEYBOARD</span>
    <div>
      ${each(list, (interest) => `<article><h3>${esc(interest.title)}</h3><p>${esc(interest.body)}</p></article>`)}
    </div>
  </div>`;

/** Minas Tirith: skills, tools and interests, set against the white city. */
export const city = ({ copy, skillGroups: groups, tools: toolList, interests: interestList }) => html`
  <section id="skills" class="chapter city" data-scene="city" data-theme="city" aria-labelledby="skillsTitle">
    <div class="scene-art city-art" aria-hidden="true">
      <img src="/art/phase2/minas-tirith.webp" alt="" width="1536" height="1024" loading="lazy">
    </div>
    <div class="city-mist" aria-hidden="true"></div>
    <div class="content-width skill-layout">
      <header>
        <span class="eyebrow">THE CRAFT</span>
        <h2 id="skillsTitle">Built one<br><em>stone at a time.</em></h2>
        <p>${esc(copy.skills.subtitle)}</p>
      </header>
      ${skillGroups(groups)}
      ${tools(toolList, copy.skills.learning)}
    </div>
    ${interests(interestList)}
    <div class="npc-habitat" aria-hidden="true"></div>
    <div class="city-exit" aria-hidden="true"></div>
  </section>`;
