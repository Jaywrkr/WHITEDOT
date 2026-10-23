import {THEME,themePitch,playCello} from './journey-pulse.js';
// The theme as a key (phase 5 of the plan, approved by Jay): after the Journey you know the cube's theme, and the
// universe recognises it. Completing it on time beside a landmark makes the landmark play its motif and then the theme
// with you; completing it in a rare superbiome makes the place answer it a fifth up. Each key is kept once, with its
// day, in S.universe.keys, and the Journal lists them. Only in the free World: in the Journey the chapters own the theme.
// Nothing here consumes the old random sequence: landmarks and superbiomes come from the map.
export const KEY_REACH=320,KEY_LIMIT=2000;
export const RARE_KEYS=Object.freeze(['raro','muy-raro','ausente']);
export function normalizeKeys(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},out={};
 for(const [id,v] of Object.entries(q).slice(0,KEY_LIMIT)){if(typeof id!=='string'||id.length>80||!/^(lm|super):/.test(id)||!v||typeof v!=='object')continue;const name=typeof v.n==='string'?v.n.slice(0,80):'';const day=typeof v.d==='string'||Number.isFinite(v.d)?v.d:1;out[id]={d:day,n:name};}
 return out;}
// What the theme opens here: the nearest landmark within reach, or else the superbiome when it is rare.
export function keyHere(landmarks,superbiome){const lm=(landmarks||[]).find(l=>l.d<=KEY_REACH);if(lm)return {id:lm.id,name:lm.name||lm.id,kind:'landmark',landmark:lm};
 if(superbiome&&RARE_KEYS.includes(superbiome.rarity))return {id:'super:'+superbiome.id,name:superbiome.name,kind:'superbiome'};return null;}
// The landmark's answer: its motif from the chord that plays, then the theme whole, on the beat after.
export function landmarkScore(motif,steps,chord,scale,tr=0){const ct=Array.isArray(chord)&&chord.length?chord:[57,60,64],out=[];let end=0;
 (motif||[]).forEach((deg,i)=>{let m=ct[deg%ct.length];while(m<55)m+=12;while(m>72)m-=12;const at=(steps?.[i]||0);out.push({midi:m,at,eighths:2});end=Math.max(end,at+4);});
 let at=Math.ceil(end/4)*4+4;for(const [d,l] of THEME){out.push({midi:themePitch(d,scale,tr),at,eighths:l,theme:true});at+=l*2;}return out;}
const escapeHtml=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
// The keys in the Journal (Lugares).
export function keySection(S){const keys=normalizeKeys(S?.universe?.keys),list=Object.entries(keys);
 if(!list.length)return '<section class="super-map key-list" aria-label="Llaves"><h3>Llaves</h3><p>Toca el tema completo junto a un hito o en un lugar raro.</p></section>';
 return `<section class="super-map key-list" aria-label="Llaves"><h3>Llaves · ${list.length}</h3><ul>${list.map(([id,v])=>`<li class="got" data-key="${escapeHtml(id)}">${escapeHtml(v.n||id)}</li>`).join('')}</ul></section>`;}
export function initialize(runtime){
 let owner=null,answers=0;
 function own(){const u=(runtime.S.universe||={});if(owner!==runtime.S){owner=runtime.S;u.keys=normalizeKeys(u.keys);}return (u.keys||={});}
 const free=()=>runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie'&&!runtime.journeyQuiet?.();
 function play(score,shift=0,soft=1){const ac=runtime.ac;if(!runtime.S.sound||!ac||!runtime.bus||!runtime.soon)return;const sixteenth=runtime.SIX||.15;
  runtime.soon(t=>{for(const n of score){const at=t+n.at*sixteenth,len=n.eighths*sixteenth*2;playCello(ac,runtime.bus,at,n.midi+shift,len,(n.theme?.12:.09)*soft);if(n.theme)playCello(ac,runtime.bus,at,n.midi+shift-12,len,.06*soft);}},'player');}
 // Called by journey-pulse.js each time the theme is completed on time.
 function phrase(){if(!free())return null;const keys=own(),MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,tr=MU.tr||0;
  const found=keyHere(runtime.nearbyLandmarks?.(runtime.S.wx,runtime.S.wy,KEY_REACH),runtime.superbiomeHere?.());if(!found)return null;answers++;
  if(found.kind==='landmark'){const lm=found.landmark;play(landmarkScore(lm.motif,lm.steps,runtime.chordTones?.(),scale,tr));if(lm.ref)lm.ref.lit=1;}
  else play(THEME.reduce((out,[d,l])=>{const at=out.length?out[out.length-1].at+out[out.length-1].eighths*2:4;out.push({midi:themePitch(d,scale,tr),at,eighths:l,theme:true});return out;},[]),7,.8);
  runtime.enterFx=Math.max(runtime.enterFx||0,1);runtime.flash=Math.max(runtime.flash||0,.8);
  if(keys[found.id])return found;keys[found.id]={d:runtime.S.todayKey||1,n:found.name};if(runtime.save()===false){delete keys[found.id];return found;}
  runtime.toast?.(`<em>Llave</em> · ${escapeHtml(found.name)}`);return found;}
 Object.defineProperties(runtime,{themeKeyPhrase:{get:()=>phrase},themeKeys:{get:()=>()=>({keys:{...own()},answers})}});
}
