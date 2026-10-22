import {FAMILIES,LAND_REGIONS,ABYSS_REGIONS,SUPERBIOME_COUNT,RARITY_LABEL} from './superbiomes.js';
import {SUPERBIOME_RARITY} from './superbiome-rarity.js';
import {newRegionById} from './universe-regions.js';
// The Bitácora as a map of superbiomes (docs/UNIVERSO.md, phase 17): one row per region, one column per music family.
// A superbiome heard is gold with its day; one still missing is an outline, and says whether it is rare. The Abyss row
// has only Ambient. Below, the constellations joined so far, each as its figure.
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// The figure the Constelaciones draw when the theme completes (universe-rare.js), as points on a 0..1 square.
export const FIGURE=Object.freeze([[.2,.25],[.35,.18],[.5,.3],[.62,.22],[.78,.35],[.66,.5],[.45,.46]]);
const day=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?new Date(value+'T12:00:00').toLocaleDateString('es',{day:'numeric',month:'short'}):'';
// Heard superbiomes from a save, ignoring anything malformed or unknown (a future save may hold more).
export function heardOf(S){const raw=S?.universe?.super;if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};return Object.fromEntries(Object.entries(raw).filter(([id])=>id in SUPERBIOME_RARITY));}
export function superbiomeProgress(S){return {heard:Object.keys(heardOf(S)).length,total:SUPERBIOME_COUNT};}
function cell(id,name,heard){const r=SUPERBIOME_RARITY[id],got=id in heard,mark=got?'●':r==='ausente'?'×':r==='muy-raro'?'◆':r==='raro'?'◇':'·',
 note=got?(day(heard[id])?'oído el '+day(heard[id]):'oído'):r==='ausente'?'no aparece':RARITY_LABEL[r]||'por oír';
 return `<td class="super-cell${got?' got':''}${r==='ausente'?' none':''}" data-superbiome="${escape(id)}" title="${escape(name+' · '+note)}" aria-label="${escape(name+', '+note)}">${mark}</td>`;}
// The whole section as HTML; regionName(id) gives a region's name.
export function superbiomeSection(S,regionName){const heard=heardOf(S),{heard:n,total}=superbiomeProgress(S),name=id=>newRegionById(id)?.name||regionName(id)||id;
 const head='<tr><th></th>'+FAMILIES.map(f=>`<th scope="col" title="${escape(f.name)}">${escape(f.name.slice(0,3))}</th>`).join('')+'</tr>';
 const land=LAND_REGIONS.map(r=>`<tr><th scope="row">${escape(name(r))}</th>`+FAMILIES.map(f=>cell(r+':'+f.id,name(r)+' · '+f.name,heard)).join('')+'</tr>').join('');
 const abyss=ABYSS_REGIONS.map(r=>`<tr class="super-abyss"><th scope="row">${escape(name(r))}</th>`+cell(r+':ambient',name(r)+' · Ambient',heard)+`<td colspan="${FAMILIES.length-1}"></td></tr>`).join('');
 const joined=Object.keys(S?.universe?.constellations||{}).length,figure=`<svg viewBox="0 0 40 30" aria-hidden="true"><polyline points="${FIGURE.map(([u,v])=>`${(u*40).toFixed(1)},${(v*30*1.6).toFixed(1)}`).join(' ')}"/>${FIGURE.map(([u,v])=>`<rect x="${(u*40-1).toFixed(1)}" y="${(v*30*1.6-1).toFixed(1)}" width="2" height="2"/>`).join('')}</svg>`;
 const sky=joined?`<h3>Constelaciones unidas · ${joined}</h3><div class="super-figures">${figure.repeat(Math.min(joined,12))}</div>`:'<h3>Constelaciones</h3><p>Completa el tema en Constelaciones para unir su figura.</p>';
 return `<section class="super-map" aria-label="Superbiomas"><h3>Superbiomas · ${n}/${total}</h3><p>● oído · ◇ raro · ◆ muy raro · × no aparece</p><div class="super-scroll"><table class="super-grid">${head}${land}${abyss}</table></div>${sky}</section>`;}
