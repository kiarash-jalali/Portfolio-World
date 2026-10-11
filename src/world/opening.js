import { gsap } from 'gsap';
import { lockScroll } from './ui.js';
export async function initOpening(motion) {
  let seen = false;
  try { seen = sessionStorage.getItem('world-intro') === 'seen'; } catch {}
  if (seen || motion.paused || (location.hash && location.hash !== '#home') || scrollY > 100) return;
  const hero = document.querySelector('#home'); const stage = document.querySelector('#parchmentStage'); const skip = document.querySelector('#skipIntro');
  const image = hero.querySelector('.scene-art img');
  await Promise.race([image.decode?.().catch(() => {}), new Promise(resolve => setTimeout(resolve,700))]);
  if (motion.paused || scrollY > 100) return;
  let finished = false; let timer; let timeline;
  function finish() {
    if (finished) return; finished = true; clearTimeout(timer); timeline?.kill();
    lockScroll('intro',false); hero.classList.remove('intro-running'); skip.hidden = true;
    gsap.to(stage.children,{opacity:0,duration:.6,onComplete:() => stage.replaceChildren()});
    try { sessionStorage.setItem('world-intro','seen'); } catch {}
  }
  skip.hidden = false; skip.addEventListener('click',finish,{once:true});
  document.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); });
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click',finish,{once:true}));
  motion.onChange(paused => { if(paused) finish(); });
  addEventListener('resize',finish,{once:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
  lockScroll('intro',true);hero.classList.add('intro-running');timer=setTimeout(finish,4500);
  const width=hero.clientWidth; const mobile=width<601; const chars='KIARASH JALALI';
  const letterW=mobile?25:Math.min(56,width*.039); const total=chars.length*letterW; const start=(width-total)/2;
  const y=mobile?250:Math.min(innerHeight*.4,370);
  let index=0;
  const items=[...chars].flatMap((char,i)=>{
    if(char===' ')return[];
    const el=document.createElement('span');el.className='parchment-letter';el.textContent=char;el.style.left=`${start+i*letterW}px`;el.style.top=`${y}px`;stage.append(el);
    return[{el,i:index++}];
  });
  timeline=gsap.timeline({onComplete:finish});
  items.forEach(({el,i})=>{
    const delay=.75+i*.055; const drift=(i-6)*(mobile?7:24);const drop=mobile?180+(i%3)*27:220+(i%4)*35;
    timeline.fromTo(el,{opacity:0,scale:.9,rotate:0,backgroundColor:'transparent'},{opacity:1,scale:1,duration:.35},.08);
    timeline.to(el,{y:drop,x:drift,rotation:(i%2?1:-1)*(8+i*2),rotateX:45+(i%3)*12,duration:1.25,ease:'power2.in'},delay);
    timeline.call(()=>{
      const ring=document.createElement('i');ring.className='paper-ripple';ring.style.left=`${start+(i+(i>6?1:0))*letterW+drift}px`;ring.style.top=`${y+drop+18}px`;stage.append(ring);gsap.fromTo(ring,{scale:.4,opacity:.65},{scale:3.6,opacity:0,duration:1.3,onComplete:()=>ring.remove()});
    },[],delay+1.15);
    timeline.to(el,{y:drop+12+(i%3)*7,x:drift+14,rotation:(i%2?1:-1)*(18+i*2),opacity:i%3===0?.13:.6,scale:i%3===0?.78:.96,filter:'brightness(.65)',duration:.8,ease:'sine.out'},delay+1.25);
  });
  timeline.to({}, {duration:.35});
}
