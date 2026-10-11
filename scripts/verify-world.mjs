import {readFile,access,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for(const file of ['phase2/pond-bottom.webp','phase2/pond-mobile.webp','phase2/koi-coral.webp','phase2/koi-gold.webp','shire.webp','phase2/minas-tirith.webp','phase2/erdtree.webp','phase2/erdtree-mobile.webp','phase2/glass-triptych.webp','atlas.webp','phase2/terrain.webp','phase2/wall.webp','phase2/snow-foreground.webp','phase2/hobbit-strip.webp','phase2/gollum-strip.webp'])await access(`public/art/${file}`);
for(const path of ['CNAME','public/CNAME']){try{await access(path);throw new Error('Production domain must not be attached to Portfolio-World');}catch(e){if(e.code!=='ENOENT')throw e;}}
const files=await readdir('src/world');for(const f of files.filter(f=>f.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',`src/world/${f}`],{stdio:'inherit'});if(result.status)process.exit(result.status);}
const build=spawnSync('npm',['run','build'],{stdio:'inherit'});if(build.status)process.exit(build.status);
const test=spawnSync(process.execPath,['--test','tests/site.test.mjs'],{stdio:'inherit'});if(test.status)process.exit(test.status);
const html=await readFile('dist/index.html','utf8');if(!html.includes('noindex,nofollow'))throw new Error('Experimental site should remain noindex');
console.log('Verified: build, assets, English content, interactions, accessibility state, intro escape, and experimental domain boundary.');
