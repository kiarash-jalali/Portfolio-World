import { html, esc } from './html.mjs';

/**
 * Chapter one, the pond. The static painting and fallback koi sit under the
 * WebGL water canvas, so the hero still looks right if WebGL is unavailable.
 */
export const pond = ({ copy, profile }) => html`
  <section id="home" class="chapter pond" data-scene="pond" data-theme="pond" aria-labelledby="heroTitle">
    <div class="scene-art pond-art" aria-hidden="true">
      <picture>
        <source media="(max-width: 700px)" srcset="/art/phase2/pond-mobile.webp">
        <img src="/art/phase2/pond-bottom.webp" alt="" fetchpriority="high" width="1536" height="1024">
      </picture>
    </div>
    <canvas id="pondWater" class="pond-water" aria-hidden="true"></canvas>
    <div class="pond-fish fish-fallback" aria-hidden="true">
      <img src="/art/phase2/koi-coral.webp" class="koi koi-one" alt="">
      <img src="/art/phase2/koi-gold.webp" class="koi koi-two" alt="">
    </div>
    <div class="pond-depth" aria-hidden="true"></div>
    <div class="pond-plants" aria-hidden="true">
      <img class="floating-botanics" src="/art/phase2/pond-botanics.webp" alt="" width="1536" height="1024">
    </div>
    <div class="chapter-side" aria-hidden="true">THE QUIET BEFORE</div>

    <div class="hero-content content-width">
      <div class="eyebrow"><span class="small-star">✦</span> A PERSONAL WORLD, BY</div>
      <h1 id="heroTitle">Kiarash<br><em>Jalali.</em></h1>
      <p class="hero-role">Front-end developer.<br>Computer Engineering student.</p>
      <p class="hero-intro">${esc(copy.hero.lead)}</p>
      <div class="actions">
        <a class="button" href="#projects">Explore my work <span>↗</span></a>
        <a class="text-link" href="#about">A little about me <span>↓</span></a>
      </div>
      <div class="hero-notes">
        <span><i></i>${esc(copy.hero.status)}</span>
        <a href="${profile.github}" target="_blank" rel="noopener">GitHub ↗</a>
        <button data-copy-email type="button">Copy email ↗</button>
      </div>
    </div>

    <div class="pond-caption" aria-hidden="true">
      <span>THE HOWZ</span>
      <i>A small Persian garden.<br>A place to begin.</i>
    </div>
    <div id="parchmentStage" aria-hidden="true"></div>
    <button id="skipIntro" class="skip-intro" type="button" hidden>Skip opening ↘</button>
    <div class="shore" aria-hidden="true"></div>
  </section>`;
