import { data } from './content.js';
const locks = new Set();
let toastTimer;
export function lockScroll(key, on) {
  on ? locks.add(key) : locks.delete(key);
  document.documentElement.style.overflow = locks.size ? 'hidden' : '';
}
export function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
}
export function initNavigation() {
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobileNav');
  function close() { menu.hidden = true; button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', 'Open navigation'); lockScroll('menu', false); }
  button.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; button.setAttribute('aria-expanded', String(open)); button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); lockScroll('menu', open); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { close(); button.focus(); } });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !button.contains(e.target)) close(); });
  const wide = matchMedia('(min-width:821px)'); wide.addEventListener('change', e => { if (e.matches) close(); });
  const rail = document.querySelector('.reading-progress');
  let ticking = false;
  function update() { ticking = false; document.querySelector('#nav').classList.toggle('scrolled', scrollY > 30); const max = document.documentElement.scrollHeight - innerHeight; rail.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
}
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const base = import.meta.env.BASE_URL;
export function initProjects() {
  const dialog = document.querySelector('#projectDialog');
  let opener;
  function close() { dialog.close(); }
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-project]'); if (!button) return;
    const p = data.projects.find(p => p.key === button.dataset.project); if (!p) return;
    opener = button;
    document.querySelector('#dialogContent').innerHTML = `${p.image ? `<img class="dialog-image" src="${base}${p.image.replace('/public/', '')}" alt="${esc(p.title)} interface screenshot">` : '<div class="dialog-rootine" aria-hidden="true">Rootine. ✧</div>'}<article class="dialog-body"><span class="eyebrow">${p.featured ? 'FEATURED / PRIVATE ALPHA' : esc(p.category)}</span><h2 id="dialogTitle">${esc(p.title)}</h2><p>${esc(p.modalDescription)}</p><div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div><h3>What I built / learned</h3><ul>${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul><h3>Why it matters</h3><p>${esc(p.why)}</p><div class="actions"><a class="button" href="${p.live}" target="_blank" rel="noopener">Live project ↗</a><a class="text-link" href="${p.repo}" target="_blank" rel="noopener">Repository ↗</a></div></article>`;
    dialog.showModal(); lockScroll('project', true);
  });
  dialog.querySelector('.dialog-close').addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
  dialog.addEventListener('close', () => { lockScroll('project', false); opener?.focus({ preventScroll: true }); });
}
export function initAI() {
  let index = 0;
  const tabs = [...document.querySelectorAll('[data-step]')];
  function select(button) {
    const step = data.aiSteps.find(s => s.key === button.dataset.step);
    tabs.forEach(t => { const chosen = t === button; t.setAttribute('aria-selected', String(chosen)); t.tabIndex = chosen ? 0 : -1; });
    const panel = document.querySelector('#stepDetail'); panel.setAttribute('aria-labelledby', button.id);
    panel.innerHTML = `<span>${step.number} / ${esc(step.title.toUpperCase())}</span><p>${esc(step.detail)}</p>`;
  }
  tabs.forEach((button, i) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', e => {
      const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (next !== null) { e.preventDefault(); tabs[next].focus(); select(tabs[next]); }
    });
  });
  document.querySelector('#refinePrompt').addEventListener('click', () => { document.querySelector('#promptAfter').textContent = data.promptExamples[index].after; });
  document.querySelector('#nextPrompt').addEventListener('click', () => { index = (index + 1) % data.promptExamples.length; document.querySelector('#promptBefore').textContent = data.promptExamples[index].before; document.querySelector('#promptAfter').textContent = 'A little context changes everything.'; });
}
export function buildMailto({ name, email, message }) {
  return `mailto:${data.profile.email}?subject=${encodeURIComponent(`Hello from ${name.trim()}`)}&body=${encodeURIComponent(`${message.trim()}\n\nFrom: ${name.trim()}\nEmail: ${email.trim()}`)}`;
}
export function initContact() {
  document.querySelector('[data-copy-email]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(data.profile.email); toast('Email copied. Say hello whenever you like.'); }
    catch { toast(data.profile.email); }
  });
  document.querySelector('#contactForm').addEventListener('submit', e => {
    e.preventDefault(); const form = e.currentTarget; if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    location.href = buildMailto(values); toast('Your email draft is ready in your email app.');
  });
}
