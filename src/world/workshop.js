export function initWorkshop(motion) {
  const grid=document.querySelector('#springGrid');const cells=[...grid.children];
  function select(index){cells.forEach((cell,i)=>{cell.setAttribute('aria-pressed',String(i===index));cell.tabIndex=i===index?0:-1;});
    if(!motion.paused)cells.forEach((cell,i)=>{const d=Math.hypot(i%10-index%10,Math.floor(i/10)-Math.floor(index/10));if(d>3||i===index)return;cell.animate([{transform:'scale(1)'},{transform:'scale(.76)'},{transform:'scale(1)'}],{duration:500,delay:d*40,easing:'cubic-bezier(.2,.8,.3,1)'});});
  }
  grid.addEventListener('click',e=>{const i=cells.indexOf(e.target);if(i>=0)select(i);});
  grid.addEventListener('keydown',e=>{let i=cells.indexOf(e.target);if(i<0)return;const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-10,ArrowDown:10}[e.key];if(delta!==undefined){e.preventDefault();i=Math.max(0,Math.min(99,i+delta));select(i);cells[i].focus();}});
  const stage=document.querySelector('#inkStage'),stone=document.querySelector('#inkstone');let x=0,y=0,vx=0,vy=0,drag=false,last,frame=0,visible=false;
  const limit=(n,max)=>Math.max(-max,Math.min(max,n));
  function bounds(){return{x:Math.max(0,stage.clientWidth/2-53),y:Math.max(0,stage.clientHeight/2-63)};}
  function draw(){stone.style.transform=`translate(${x}px,${y}px) scale(${1+Math.min(.14,Math.abs(vx)*.001)},${1-Math.min(.1,Math.abs(vx)*.0007)}) rotate(${limit(vx*.03,12)}deg)`;}
  function wake(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function tick(){frame=0;if(!visible||document.hidden)return;if(!drag){vx=(-x*.035+vx)*.82;vy=(-y*.035+vy)*.82;x+=vx;y+=vy;const b=bounds();x=limit(x,b.x);y=limit(y,b.y);draw();if(Math.abs(x)+Math.abs(y)+Math.abs(vx)+Math.abs(vy)<.15){x=y=vx=vy=0;draw();return;}}if(!drag)wake();}
  stone.addEventListener('pointerdown',e=>{drag=true;last={x:e.clientX,y:e.clientY};stone.setPointerCapture(e.pointerId);stone.style.cursor='grabbing';});
  stone.addEventListener('pointermove',e=>{if(!drag)return;const b=bounds();vx=e.clientX-last.x;vy=e.clientY-last.y;x=limit(x+vx,b.x);y=limit(y+vy,b.y);last={x:e.clientX,y:e.clientY};draw();});
  function release(){drag=false;stone.style.cursor='grab';if(motion.paused){x=y=vx=vy=0;draw();}else wake();}
  stone.addEventListener('pointerup',release);stone.addEventListener('pointercancel',release);stone.addEventListener('lostpointercapture',()=>{if(drag)release();});
  stone.addEventListener('keydown',e=>{const delta={ArrowLeft:[-30,0],ArrowRight:[30,0],ArrowUp:[0,-30],ArrowDown:[0,30]}[e.key];if(delta){e.preventDefault();const b=bounds();x=limit(x+delta[0],b.x);y=limit(y+delta[1],b.y);draw();}if(e.code==='Space'){e.preventDefault();release();}});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();});
  motion.onChange(()=>{x=y=vx=vy=0;draw();});
  new ResizeObserver(()=>{const b=bounds();x=limit(x,b.x);y=limit(y,b.y);draw();}).observe(stage);
}
