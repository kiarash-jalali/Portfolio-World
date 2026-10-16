import { html } from './html.mjs';
import { seal } from './shared.mjs';

export const skipLink = () => html`<a class="skip-link" href="#main">Skip to content</a>`;

export const navigation = () => html`
  <header class="navigation" id="nav">
    <a class="brand" href="#home" aria-label="Kiarash Jalali — home">
      <span class="brand-seal">${seal}</span>
      <span>KIARASH JALALI<small>AN EXPLORER OF THE WEB</small></span>
    </a>
    <nav aria-label="Primary navigation">
      <a href="#about">About</a>
      <a href="#skills">Craft</a>
      <a href="#projects">Work</a>
      <a href="#ai">AI</a>
      <a href="#lab">Lab</a>
    </nav>
    <div class="nav-actions">
      <a class="nav-contact" href="#contact">Say hello <span>↗</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Open navigation">☰</button>
    </div>
    <div class="reading-progress" aria-hidden="true"></div>
  </header>`;

export const mobileNavigation = () => html`
  <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation" hidden>
    <a href="#home">The pond</a>
    <a href="#about">About & path</a>
    <a href="#skills">The craft</a>
    <a href="#projects">Selected work</a>
    <a href="#ai">AI, openly</a>
    <a href="#lab">The workshop</a>
    <a href="#contact">Say hello</a>
  </nav>`;
