// Generates the source index.html from src/world/content.js and the chapter templates in ./page.
// Edit the templates, not index.html: this script overwrites it before every dev run and build.
import { writeFile } from 'node:fs/promises';
import { data } from '../src/world/content.js';
import { html } from './page/html.mjs';
import { head, noscript } from './page/head.mjs';
import { skipLink, navigation, mobileNavigation } from './page/navigation.mjs';
import { pond } from './page/pond.mjs';
import { shire } from './page/shire.mjs';
import { city } from './page/city.mjs';
import { projects } from './page/projects.mjs';
import { glass } from './page/glass.mjs';
import { atlas } from './page/atlas.mjs';
import { ai } from './page/ai.mjs';
import { lab } from './page/lab.mjs';
import { contact } from './page/contact.mjs';

/** The project dialog and toast are filled in by script (see src/world/dialogs). */
const overlays = () => html`
  <dialog id="projectDialog" class="project-dialog" aria-labelledby="dialogTitle">
    <button class="dialog-close" type="button" aria-label="Close project details">×</button>
    <div id="dialogContent"></div>
  </dialog>
  <div class="toast" id="toast" role="status"></div>`;

// Top-level blocks stay on their own lines so the generated file is easy to scan.
const page = [
  '<!doctype html>',
  '<html lang="en">',
  head(),
  `<body>${noscript()}`,
  skipLink(),
  navigation(),
  mobileNavigation(),
  '<main id="main">',
  pond(data),
  shire(data),
  city(data),
  projects(data),
  glass(data),
  atlas(data),
  ai(data),
  lab(data),
  contact(data),
  '</main>',
  `${overlays()}<script type="module" src="/src/world/main.js"></script>`,
  '</body></html>',
].join('\n');

await writeFile(new URL('../index.html', import.meta.url), page);
