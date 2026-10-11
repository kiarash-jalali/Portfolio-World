/** Layered painted water: refraction, surface normals, articulated koi and impact waves. */
export const POND_FISH = [
  {asset:'koi-coral.webp',phase:0.4,period:62,size:182},
  {asset:'koi-gold.webp',phase:3.1,period:79,size:156}
];
const vertex=`attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision highp float;
varying vec2 uv; uniform sampler2D painting; uniform sampler2D fish;
uniform vec2 resolution; uniform vec2 imageSize; uniform float time; uniform vec4 impacts[16];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float field(vec2 p){return noise(p)*.55+noise(p*2.03+7.)*.29+noise(p*4.1)*.16;}
vec2 cover(vec2 p){float a=resolution.x/resolution.y,b=imageSize.x/imageSize.y;if(a<b)p.x=(p.x-.5)*a/b+.5;else p.y=(p.y-.5)*b/a+.5;return p;}
void main(){
 vec2 p=uv*vec2(resolution.x/resolution.y,1.);float t=time*.035;
 float h=field(p*5.+vec2(t,-t*.6));
 vec2 normal=vec2(field(p*5.+vec2(.025,0)+vec2(t,-t*.6))-h,field(p*5.+vec2(0,.025)+vec2(t,-t*.6))-h);
 float shimmer=0.;
 for(int i=0;i<16;i++){
  float age=time-impacts[i].z;vec2 diff=(uv-impacts[i].xy)*vec2(resolution.x/resolution.y,1.);
  float d=length(diff),front=age*.055;
  float envelope=exp(-abs(d-front)*85.)*exp(-age*.72)*step(0.,age)*step(age,6.)*impacts[i].w;
  float wave=sin((d-front)*140.)*envelope;
  normal+=normalize(diff+vec2(.0001))*wave*.025;shimmer+=wave*.065;
 }
 float wet=1.-smoothstep(.86,.98,uv.x);vec2 displacement=normal*.065*wet;
 vec2 art=clamp(cover(uv+displacement),.001,.999);
 vec3 base=texture2D(painting,art).rgb;
 vec4 koi=texture2D(fish,clamp(uv+displacement*1.9,.001,.999));
 base=mix(base,koi.rgb*vec3(.82,.95,.91),koi.a*.91);
 float caustic=pow(1.-abs(sin(field(p*14.+vec2(t*.8,-t))*10.+field(p*9.-t)*5.)),18.);
 float depth=smoothstep(.25,.8,uv.x)*(.35+.65*(1.-uv.y));
 base+=vec3(.48,.81,.73)*caustic*.06*depth*wet;
 base+=vec3(.35,.65,.63)*shimmer;
 float reflection=sin(p.y*31.+h*5.+time*.22)*sin(p.x*13.-time*.08);
 base+=vec3(.16,.32,.29)*reflection*.028*wet;
 gl_FragColor=vec4(base,1.);
}`;
export function fishPosition(time,index,width,height){
 const f=POND_FISH[index],a=time*Math.PI*2/f.period+f.phase,mobile=width<701;
 const x=mobile ? .47+Math.cos(a)*.26 : .66+Math.cos(a)*.15+Math.sin(a*2)*.025;
 const y=mobile ? .77+Math.sin(a)*.095 : .57+Math.sin(a)*.23;
 const dx=mobile ? -Math.sin(a)*.26 : -Math.sin(a)*.15+Math.cos(a*2)*.05;
 const dy=Math.cos(a)*(mobile?.095:.23);
 return {x:x*width,y:y*height,angle:Math.atan2(dy*height,dx*width),width:mobile?f.size*.66:f.size};
}
export function initPond(motion){
 const host=document.querySelector('#home'),canvas=document.querySelector('#pondWater');
 let gl,program,frame=0,ready=false,visible=true,elapsed=0,last=0,impactIndex=0,failed=false;
 const impacts=new Float32Array(64);for(let i=0;i<16;i++)impacts[i*4+2]=-100;
 const fishCanvas=document.createElement('canvas');let ctx;
 const fishImages=[];let bg;const textures=[];let uniforms={};
 const api={impact(x,y){const o=(impactIndex++%16)*4;impacts[o]=x;impacts[o+1]=1-y;impacts[o+2]=elapsed;impacts[o+3]=1;}};
 function fallback(){failed=true;ready=false;cancelAnimationFrame(frame);frame=0;host.classList.remove('water-ready');canvas.hidden=true;}
 function load(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});}
 function compile(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error('Water shader failed');return sh;}
 function upload(unit,source){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[unit]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);}
 function resize(){if(!ready)return;const w=host.clientWidth,h=host.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);fishCanvas.width=canvas.width;fishCanvas.height=canvas.height;gl.viewport(0,0,canvas.width,canvas.height);draw();}
 function drawFish(){
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);ctx.clearRect(0,0,w,h);
  fishImages.forEach((image,i)=>{
   const pos=fishPosition(elapsed,i,w,h),fw=pos.width,fh=fw*image.height/image.width;
   ctx.save();ctx.translate(pos.x,pos.y);ctx.rotate(pos.angle);ctx.globalAlpha=.92;
   // The head leads; tail amplitude grows smoothly down the spine. Overlapping strips avoid seams.
   const strips=56,sw=image.width/strips,dw=fw/strips;
   for(let n=0;n<strips;n++){
    const u=n/(strips-1),bend=Math.sin(elapsed*2.5+u*5.4+i)*Math.pow(1-u,2)*fw*.055;
    ctx.drawImage(image,n*sw,0,Math.min(sw+1,image.width-n*sw),image.height,-fw/2+n*dw,-fh/2+bend,dw+.65,fh);
   }
   ctx.restore();
  });upload(1,fishCanvas);
 }
 function draw(){if(!ready)return;drawFish();gl.useProgram(program);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform2f(uniforms.imageSize,bg.width,bg.height);gl.uniform1f(uniforms.time,elapsed);gl.uniform4fv(uniforms.impacts,impacts);gl.drawArrays(gl.TRIANGLES,0,6);}
 function tick(now){frame=0;if(!ready||!visible||document.hidden||motion.paused)return;elapsed+=Math.min((now-(last||now))/1000,.05);last=now;draw();frame=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(ready){draw();if(visible&&!document.hidden&&!motion.paused)frame=requestAnimationFrame(tick);}}
 async function start(){
  try{
   gl=canvas.getContext('webgl',{alpha:false,antialias:true,premultipliedAlpha:false});ctx=fishCanvas.getContext('2d');if(!gl||!ctx)return fallback();
   program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Water program failed');gl.useProgram(program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
   for(const name of ['resolution','imageSize','time','impacts'])uniforms[name]=gl.getUniformLocation(program,name==='impacts'?'impacts[0]':name);
   for(let i=0;i<2;i++){textures[i]=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,textures[i]);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
   gl.uniform1i(gl.getUniformLocation(program,'painting'),0);gl.uniform1i(gl.getUniformLocation(program,'fish'),1);
   const base=import.meta.env.BASE_URL+'art/phase2/';
   const loaded=await Promise.all([load(base+(host.clientWidth<701?'pond-mobile.webp':'pond-bottom.webp')),...POND_FISH.map(f=>load(base+f.asset))]);
   bg=loaded[0];fishImages.push(...loaded.slice(1));upload(0,bg);ready=true;canvas.hidden=false;resize();host.classList.add('water-ready');sync();
   matchMedia('(max-width:700px)').addEventListener('change',async e=>{try{bg=await load(base+(e.matches?'pond-mobile.webp':'pond-bottom.webp'));upload(0,bg);resize();}catch{fallback();}});
  }catch{fallback();}
 }
 // Decorative rendering can fail without affecting content, navigation, or scroll unlocking.
 start();new ResizeObserver(resize).observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(host);
 motion.onChange(sync);document.addEventListener('visibilitychange',sync);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
 api.dispose=()=>{cancelAnimationFrame(frame);if(!failed)textures.forEach(t=>gl?.deleteTexture(t));};return api;
}
