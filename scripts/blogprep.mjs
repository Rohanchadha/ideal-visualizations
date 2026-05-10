import { GALLERY_IMAGES, GALLERY_VIDEOS } from '../src/config/galleryManifest.js';
const all = [...GALLERY_IMAGES, ...GALLERY_VIDEOS];
const targets = [
  'Raman- Ideal Home Designers',
  'Manjinder- Planet Design and associates',
  'Jatin Narula - Kitchen Decor',
  'Agampreet - Concept Designs',
  'Design Anthem Forum',
  'Raman- EDC Architects',
  'Akash Bhutani',
  'Ankit Bansal',
];
for (const c of targets) {
  const items = all.filter(i => i.clientName === c);
  console.log('\n========', c, '========');
  console.log('  type:', items[0].clientType, '| loc:', items[0].city, items[0].state, items[0].country);
  console.log('  themes:', [...new Set(items.map(x=>x.theme).filter(Boolean))].join(', '));
  console.log('  software:', [...new Set(items.flatMap(x=>x.software||[]))].join(', '));
  console.log('  services:', [...new Set(items.flatMap(x=>x.services||[]))].join(', '));
  console.log('  total assets:', items.length, '(images:', items.filter(x=>x.type==='image').length, 'videos:', items.filter(x=>x.type==='video').length, ')');
  console.log('  --- per-asset ---');
  items.forEach((x, i) => {
    console.log(`  [${i+1}] id=${x.id} type=${x.type} theme=${x.theme||'?'}`);
    console.log(`      desc: ${(x.description||'(none)').slice(0,150)}`);
  });
}
