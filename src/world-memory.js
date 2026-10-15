import {labScore} from './lab-score.js';
import {normalizeWorldMemory,rememberEntry,patchFromObject,applyPatch,musicalDistance} from './memory-model.js';
import {hybridIdentity} from './musical-hybrids.js';
import {sameWorld} from './world-identity.js';
export function initialize(runtime){
 let owner=null,loaded=new WeakSet(),creatures=new WeakSet(),fullNoticed=false;const visited=new Map();
 function book(){if(owner!==runtime.S){owner=runtime.S;owner.worldMemory=normalizeWorldMemory(owner.worldMemory);loaded=new WeakSet();creatures=new WeakSet();fullNoticed=false;visited.clear();}return owner.worldMemory;}
 function restore(o){const b=book();if(loaded.has(o)||b.version!==1)return;loaded.add(o);applyPatch(o,b.patches[o.id]);}
 function remember(o){const b=book(),p=patchFromObject(o);if(p&&rememberEntry(b,'patches',o.id,p)){runtime.save?.();return true;}if(p&&!fullNoticed){fullNoticed=true;runtime.toast?.(b.version===1?'Memoria llena. Conserva una copia antes de editar más lugares.':'Esta memoria necesita otra versión. Conserva tu copia.');}return false;}
 function restoreCreature(o){const b=book();if(creatures.has(o)||b.version!==1)return;creatures.add(o);const m=b.bonds[o.id];if(m&&m.kind===o.kind&&Math.hypot(o.homeX-m.x,o.homeY-m.y)<1){o.phrase=m.phrase.slice();o.familiarity=Math.min(1,m.visits/6);}}
 function creature(o,visit=true){const b=book();if(b.version!==1||o.group==='architecture')return;
  const prior=b.bonds[o.id];const visits=(prior?.visits||0)+(visit?1:0);if(rememberEntry(b,'bonds',o.id,{kind:o.kind,x:o.homeX,y:o.homeY,visits,phrase:o.phrase||[]}))o.familiarity=Math.min(1,visits/6);}
 function musicMode(){return runtime.S.livingMusic===false||runtime.labClassicMusic?'classic':'live';}
 function musicalAddress(){return {...runtime.worldIdentity,musicVersion:1,musicMode:musicMode()};}
 function stamp(d,mode=musicMode()){
  const hybrid=hybridIdentity(d,runtime.seedOf,runtime.rng),score=mode==='live'?labScore(d,runtime.seedOf,runtime.rng):null;
  return {version:2,musicVersion:1,mode,family:d.worldFamily?.id||'',hybrid:score?'':hybrid?.id||'',genre:d.genre,bpm:d.bpm,recipeVersion:score?.version||1,
   band:score?.id||'',palette:score?.leads.join(',')||'',rhythm:score?JSON.stringify([score.kick,score.drums]):''};
 }

 function musicAim(intent){
  const b=book(),s=runtime.S,layer=s.layer||'superficie';if(b.version!==1)return null;
  const d=runtime.activeLayerRegion?.()||runtime.regionOfPos(s.wx,s.wy),current=stamp(d),now=performance.now(),range=runtime.REG*runtime.WCH*3;
  const points=(runtime.favorites||[]).filter(p=>sameWorld(p.address,runtime.worldIdentity)&&p.layer===layer&&Math.hypot(p.x-s.wx,p.y-s.wy)>65&&Math.hypot(p.x-s.wx,p.y-s.wy)<range&&(visited.get(p.id)||0)<now);
  const scored=points.map(p=>({p,score:musicalDistance(current,[1,2].includes(p.musicStamp?.version)?p.musicStamp:stamp(runtime.regionOfPos(p.x,p.y)))}));scored.sort((a,b)=>intent==='contraste'?b.score-a.score:a.score-b.score);
  const chosen=scored[0]?.p;if(!chosen)return null;return {...chosen,layer};
 }
 function reached(point){if(point?.id){visited.set(point.id,performance.now()+90000);while(visited.size>64)visited.delete(visited.keys().next().value);}}
 function card(){const b=book();return b.version===1?`<article class="journal-card"><h3>Memoria del lugar</h3><p>${Object.keys(b.patches).length} instrumentos editados · ${Object.keys(b.bonds).length} vínculos</p><p>Vuelve al lugar: tus conexiones y frases permanecen.</p></article>`:'';}
 Object.defineProperties(runtime,{restoreEncounter:{get:()=>restore},rememberEncounter:{get:()=>remember},restoreCreature:{get:()=>restoreCreature},rememberCreature:{get:()=>creature},musicStamp:{get:()=>stamp},musicalAddress:{get:()=>musicalAddress},musicAim:{get:()=>musicAim},musicAimReached:{get:()=>reached},worldMemoryCard:{get:()=>card}});book();
}
