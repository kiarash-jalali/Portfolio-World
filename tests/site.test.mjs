import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {Window} from 'happy-dom';
import {POND_FISH,fishPosition} from '../src/world/pond.js';
import {data} from '../src/world/content.js';
const html=readFileSync('dist/index.html','utf8');
const js=readFileSync('dist/assets/'+readdirSync('dist/assets').find(p=>p.endsWith('.js')),'utf8');
function setup({intro=false,reduced=false}={}){
 const w=new Window({url:intro?'https://example.test/Portfolio-World/':'https://example.test/Portfolio-World/#contact',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
 w.document.write(html);
 w.matchMedia=query=>({matches:query.includes('reduced-motion')&&reduced,media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
 Object.defineProperty(w.document,'fonts',{value:{ready:Promise.resolve()}});
 w.HTMLElement.prototype.animate=function(){return{cancel(){},finished:Promise.resolve()};};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
 w.sessionStorage.setItem('world-intro','seen'); // Old session state must no longer suppress the opening.
 const errors=[];w.addEventListener('error',e=>errors.push(e.error));
 w.eval(js);return {w,d:w.document,errors};
}
test('All content is available as English semantic HTML before JavaScript',()=>{
 const w=new Window();w.document.write(html);const d=w.document;
 assert.equal(d.documentElement.lang,'en');assert.equal(d.querySelectorAll('h1').length,1);
 for(const id of ['home','about','skills','projects','collected-work','ai','lab','contact'])assert.ok(d.getElementById(id),id);
 assert.ok(!/[\u0600-\u06FF]/.test(d.body.textContent));assert.ok(!/\b0[1-9]\s*\//.test(d.body.textContent));assert.equal(d.querySelectorAll('#langBtn,#themeBtn,#motionToggle,.skill-number').length,0);
 for(const p of data.projects)assert.ok(d.body.textContent.includes(p.title));
 for(const a of d.querySelectorAll('a[href^="#"]'))assert.ok(d.querySelector(a.getAttribute('href')),a.outerHTML);
 const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(ids.length,new Set(ids).size);
 w.happyDOM.abort();
});
test('Every local image and script resolves in built output, including nested Pages base',()=>{
 assert.equal(readFileSync('index.html','utf8'),html,'Both Pages routes must publish the same HTML');
 const w=new Window();w.document.write(html);
 for(const el of w.document.querySelectorAll('[src],source[srcset],link[href]')){
  const u=el.getAttribute('src')||el.getAttribute('srcset')||el.getAttribute('href');if(!u||u.startsWith('http')||u.startsWith('data:'))continue;
  assert.ok(!u.startsWith('/'),`Unexpected root-absolute URL: ${u}`);assert.ok(existsSync('dist/'+u.replace(/^\.\//,'')),u);assert.ok(existsSync(u.replace(/^\.\//,'')),`Branch publisher asset: ${u}`);
 }
 w.happyDOM.abort();
});
test('Runtime boot, project dialog content, and scroll lock restoration',async()=>{
 const {w,d,errors}=setup();await new Promise(r=>setTimeout(r,30));
 assert.deepEqual(errors,[]);
 d.querySelector('[data-project="rootine"]').click();
 assert.ok(d.querySelector('#projectDialog').hasAttribute('open'));assert.equal(d.querySelector('#dialogTitle').textContent,'Rootine');assert.match(d.querySelector('#dialogContent').textContent,/authentication/);assert.equal(d.documentElement.style.overflow,'hidden');
 d.querySelector('.dialog-close').click();assert.equal(d.documentElement.style.overflow,'');
 d.querySelector('[data-project="digikala"]').click();assert.equal(d.querySelector('#dialogTitle').textContent,'Digikala Clone');assert.ok(d.querySelector('.dialog-image').src.endsWith('/Portfolio-World/images/digikala.webp'));
 d.querySelector('.dialog-close').click();await w.happyDOM.abort();
});
test('AI tabs, keyboard controls, prompt refinement and reset',async()=>{
 const {w,d}=setup();const tabs=[...d.querySelectorAll('[data-step]')];tabs[2].click();assert.equal(tabs[2].getAttribute('aria-selected'),'true');assert.equal(tabs[0].tabIndex,-1);assert.match(d.querySelector('#stepDetail').textContent,/rename/);
 tabs[2].dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(tabs[3].getAttribute('aria-selected'),'true');
 d.querySelector('#refinePrompt').click();assert.equal(d.querySelector('#promptAfter').textContent,data.promptExamples[0].after);
 d.querySelector('#nextPrompt').click();assert.equal(d.querySelector('#promptBefore').textContent,data.promptExamples[1].before);assert.equal(d.querySelector('#promptAfter').textContent,'A little context changes everything.');await w.happyDOM.abort();
});
test('Exactly one spring cell is selected; arrow keys transfer selection',async()=>{
 const {w,d}=setup();const cells=[...d.querySelectorAll('#springGrid button')];assert.equal(cells.length,100);cells[2].click();assert.equal(d.querySelectorAll('#springGrid [aria-pressed=true]').length,1);assert.equal(cells[2].getAttribute('aria-pressed'),'true');cells[2].dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));assert.equal(cells[12].getAttribute('aria-pressed'),'true');assert.equal(d.querySelectorAll('#springGrid [tabindex="0"]').length,1);await w.happyDOM.abort();
});
test('Menu works and there is no visible motion or theme control',async()=>{
 const {w,d}=setup();const menu=d.querySelector('.menu-toggle');menu.click();assert.equal(menu.getAttribute('aria-expanded'),'true');assert.equal(d.documentElement.style.overflow,'hidden');d.querySelector('#mobileNav a').click();assert.equal(menu.getAttribute('aria-expanded'),'false');assert.equal(d.documentElement.style.overflow,'');assert.equal(d.querySelector('#motionToggle'),null);await w.happyDOM.abort();
});
test('Reduced motion skips the intro and never locks scrolling',async()=>{
 const {w,d}=setup({intro:true,reduced:true});await new Promise(r=>setTimeout(r,30));assert.equal(d.documentElement.style.overflow,'');assert.equal(d.querySelector('#skipIntro').hidden,true);assert.ok(!d.querySelector('#home').classList.contains('intro-running'));await w.happyDOM.abort();
});
test('The opening can always be skipped and restores scroll',async()=>{
 const {w,d}=setup({intro:true});await new Promise(r=>setTimeout(r,800));assert.equal(d.documentElement.style.overflow,'hidden');assert.equal(d.querySelectorAll('.parchment-letter').length,13);d.querySelector('#skipIntro').click();assert.equal(d.documentElement.style.overflow,'');assert.equal(d.querySelector('#skipIntro').hidden,true);assert.equal(d.querySelectorAll('.parchment-letter.afloat').length,13);assert.equal(d.querySelector('#parchmentStage').textContent,'KIARASHJALALI');await w.happyDOM.abort();
});

test('Normal arrival completes, unlocks, and retains every paper even with a previous session flag',async()=>{
 const {w,d}=setup({intro:true});assert.equal(d.documentElement.style.overflow,'hidden');
 await new Promise(r=>setTimeout(r,4900));assert.equal(d.documentElement.style.overflow,'');assert.equal(d.querySelectorAll('.parchment-letter.afloat').length,13);assert.ok(d.querySelector('#home').classList.contains('papers-landed'));await w.happyDOM.abort();
});
test('Two individually authored koi stay in the open water on desktop and mobile',()=>{
 assert.equal(new Set(POND_FISH.map(f=>f.asset)).size,2);
 for(const [w,h] of [[1440,1050],[390,1160]])for(let i=0;i<2;i++)for(let t=0;t<180;t+=.4){const p=fishPosition(t,i,w,h);assert.ok(Number.isFinite(p.angle));assert.ok(p.x>0&&p.x<w);assert.ok(p.y>0&&p.y<h);if(w<701)assert.ok(p.y>h*.65);}
});
test('NPC arrives within the visible habitat instead of waiting almost a minute',async()=>{
 const {w,d}=setup();const habitat=d.querySelector('.npc-habitat');habitat.getBoundingClientRect=()=>({top:250,bottom:420,left:500,right:800,width:300,height:170});
 await new Promise(r=>setTimeout(r,1700));assert.equal(d.querySelector('#gollum').parentElement,habitat);assert.ok(Number(d.querySelector('#gollum').style.opacity)>.5);await w.happyDOM.abort();
});
