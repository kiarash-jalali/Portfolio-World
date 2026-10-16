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

/** The tall tablet on the left, on the stone overlook: the title and the skills. */
const tablet = (copy, groups) => html`
  <div class="city-tablet">
    <header>
      <span class="eyebrow">THE CRAFT</span>
      <h2 id="skillsTitle">Built one<br><em>stone at a time.</em></h2>
      <p data-gollum-words>${esc(copy.skills.subtitle)}</p>
    </header>
    ${skillGroups(groups)}
  </div>`;

/** The wide terrace below the city: tools at hand, and life away from the keyboard. */
const terrace = (toolList, learning, interestList) => html`
  <div class="city-terrace">
    <div class="npc-habitat" aria-hidden="true"></div>
    <div class="tool-terrace">
      <span class="eyebrow">THE TOOLS AT MY TABLE</span>
      <div class="tool-list">${each(toolList, (tool) => `<span>${esc(tool.name)}</span>`)}</div>
      <p><strong>Currently exploring</strong> ${esc(learning)}</p>
    </div>
    <div class="interests">
      <span class="eyebrow">AWAY FROM THE KEYBOARD</span>
      <div data-gollum-words>
        ${each(interestList, (interest) => `<article><h3>${esc(interest.title)}</h3><p>${esc(interest.body)}</p></article>`)}
      </div>
    </div>
  </div>`;

/**
 * Minas Tirith, laid out after skills.png: a tall tablet of skills on the stone
 * overlook to the left, the white city filling the upper right, and a wide
 * terrace of tools and interests beneath it. Gollum creeps along the terrace.
 */
export const city = ({ copy, skillGroups: groups, tools: toolList, interests: interestList }) => html`
  <section id="skills" class="chapter city" data-scene="city" data-theme="city" aria-labelledby="skillsTitle">
    <div class="scene-art city-art" aria-hidden="true">
      <img src="/art/phase2/minas-tirith.webp" alt="" width="1659" height="948" loading="lazy">
    </div>
    <div class="city-mist" aria-hidden="true"></div>
    <div class="city-layout">
      ${tablet(copy, groups)}
      <div class="city-view" aria-hidden="true"></div>
      ${terrace(toolList, copy.skills.learning, interestList)}
    </div>
    <div class="city-exit" aria-hidden="true"></div>
  </section>`;
