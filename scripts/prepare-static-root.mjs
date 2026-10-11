// The repository's existing branch-based Pages publisher serves the root.
// Keep it identical to the verified Actions artifact so the two cannot race.
import {cp,copyFile,rm,writeFile} from 'node:fs/promises';
for(const directory of ['assets','art','images']){
  await rm(directory,{recursive:true,force:true});
  await cp(`dist/${directory}`,directory,{recursive:true});
}
for(const file of ['index.html','favicon.svg','robots.txt','sitemap.xml'])await copyFile(`dist/${file}`,file);
await writeFile('.nojekyll','');
console.log('Prepared the same static build for branch-based Pages publishing.');
