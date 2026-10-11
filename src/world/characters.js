import { gsap } from 'gsap';
export function initDoor(motion) {
  const button=document.querySelector('#hobbitDoor');const hobbit=document.querySelector('.hobbit');const status=document.querySelector('#doorStatus');let busy=false;let tl;
  const section=document.querySelector('#about'), art=section.querySelector('.scene-art img'), surround=button.parentElement;
  section.append(surround);
  function placeDoor(){
    const scene=section.getBoundingClientRect(), rect=art.getBoundingClientRect();
    if(!art.naturalWidth||!rect.width)return;
    const scale=Math.max(rect.width/art.naturalWidth,rect.height/art.naturalHeight);
    const w=art.naturalWidth*scale,h=art.naturalHeight*scale;
    surround.style.left=(rect.left-scene.left+(rect.width-w)*.47+w*.47)+'px';
    surround.style.top=(rect.top-scene.top+(rect.height-h)*.5+h*.527)+'px';
    surround.style.width=w*.08+'px';surround.style.height=h*.153+'px';
  }
  art.addEventListener('load',placeDoor);new ResizeObserver(placeDoor).observe(section);placeDoor();
  function reset(){tl?.kill();gsap.set(button,{rotateY:0});gsap.set(hobbit,{opacity:0,y:12,rotation:0});hobbit.classList.remove('waving');button.disabled=false;busy=false;}
  button.addEventListener('click',()=>{
    if(busy)return;busy=true;button.disabled=true;status.textContent='A friendly little resident opens the door and waves hello.';
    if(motion.paused){gsap.set(button,{rotateY:-72});gsap.set(hobbit,{opacity:1,y:0});setTimeout(reset,2200);return;}
    tl=gsap.timeline({onComplete:()=>{reset();status.textContent='The resident has gone back inside.';}})
      .to(button,{rotateY:-78,duration:.6,ease:'power2.inOut'})
      .to(hobbit,{opacity:1,y:0,duration:.45},.4)
      .call(()=>hobbit.classList.add('waving'),[],.85)
      .to(hobbit,{rotation:3,duration:.22,repeat:4,yoyo:true,ease:'sine.inOut'},.95)
      .call(()=>hobbit.classList.remove('waving'),[],2.3)
      .to(hobbit,{opacity:0,y:13,duration:.4},2.45)
      .to(button,{rotateY:0,duration:.55,ease:'power2.inOut'},2.85);
  });
  motion.onChange(reset);
  document.querySelector('#about').addEventListener('scenevisibility',e=>{if(!e.detail)reset();});
}
export function initGollum(motion) {
  const npc=document.querySelector('#gollum'),ring=npc.querySelector('.npc-ring'),word=npc.querySelector('.npc-word');
  const habitats=[...document.querySelectorAll('.npc-habitat')];
  let active=null,elapsed=0,nextWalk=3,nextEvent=21,event=0,timeline,stolen;
  function restore(){if(stolen){const parent=stolen.parentNode;stolen.replaceWith(...stolen.childNodes);parent?.normalize();stolen=null;}word.textContent='';}
  function reset(){timeline?.kill();restore();npc.dataset.pose='idle';gsap.set(ring,{opacity:0,x:0,y:0});}
  function chooseWord(region){
    const p=region.querySelector('.about-story p')||region.querySelector('.skill-layout>header>p');if(!p)return;
    const node=[...p.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&/\b[A-Za-z]{5,}\b/.test(n.textContent));if(!node)return;
    const match=/\b[A-Za-z]{5,}\b/.exec(node.textContent),range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
    const span=document.createElement('span');range.surroundContents(span);return span;
  }
  function arrive(habitat){reset();active=habitat;habitat.append(npc);elapsed=0;nextWalk=3;nextEvent=21;gsap.set(npc,{x:0,y:0,rotation:0,opacity:0});gsap.to(npc,{opacity:1,duration:motion.paused?0:.7,delay:motion.paused?0:.6});}
  function walk(){
    if(!active)return;reset();npc.dataset.pose='sneak';
    const width=Math.max(0,active.clientWidth-npc.clientWidth),target=Math.min(width,(event%2?.25:.72)*width);
    timeline=gsap.timeline({onComplete:()=>npc.dataset.pose='idle'}).to(npc,{x:target,duration:4.8,ease:'sine.inOut'});
  }
  function special(){
    reset();const kind=event++%3;
    if(kind===0){npc.dataset.pose='ring';timeline=gsap.timeline({onComplete:reset}).to(ring,{opacity:1,duration:.3}).to(npc,{y:-9,duration:.23,repeat:3,yoyo:true}).to(ring,{x:28,y:26,duration:.8,ease:'bounce.out'}).to(npc,{rotation:7,duration:.16,repeat:5,yoyo:true}).to(npc,{rotation:0,y:0,duration:.5}).to({}, {duration:1.4});}
    else if(kind===1){stolen=chooseWord(active.closest('section'));if(stolen){word.textContent=stolen.textContent;stolen.classList.add('stolen-word');}npc.dataset.pose='sneak';timeline=gsap.timeline({onComplete:reset}).to(npc,{x:0,duration:3.8,ease:'sine.inOut'}).to({}, {duration:1.5});}
    else{npc.dataset.pose='sleep';timeline=gsap.timeline({onComplete:reset}).to(npc,{rotation:-8,y:5,duration:.8}).to({}, {duration:5}).to(npc,{rotation:0,y:0,duration:.8});}
  }
  const timer=setInterval(()=>{
    if(document.hidden)return;
    const habitat=habitats.find(h=>{const r=h.getBoundingClientRect();return r.top<innerHeight*.94&&r.bottom>95;});
    if(!habitat){if(active){reset();gsap.set(npc,{opacity:0});active=null;}return;}
    if(habitat!==active)arrive(habitat);
    if(motion.paused)return;elapsed+=.25;
    if(elapsed>=nextEvent){nextEvent=elapsed+37;nextWalk=elapsed+12;special();}
    else if(elapsed>=nextWalk){nextWalk=elapsed+10;walk();}
  },250);
  motion.onChange(()=>{reset();if(active)gsap.set(npc,{opacity:1,rotation:0,y:0});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});addEventListener('resize',reset);
  return()=>{clearInterval(timer);reset();};
}
