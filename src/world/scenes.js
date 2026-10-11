import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export const themes = {
  pond: { bg:'rgba(12,43,41,0.94)', fg:'#eee6cd', line:'rgba(223,216,182,0.23)' },
  shire: { bg:'rgba(28,48,38,0.94)', fg:'#eee6cd', line:'rgba(223,216,182,0.23)' },
  city: { bg:'rgba(222,225,207,0.95)', fg:'#2d453e', line:'rgba(46,69,54,0.24)' },
  tree: { bg:'rgba(17,32,43,0.94)', fg:'#e8d5ab', line:'rgba(223,195,142,0.25)' },
  glass: { bg:'rgba(18,27,24,0.95)', fg:'#e8d5ab', line:'rgba(223,195,142,0.25)' },
  atlas: { bg:'rgba(228,221,195,0.96)', fg:'#35483b', line:'rgba(46,69,54,0.24)' }
};
export function createMotionState() {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new Set(); let chosen;
  try { chosen = localStorage.getItem('world-motion'); } catch {}
  let paused = media.matches || chosen === 'paused';
  const button = document.querySelector('#motionToggle');
  function sync() {
    document.documentElement.classList.toggle('motion-paused', paused);
    button.setAttribute('aria-pressed', String(paused)); button.setAttribute('aria-label', paused ? 'Resume atmospheric motion' : 'Pause atmospheric motion'); button.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    listeners.forEach(fn => fn(paused));
  }
  button.addEventListener('click', () => { paused = !paused; try { localStorage.setItem('world-motion', paused ? 'paused' : 'playing'); } catch {} sync(); });
  media.addEventListener('change', e => { paused = e.matches; sync(); });
  document.addEventListener('visibilitychange', () => { document.documentElement.classList.toggle('page-hidden', document.hidden); });
  sync();
  return { get paused() { return paused; }, onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); } };
}
export function initScenes(motion) {
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const observer = new IntersectionObserver(entries => { entries.forEach(({target,isIntersecting}) => { target.classList.toggle('scene-active', isIntersecting); target.dispatchEvent(new CustomEvent('scenevisibility', { detail:isIntersecting })); }); }, { rootMargin:'0px', threshold:0 });
  scenes.forEach(scene => observer.observe(scene));
  const loader = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if (!isIntersecting) return;
    if (target.dataset.scene === 'glass') target.style.setProperty('--glass-image', `url("${import.meta.env.BASE_URL}art/glass.webp")`);
    target.querySelectorAll('img[loading=lazy]').forEach(img => { img.loading = 'eager'; img.decode?.().catch(() => {}); });
    loader.unobserve(target);
  }), { rootMargin:'800px 0px' });
  scenes.forEach(scene => loader.observe(scene));
  let currentTheme;
  const themed = [...document.querySelectorAll('[data-theme]')];
  function activate(section) {
    const key = section.dataset.theme;
    if (key !== currentTheme) {
      currentTheme = key; const t = themes[key];
      gsap.to(document.documentElement, { '--nav-bg':t.bg, '--nav-fg':t.fg, '--nav-line':t.line, duration:motion.paused ? 0 : .7, overwrite:true });
    }
    const id = section.id === 'collected-work' ? 'projects' : section.id === 'atlas' ? 'ai' : section.id;
    document.querySelectorAll('.navigation nav a').forEach(a => { a.hash === `#${id}` ? a.setAttribute('aria-current','location') : a.removeAttribute('aria-current'); });
  }
  themed.forEach(section => ScrollTrigger.create({ trigger:section, start:'top 100px', end:'bottom 100px', onEnter:() => activate(section), onEnterBack:() => activate(section) }));
  activate(themed[0]);
  let context;
  function choreograph() {
    context?.revert();
    context = gsap.context(() => {
      if (motion.paused) return;
      const mobile = matchMedia('(max-width:600px)').matches;
      gsap.timeline({ scrollTrigger:{ trigger:'#atlas', start:'top top', end:'bottom bottom', scrub:.45, invalidateOnRefresh:true } })
        .fromTo('.paper-mountains',{rotateX:mobile ? -55 : -82,y:40,opacity:.35},{rotateX:0,y:0,opacity:1,duration:.4,ease:'none'},0)
        .fromTo('.paper-wall',{rotateX:mobile ? -65 : -89,opacity:.1},{rotateX:0,opacity:1,duration:.45,ease:'none'},.2)
        .fromTo('.paper-snow',{rotateX:-45,y:35},{rotateX:0,y:0,duration:.35,ease:'none'},.55)
        .fromTo('.atlas-map',{scale:1.06,opacity:.8},{scale:1,opacity:.45,duration:1,ease:'none'},0);
      gsap.to('.pond-caption', { y:-25, opacity:.2, ease:'none',scrollTrigger:{trigger:'#home',start:'70% top',end:'bottom top',scrub:true} });
      if (!mobile) {
        gsap.fromTo('.city-art img',{y:-15},{y:25,ease:'none',scrollTrigger:{trigger:'#skills',start:'top bottom',end:'bottom top',scrub:true}});
        gsap.fromTo('.tree-light',{opacity:.3},{opacity:1,ease:'none',scrollTrigger:{trigger:'#projects',start:'top bottom',end:'center center',scrub:true}});
      }
    });
    ScrollTrigger.refresh();
  }
  choreograph(); motion.onChange(choreograph);
  const mobile = matchMedia('(max-width:600px)'); mobile.addEventListener('change', choreograph);
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh(), { once:true });
  return () => { observer.disconnect(); loader.disconnect(); context?.revert(); };
}
