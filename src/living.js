import {festiveBand} from './lab-score.js';
import {expandedChunk} from './ecoregions.js';
import {distanceOpacity,detailBlend} from './world-visibility-model.js';
import {studyOf} from './living-studies.js';
import {BoundedMap} from './cache.js';
import {LIVING_CATALOG,livingChunk,livingDefinition,musicRecipe,aquaticChunk} from './living-catalog.js';
import {livingGlyph} from './living-art.js';
import {elementInk} from './visual.js';
import {contactEntry} from './contact.js';
import {claimInstallationBar} from './installations.js';
import {mindProfile} from './living-mind.js';
import {populationProfile,populatedChunk} from './living-populations.js';
import {anatomyOf} from './anatomy.js';
import {habitatAt} from './habitats.js';
export const LIVING_GROUPS=['flora','fauna','architecture'];
const HINTS={contacto:'Pasa el cubo para tocar',quietud:'Escucha quieto a su lado',orbita:'Rodea con el cubo',presion:'Entra despacio y permanece',cruce:'Cruza despacio',respuesta:'Toca y escucha la respuesta',seguir:'Camina a su lado'};
export function initialize(runtime){
 const chunks=new BoundedMap(48);let owner=runtime.S,clock=0,barPlayed=-1,lab=null;
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 function chunk(x,y){
  const layer=runtime.S.layer||'superficie',key=layer+':'+x+','+y;
  if(!chunks.has(key)){
   const d=runtime.regionOfPos((x+.5)*runtime.WCH,(y+.5)*runtime.WCH),biome=runtime.BIOMES[d.z].id,
    seed=layer==='superficie'?runtime.seedOf:s=>runtime.seedOf(layer+':'+s),region=layer==='cielo'?{...d,sea:false}:d;
   const base=layer==='superficie'&&d.sea&&runtime.worldIdentity.generatorVersion===2?
    aquaticChunk(x,y,runtime.WCH,d,seed,runtime.rng):livingChunk(x,y,runtime.WCH,region,biome,seed,runtime.rng,LIVING_GROUPS);
   const profile=populationProfile(region,biome,seed,runtime.rng);
   const inhabitants=populatedChunk(base,x,y,runtime.WCH,region,profile,seed,runtime.rng);
   inhabitants.push(...expandedChunk(x,y,runtime.WCH,region,biome,inhabitants,seed,runtime.rng));
   chunks.set(key,inhabitants.filter(o=>layer==='superficie'||(layer==='cielo'?['seed','manta','whale','jelly','moth'].includes(o.kind):['fungal-net','lichen','moss','turtle','worm','beetle'].includes(o.kind))).map(o=>({...o,id:layer==='superficie'?o.id:o.id+':'+layer})));
  }return chunks.get(key);
 }
 function near(radius=750){if(!runtime.inWorld())return [];if(owner!==runtime.S){owner=runtime.S;chunks.clear();lab=null;clock=0;}if(runtime.labLiving){if(lab?.kind!==runtime.labLiving||lab?.labSynth!==(runtime.labSynth||null)||lab?.labFilter!==(runtime.labFilter||null)){const def=livingDefinition(runtime.labLiving);lab=def?{id:'living:lab:'+def.id,kind:def.id,shape:def.shape,group:def.group,size:18,variant:25,hue:200,x:runtime.S.wx,y:runtime.S.wy+110,homeX:runtime.S.wx,homeY:runtime.S.wy+110,phase:1,energy:0,lit:0,phrase:[],personality:'curiosa',activeAt:0,labSynth:runtime.labSynth||null,labFilter:runtime.labFilter||null}:null;}return lab?[lab]:[];}lab=null;
  const cx=Math.floor(runtime.S.wx/runtime.WCH),cy=Math.floor(runtime.S.wy/runtime.WCH),out=[];
  const n=Math.min(2,Math.ceil((radius+75)/runtime.WCH));for(let x=cx-n;x<=cx+n;x++)for(let y=cy-n;y<=cy+n;y++)out.push(...chunk(x,y));return [...out,...(runtime.cultureResidents?.(radius)||[])].filter(o=>Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<radius);
 }
 function ensureMind(o){runtime.restoreCreature?.(o);if(!o.mind){o.mind=mindProfile(o,runtime.seedOf,runtime.rng);const traits=livingDefinition(o.kind)?.traits;if(traits)o.mind=Object.freeze({...o.mind,...traits});const d=runtime.regionOfPos(o.homeX,o.homeY);o.festival=festiveBand(d,runtime.seedOf);o.worldFamily=d.worldFamily;o.habitat=habitatAt(d,o.homeX,o.homeY,runtime.seedOf);o.anatomy=anatomyOf({...o,role:livingDefinition(o.kind).role},o.worldFamily,runtime.seedOf);}return o;}
 function emit(o,time,full=false,origin='ambient'){
  if(!active()||!runtime.S.sound||runtime.ac?.state!=='running')return;
  const d=runtime.regionOfPos(o.homeX,o.homeY);runtime.playVoice('living:'+o.kind,((o.phrase.length?o.phrase[(barPlayed<0?0:barPlayed)%o.phrase.length]:o.variant)+(origin==='ambient'?(o.degreeOffset||0):0))%7,time,d,full,origin==='player'?.48:.23,o,origin);o.lit=1;if(origin==='player')runtime.performanceReply?.(o,time,d);
 }
 function interact(o,gesture='contacto'){ensureMind(o);const def=livingDefinition(o.kind);o.stimulusAt=clock;o.energy=Math.min(1,o.energy+.5);o.phrase.push(runtime.MU.deg||0);if(o.phrase.length>o.mind.memorySpan)o.phrase.shift();runtime.rememberCreature?.(o);runtime.livingLink?.(o);runtime.livingFound?.(o,gesture);runtime.unlock('vidaNueva');runtime.beatSoon(t=>emit(o,t,true,'player'),null,'player');
  const seen=runtime.S.livingSeen||={};if(!seen[o.kind]){seen[o.kind]={day:runtime.S.todayKey,variant:o.variant};runtime.say(def.name+' · '+HINTS[def.gesture]+'.','Una voz nueva');}runtime.save();
 }
 function tick(dt){
  if(owner!==runtime.S){owner=runtime.S;chunks.clear();lab=null;clock=0;}if(!active())return;clock+=Math.min(.05,dt);runtime.livingEcologyTick?.(dt);
  const neighbors=near();for(const o of neighbors){ensureMind(o);const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),def=livingDefinition(o.kind);o.lit=Math.max(0,o.lit-dt*2);o.energy=Math.max(0,o.energy-dt*.028);o.phase+=dt*o.mind.phaseRate;
   const angle=Math.atan2(runtime.S.wy-o.y,runtime.S.wx-o.x),old=o.angle??angle;let delta=Math.atan2(Math.sin(angle-old),Math.cos(angle-old));o.angle=angle;
   o.orbit=(o.orbit||0)+(d<o.size+60?Math.abs(delta):0);o.dwell=d<o.size+32&&(runtime.body?.speed||0)<16?(o.dwell||0)+dt:0;
   if(contactEntry(o,d<o.size*.6+13)&&clock-(o.last??-100)>.8+o.mind.patience*.6){o.last=clock;interact(o);}
   if(def.gesture==='orbita'&&o.orbit>Math.PI){o.orbit=0;interact(o,'orbita');}
   const patience=5+o.mind.patience*6;if((def.gesture==='quietud'||def.gesture==='presion')&&o.dwell>patience&&clock-(o.last??-100)>patience){o.last=clock;interact(o,def.gesture);}
   if(o.kind==='seed'){o.x=o.homeX+Math.sin(clock*.13+o.variant)*35;o.y=o.homeY+Math.cos(clock*.11+o.variant)*20;if(o.dwell>12)o.size=Math.min(24,o.size+dt*.2);}
   if(o.dwell>3&&o.kind==='moss'){const region=runtime.regionOfPos(o.x,o.y);runtime.driveInfluence?.(region,'space',.6,o.variant%8);runtime.subtractInfluence?.(region,'melody');}
   runtime.livingBuildingTick?.(o,dt,clock,d);runtime.livingBehavior?.(o,dt,clock,d,neighbors);
  }
 }
 function step(s,bar,time){if(!active()||!runtime.S.sound||runtime.ac?.state!=='running'||runtime.labSolo&&!runtime.labLiving)return;
  const objects=near(280).filter(o=>o.energy>.2&&(!o.ecology||o.awake>.5));if(!objects.length||barPlayed===bar)return;const o=objects[bar%objects.length];const region=runtime.regionOfPos(o.homeX,o.homeY),score=musicRecipe(region,runtime.seedOf,runtime.rng),steps=o.relation&&bar%4===3?[0,5,10]:score.steps;
  const cell=o.group==='architecture'?studyOf(o).rhythm:steps,at=cell[(bar+score.rotation)%cell.length];if(s!==at||!claimInstallationBar(runtime,bar)||runtime.currentPocket?.()?.kind==='quiet')return;barPlayed=bar;
  o.degreeOffset=[[0,1,2,3],[0,2,1,3],[0,3,1,2],[0,2,4,6]][score.palette%4][bar%4];
  const shifted=time+(s%2?runtime.SIX*score.swing:0);emit(o,shifted);
  if(bar%8===7&&score.family!=='free'&&o.energy>.75)emit(o,shifted+runtime.SIX*2,false,'ambient');
 }
 function preload(radius){near(radius);}
 function draw(t){if(!runtime.inWorld())return;const c=runtime.cx,radius=runtime.worldVisibility?.radius||750,objects=near(radius+80),reduced=runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;let label=null;
  c.save();for(const o of objects){const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),fade=distanceOpacity(d,radius);if(!fade)continue;if(d<110&&(!label||d<label.d))label={o,d};
   const family=o.worldFamily,detail=o.group==='architecture'?1:detailBlend(d,runtime.visualDetail?.detailQuality??1),alpha=fade*(.55+o.lit*.35)*(.25+.75*(o.awake??1));
   if(detail<1){c.globalAlpha=alpha*(1-detail)*.33;c.fillStyle=elementInk('glass',o.hue);c.fillRect(o.x+runtime.W/2-runtime.S.wx,o.y+runtime.H/2-runtime.S.wy,2,2);}
   if(detail>0){c.save();c.translate(o.x+runtime.W/2-runtime.S.wx,o.y+runtime.H/2-runtime.S.wy);const response=runtime.reactivePose?.(o.id);if(response){c.translate(response.x,response.y);c.rotate(response.rotation);c.scale(response.sx,response.sy);}c.globalAlpha=alpha*detail;c.strokeStyle=family?.ink||elementInk(family?.material||'glass',family?.hue??o.hue);c.lineWidth=family?.material==='metal'?1.3:family?.material==='air'?.85:1.1;const growth=(o.growth||1)*(o.openness??1),scale=o.group==='architecture'?Math.min(growth,Math.min(runtime.W,runtime.H)*.12/Math.max(1,o.size)):growth;c.scale(scale,scale);if(o.festival&&!reduced){const phase=(runtime.ac?.currentTime||0)/Math.max(.05,runtime.SIX||.125)*Math.PI/2;c.translate(0,Math.sin(phase+(o.variant%3)*.4)*Math.min(1.8,o.energy+1));}livingGlyph(c,reduced?{...o,phase:0}:o,reduced?0:t);
    if(o.group==='fauna'&&o.mind&&d<180){c.fillStyle=elementInk('glass',o.hue);const a=o.attentionAngle||0;c.fillRect(Math.cos(a)*o.size*.45,Math.sin(a)*o.size*.45,2,2);}
    if(o.lit){c.globalAlpha=o.lit*.2*fade*detail;c.beginPath();c.arc(0,0,o.size+6,0,Math.PI*2);c.stroke();}
    if((runtime.worldVisibility?.day??1)<.45&&['moth','jelly','lichen','lantern-bug'].includes(o.kind)){c.globalAlpha=.08*fade*detail*(1-runtime.worldVisibility.day);c.fillStyle=elementInk('glass',o.hue);c.beginPath();c.arc(0,0,Math.min(12,o.size),0,Math.PI*2);c.fill();}c.restore();}
  }
  if(label){const {o}=label;c.globalAlpha=.7;c.fillStyle=elementInk('glass',o.hue);c.font='9px "Geist Mono", monospace';c.textAlign='center';c.fillText(livingDefinition(o.kind).name,o.x+runtime.W/2-runtime.S.wx,o.y+runtime.H/2-runtime.S.wy+o.size+20);}c.restore();
 }
 function sources(){return near(250).map(o=>({kind:'living:'+o.kind,name:livingDefinition(o.kind).name,object:o,distance:Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),hint:o.kind==='bridge'?'Cruza las tres piedras de izquierda a derecha':o.kind==='observatory'?'Rodea y permanece junto a la estrella':HINTS[livingDefinition(o.kind).gesture]}));}
 function card(){const found=Object.keys(runtime.S.livingSeen||{});return '<article class="journal-card"><h3>Universo vivo</h3><p>'+found.length+' / '+LIVING_CATALOG.length+' linajes escuchados. Los individuos cambian de voz, forma y conducta según el lugar.</p><p>'+found.map(id=>livingDefinition(id)?.name).filter(Boolean).join(' · ')+'</p></article>';}
 runtime.ACH.push(['vidaNueva','El lugar responde','Escuchaste un nuevo linaje con el cubo.']);
 Object.defineProperties(runtime,{livingClock:{get:()=>clock},preloadLiving:{get:()=>preload},livingTick:{get:()=>tick},livingStep:{get:()=>step},drawLiving:{get:()=>draw},livingNear:{get:()=>near},livingSources:{get:()=>sources},livingCard:{get:()=>card},livingCache:{get:()=>chunks},livingInteract:{get:()=>interact}});
}
