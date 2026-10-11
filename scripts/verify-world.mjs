import {readFile,access,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for(const file of ['pond.webp','pond-mobile.webp','koi.webp','shire.webp','city.webp','tree.webp','glass.webp','atlas.webp','hobbit.webp','gollum.webp'])await access(`public/art/${file}`);
for(const path of ['CNAME','public/CNAME']){try{await access(path);throw new Error('Production domain must not be attached to Portfolio-World');}catch(e){if(e.code!=='ENOENT')throw e;}}
const files=await readdir('src/world');for(const f of files.filter(f=>f.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',`src/world/${f}`],{stdio:'inherit'});if(result.status)process.exit(result.status);}
const build=spawnSync('npm',['run','build'],{stdio:'inherit'});if(build.status)process.exit(build.status);
const test=spawnSync(process.execPath,['--test','tests/site.test.mjs'],{stdio:'inherit'});if(test.status)process.exit(test.status);
const html=await readFile('dist/index.html','utf8');if(!html.includes('noindex,nofollow'))throw new Error('Experimental site should remain noindex');
console.log('Verified: build, assets, English content, interactions, accessibility state, intro escape, and experimental domain boundary.');
