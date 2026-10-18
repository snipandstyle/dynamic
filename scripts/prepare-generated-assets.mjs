import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const source='C:/Users/naras/.codex/generated_images/01a144e4-eb95-72c3-87fa-f81eb2f3407c';
const assets=[
  ['pet-happy-place','exec-121364c6-64d7-4792-a2b5-8f982a04039c.png','Warm editorial hero: Shih Tzu in forest-green bandana, golden retriever and Persian cat on cream cushions in a sage and oak lounge. Natural light, realistic anatomy, no text or logos.'],
  ['gentle-bath','exec-6415433f-0fd3-44f4-882f-2a632979b8ca.png','A calm white-and-tan Shih Tzu having a gentle shampoo bath with an Indian groomer in a warm ivory salon. Natural light, realistic fur, no text or logos.'],
  ['cosy-boarding','exec-ba7a71af-4489-4a06-8841-d14c4b4b8cbc.png','Relaxed beagle on an oat-coloured bed in a bright private cage-free suite with sage walls and oak details. Soft afternoon sunlight, no text or signs.'],
  ['fresh-style','exec-1e0375e6-cd5d-48ea-a3fd-b7bafe4c0e55.png','Freshly groomed apricot toy poodle being gently brushed on a sage table in an ivory and oak salon. Realistic anatomy, natural daylight, no text or logos.'],
  ['cat-care','exec-92416f14-fae9-44fe-8a6c-1ad6df0c41d2.png','Fluffy silver Persian cat gently combed by an Indian groomer in a sage apron. Calm posture, ivory salon, natural light, no text or logos.'],
];
await fs.mkdir('public/images/generated',{recursive:true});
await fs.mkdir('artifacts/image-generation',{recursive:true});
const manifest=[];
for(const [name,file,prompt]of assets){
  const target='public/images/generated/'+name+'.webp';
  await sharp(path.join(source,file)).resize({width:name==='pet-happy-place'?1536:1200,withoutEnlargement:true}).webp({quality:83,effort:5}).toFile(target);
  const stat=await fs.stat(target);manifest.push({asset:target,bytes:stat.size,mode:'built-in image_gen',useCase:'photorealistic-natural',promptSummary:prompt,constraints:'Illustrative marketing photography, not documentation of the actual premises. No text, UI, logos, labels, or watermarks.'});
}
await fs.writeFile('artifacts/image-generation/manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest.map(({asset,bytes})=>({asset,bytes})),null,2));
