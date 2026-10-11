import {gsap} from 'gsap';
import {lockScroll} from './ui.js';
export const LETTERS='KIARASHJALALI';
// Thirteen persistent pieces, with individually authored positions in the open water.
const berths=[[.57,.39],[.68,.43],[.78,.37],[.63,.54],[.83,.56],[.72,.64],[.53,.68],[.84,.73],[.60,.80],[.76,.83],[.48,.49],[.72,.32],[.88,.46]];
export function initOpening(motion,pond={impact(){}}){
 const hero=document.querySelector('#home'),stage=document.querySelector('#parchmentStage'),skip=document.querySelector('#skipIntro');
 let tl,timer,running=false,items=[];
 function positions(i){const mobile=hero.clientWidth<701,[x,y]=berths[i];return{x:(mobile?.14+(x-.48)*1.58:x)*hero.clientWidth,y:(mobile?.68+(y-.32)*.39:y)*hero.clientHeight};}
 function make(){
  stage.replaceChildren();items=[...LETTERS].map((char,i)=>{
   const el=document.createElement('span');el.className='parchment-letter';el.dataset.letter=char;el.style.setProperty('--drift',(i%2?-1:1)*(8+i%4*3)+'px');el.style.setProperty('--float-time',(13+i%5*3)+'s');el.style.setProperty('--float-delay',(-i*1.3)+'s');
   const paper=document.createElement('span');paper.className='paper-face';paper.textContent=char;el.append(paper);stage.append(el);return{el,paper,i};
  });
 }
 function settle(){
  items.forEach(({el,i})=>{const p=positions(i);gsap.set(el,{x:p.x,y:p.y,rotation:(i%2?1:-1)*(12+i*5),rotateX:48+(i%3)*8,scale:i%4===0?.84:1,opacity:i%4===0?.58:.94});el.classList.add('afloat');el.classList.toggle('waterlogged',i%4===0);});
  hero.classList.add('papers-landed');
 }
 function finish(){
  clearTimeout(timer);tl?.kill();running=false;lockScroll('intro',false);hero.classList.remove('intro-running');skip.hidden=true;settle();
 }
 function play(){
  if(running)return;make();
  const bypass=motion.paused||scrollY>80||(location.hash&&location.hash!=='#home');
  if(bypass){finish();return;}
  running=true;hero.classList.remove('papers-landed');hero.classList.add('intro-running');lockScroll('intro',true);skip.hidden=false;
  // Independent watchdog survives timeline errors and image failures.
  timer=setTimeout(finish,4800);
  const w=hero.clientWidth,h=hero.clientHeight,mobile=w<701,step=mobile?23:48,total=step*14,start=(w-total)/2;
  tl=gsap.timeline({onComplete:finish});
  items.forEach(({el,i})=>{
   const berth=positions(i),initialX=start+(i+(i>6?1:0))*step,initialY=mobile?Math.min(280,h*.28):h*.31;
   gsap.set(el,{x:initialX,y:initialY,rotation:0,rotateX:0,opacity:0});
   tl.to(el,{opacity:1,duration:.35},.12+i*.022)
    .to(el,{x:berth.x+(i%2?18:-14),y:berth.y-24,rotation:(i%2?1:-1)*(20+i*4),rotateX:35,duration:1.35,ease:'power2.in'},1.05+i*.045)
    .call(()=>{pond.impact(berth.x/w,berth.y/h);el.classList.add('landed');},[],2.4+i*.045)
    .to(el,{x:berth.x,y:berth.y,rotateX:48+(i%3)*8,rotation:(i%2?1:-1)*(12+i*5),opacity:i%4===0?.58:.94,scale:i%4===0?.84:1,duration:.85,ease:'sine.out'},2.4+i*.045);
  });tl.to({}, {duration:.35});
 }
 skip.addEventListener('click',finish);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&running)finish();});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(running)finish();}));
 motion.onChange(()=>{if(running)finish();else settle();});
 addEventListener('resize',()=>{if(running)finish();else settle();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)finish();});
 // A new document at the top always replays. Restoring the tab from bfcache does too.
 addEventListener('pageshow',e=>{if(e.persisted&&scrollY<80)play();});
 play();return{finish,replay:play,get running(){return running;}};
}
