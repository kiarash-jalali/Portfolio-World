import { data } from '../content.js';
import { escapeHtml as esc } from '../core/html.js';
import { lockScroll } from '../core/scroll-lock.js';

const BASE = import.meta.env.BASE_URL;

function preview(project) {
  if (!project.image) return '<div class="dialog-rootine" aria-hidden="true">Rootine. ✧</div>';
  const src = BASE + project.image.replace('/public/', '');
  return `<img class="dialog-image" src="${src}" alt="${esc(project.title)} interface screenshot">`;
}

function details(project) {
  const label = project.featured ? 'FEATURED / PRIVATE ALPHA' : esc(project.category);
  const tags = project.tags.map((tag) => `<span>${esc(tag)}</span>`).join('');
  const features = project.features.map((feature) => `<li>${esc(feature)}</li>`).join('');
  return `
    <article class="dialog-body">
      <span class="eyebrow">${label}</span>
      <h2 id="dialogTitle">${esc(project.title)}</h2>
      <p>${esc(project.modalDescription)}</p>
      <div class="tags">${tags}</div>
      <h3>What I built / learned</h3>
      <ul>${features}</ul>
      <h3>Why it matters</h3>
      <p>${esc(project.why)}</p>
      <div class="actions">
        <a class="button" href="${project.live}" target="_blank" rel="noopener">Live project ↗</a>
        <a class="text-link" href="${project.repo}" target="_blank" rel="noopener">Repository ↗</a>
      </div>
    </article>`;
}

/** Any element with `data-project="<key>"` opens that project's details. */
export function initProjectDialog() {
  const dialog = document.querySelector('#projectDialog');
  const content = document.querySelector('#dialogContent');
  let opener;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-project]');
    if (!button) return;
    const project = data.projects.find((p) => p.key === button.dataset.project);
    if (!project) return;

    opener = button;
    content.innerHTML = preview(project) + details(project);
    dialog.showModal();
    lockScroll('project', true);
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

  // A click on the backdrop (outside the dialog box) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;
    if (outside) dialog.close();
  });

  dialog.addEventListener('close', () => {
    lockScroll('project', false);
    opener?.focus({ preventScroll: true });
  });
}
