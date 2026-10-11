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
  const npc=document.querySelector('#gollum');const ring=npc.querySelector('.npc-ring');const word=npc.querySelector('.npc-word');
  const regions=[document.querySelector('#about'),document.querySelector('#skills')];let elapsed=0;let next=55;let event=0;let timeline;let stolen;let active;
  function restore(){if(stolen){stolen.classList.remove('stolen-word');const p=stolen.parentNode;stolen.replaceWith(...stolen.childNodes);p?.normalize();stolen=null;}word.textContent='';}
  function stop(){timeline?.kill();restore();gsap.set(npc,{opacity:0,x:0,y:0,rotation:0});gsap.set(ring,{opacity:0,x:0,y:0});}
  function chooseWord(region){
    const p=region.querySelector('.about-story p')||region.querySelector('.skill-layout>header>p');if(!p)return null;
    const node=[...p.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.match(/\b[A-Za-z]{5,}\b/));if(!node)return null;
    const match=/\b[A-Za-z]{5,}\b/.exec(node.textContent);const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
    const span=document.createElement('span');range.surroundContents(span);return span;
  }
  function run(region){
    stop();region.append(npc);npc.style.bottom=region.id==='skills'?'100px':'120px';npc.style.left='68%';
    timeline=gsap.timeline({onComplete:stop});timeline.to(npc,{opacity:1,duration:.8}).to(npc,{x:-35,y:-3,duration:2.8,ease:'sine.inOut'});
    if(event++%2===0){
      timeline.to(ring,{opacity:1,duration:.2}).to(npc,{y:-11,rotation:-6,duration:.25,repeat:3,yoyo:true}).to(ring,{x:20,y:17,duration:.6,ease:'bounce.out'}).to(npc,{rotation:6,duration:.12,repeat:5,yoyo:true}).to(npc,{x:65,opacity:0,duration:2});
    }else{
      timeline.call(()=>{stolen=chooseWord(region);if(stolen){word.textContent=stolen.textContent;stolen.classList.add('stolen-word');}}).to(npc,{x:-90,y:-3,duration:3}).to(npc,{opacity:0,duration:.6});
    }
  }
  regions.forEach(region=>region.addEventListener('scenevisibility',e=>{if(!e.detail&&active===region){stop();active=null;}}));
  motion.onChange(stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  addEventListener('resize',stop);
  const timer=setInterval(()=>{
    if(motion.paused||document.hidden)return;
    const region=regions.find(r=>{const b=r.getBoundingClientRect();return b.top<innerHeight*.65&&b.bottom>innerHeight*.4;});
    if(!region){if(active)stop();active=null;return;}
    active=region;elapsed++;
    if(elapsed>=next){elapsed=0;next=matchMedia('(max-width:600px)').matches?110:65+Math.round(Math.random()*45);run(region);}
  },1000);
  return()=>{clearInterval(timer);stop();};
}
