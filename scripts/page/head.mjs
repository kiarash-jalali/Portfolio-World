import { html } from './html.mjs';

const TITLE = 'Kiarash Jalali — A world in the making';
const DESCRIPTION =
  'Enter the illustrated world of Kiarash Jalali. Front-end development, personal projects, small experiments, and a little imagination.';

/** The experimental site stays out of search engines (noindex) until it replaces production. */
export const head = () => html`
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="${DESCRIPTION}">
    <meta name="theme-color" content="#163f3b">
    <meta name="robots" content="noindex,nofollow">
    <meta property="og:title" content="${TITLE}">
    <meta property="og:description" content="An illustrated journey through my work, ideas and experiments.">
    <title>${TITLE}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preload" as="image" href="/art/phase2/pond-bottom.webp" media="(min-width:701px)" fetchpriority="high">
    <link rel="preload" as="image" href="/art/phase2/pond-mobile.webp" media="(max-width:700px)" fetchpriority="high">
    <link rel="stylesheet" href="/src/world/styles/index.css">
  </head>`;

/** Without JavaScript the page is still complete; only motion and experiments are missing. */
export const noscript = () => html`
  <noscript>
    <style>.glass-world{--glass-image:url('/art/phase2/glass-triptych.webp')}.letter-form{display:none}</style>
    <p class="noscript-note">The illustrated portfolio is ready to explore. Enable JavaScript for animations and interactive experiments.</p>
  </noscript>`;
