import { html, esc, each } from './html.mjs';
import { seal } from './shared.mjs';

const contactLink = (link) => {
  const external = link.href.startsWith('http') ? 'target="_blank" rel="noopener"' : '';
  return `<a href="${esc(link.href)}" ${external}><span>${esc(link.label)}</span><strong>${esc(link.value)}</strong><i>↗</i></a>`;
};

/** The form only prepares an email draft, and says so (see chapters/contact.js). */
const letterForm = () => html`
  <form id="contactForm" class="letter-form">
    <span class="letter-date">A LETTER TO KIARASH</span>
    <label>Your name<input name="name" autocomplete="name" required maxlength="120"></label>
    <label>Your email<input name="email" type="email" autocomplete="email" required maxlength="254"></label>
    <label>What are we talking about?<textarea name="message" rows="3" required maxlength="5000"></textarea></label>
    <button class="button" type="submit">Open email draft <span>↗</span></button>
    <p>This opens your email app with your message prepared.</p>
    <span class="letter-stamp" aria-hidden="true">KJ</span>
  </form>`;

const footer = (year) => html`
  <footer class="content-width">
    <a href="#home" class="footer-brand">${seal}<span>Kiarash Jalali</span></a>
    <span>© ${year} · Made with code & curiosity.<small>Original artwork. A personal homage to imagined worlds.</small></span>
    <a href="#home">Back to the pond ↑</a>
  </footer>`;

/**
 * The closing chapter, back at the pond where the journey began, now at dusk:
 * contact channels, the letter form and the footer.
 */
export const contact = ({ copy, contactLinks }) => html`
  <section id="contact" class="chapter correspondence" data-scene="dusk" data-theme="dusk" aria-labelledby="contactTitle">
    <div class="scene-art dusk-pond" aria-hidden="true">
      <img src="/art/phase2/pond-bottom.webp" alt="" width="1536" height="1024" loading="lazy">
    </div>
    <div class="content-width contact-layout">
      <div>
        <span class="eyebrow">LEAVE A LITTLE NOTE</span>
        <h2 id="contactTitle">Every good story<br><em>starts with hello.</em></h2>
        <p>${esc(copy.contact.body)}</p>
        <div class="contact-links">${each(contactLinks, contactLink)}</div>
      </div>
      ${letterForm()}
    </div>
    ${footer(new Date().getFullYear())}
  </section>`;
