import {BoundedMap} from './cache.js';
import {LIVING_CATALOG,livingChunk,livingDefinition} from './living-catalog.js';
import {livingGlyph} from './living-art.js';
import {elementInk} from './visual.js';
import {contactEntry} from './contact.js';
import {claimInstallationBar} from './installations.js';
export const LIVING_GROUPS=['flora','fauna'];
const HINTS={contacto:'Pasa el cubo para tocar',quietud:'Escucha quieto a su lado',orbita:'Rodea con el cubo',presion:'Entra despacio y permanece',cruce:'Cruza despacio',respuesta:'Toca y escucha la respuesta',seguir:'Camina a su lado'};
export function initialize(runtime){
 const chunks=new BoundedMap(48);let owner=runtime.S,clock=0,barPlayed=-1,lab=null;
 const active=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 function chunk(x,y){const key=x+','+y;if(!chunks.has(key)){const d=runtime.regionOfPos((x+.5)*runtime.WCH,(y+.5)*runtime.WCH);chunks.set(key,livingChunk(x,y,runtime.WCH,d,runtime.BIOMES[d.z].id,runtime.seedOf,runtime.rng,LIVING_GROUPS));}return chunks.get(key);}
 function near(radius=750){if(!runtime.inWorld())return [];if(runtime.labLiving){if(lab?.kind!==runtime.labLiving){const def=livingDefinition(runtime.labLiving);lab=def?{id:'living:lab:'+def.id,kind:def.id,shape:def.shape,group:def.group,size:18,variant:25,hue:200,x:runtime.S.wx,y:runtime.S.wy+110,homeX:runtime.S.wx,homeY:runtime.S.wy+110,phase:1,energy:0,lit:0,phrase:[],personality:'curiosa',activeAt:0}:null;}return lab?[lab]:[];}lab=null;
  const cx=Math.floor(runtime.S.wx/runtime.WCH),cy=Math.floor(runtime.S.wy/runtime.WCH),out=[];
  for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++)out.push(...chunk(x,y));return out.filter(o=>Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<radius);
 }
 function emit(o,time,full=false,origin='ambient'){
  if(!active()||!runtime.S.sound||runtime.ac?.state!=='running')return;
  const d=runtime.regionOfPos(o.homeX,o.homeY);runtime.playVoice('living:'+o.kind,(o.phrase.at(-1)??o.variant)%7,time,d,full,origin==='player'?.48:.23,o,origin);o.lit=1;
 }
 function interact(o){const def=livingDefinition(o.kind);o.energy=Math.min(1,o.energy+.5);o.phrase.push(runtime.MU.deg||0);if(o.phrase.length>6)o.phrase.shift();runtime.livingFound?.(o);runtime.unlock('vidaNueva');runtime.beatSoon(t=>emit(o,t,true,'player'),null,'player');
  const seen=runtime.S.livingSeen||={};if(!seen[o.kind]){seen[o.kind]={day:runtime.S.todayKey,variant:o.variant};runtime.say(def.name+' · '+HINTS[def.gesture]+'.','Una voz nueva');}runtime.save();
 }
 function tick(dt){
  if(owner!==runtime.S){owner=runtime.S;chunks.clear();lab=null;clock=0;}if(!active())return;clock+=Math.min(.05,dt);
  for(const o of near()){const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),def=livingDefinition(o.kind);o.lit=Math.max(0,o.lit-dt*2);o.energy=Math.max(0,o.energy-dt*.028);o.phase+=dt*(.2+o.variant%5*.06);
   const angle=Math.atan2(runtime.S.wy-o.y,runtime.S.wx-o.x),old=o.angle??angle;let delta=Math.atan2(Math.sin(angle-old),Math.cos(angle-old));o.angle=angle;
   o.orbit=(o.orbit||0)+(d<o.size+60?Math.abs(delta):0);o.dwell=d<o.size+32&&(runtime.body?.speed||0)<16?(o.dwell||0)+dt:0;
   if(contactEntry(o,d<o.size*.6+13)&&clock-(o.last||-100)>1){o.last=clock;interact(o);}
   if(def.gesture==='orbita'&&o.orbit>Math.PI){o.orbit=0;interact(o);}
   if((def.gesture==='quietud'||def.gesture==='presion')&&o.dwell>8&&clock-(o.last||-100)>8){o.last=clock;interact(o);}
   if(o.kind==='seed'){o.x=o.homeX+Math.sin(clock*.13+o.variant)*35;o.y=o.homeY+Math.cos(clock*.11+o.variant)*20;if(o.dwell>12)o.size=Math.min(24,o.size+dt*.2);}
   runtime.livingBehavior?.(o,dt,clock,d);
  }
 }
 function step(s,bar,time){if(!active()||!runtime.S.sound||runtime.ac?.state!=='running'||runtime.labSolo&&!runtime.labLiving)return;
  const objects=near(280).filter(o=>o.energy>.2);if(!objects.length||barPlayed===bar)return;const o=objects[bar%objects.length];if(s!==2||!claimInstallationBar(runtime,bar))return;barPlayed=bar;emit(o,time);
 }
 function draw(t){if(!runtime.inWorld()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx,objects=near(Math.min(850,Math.max(runtime.W,runtime.H)*.7));let label=null;
  c.save();for(const o of objects){const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);if(d<110&&(!label||d<label.d))label={o,d};if(d>500&&o.group!=='architecture'){c.globalAlpha=.18;c.fillStyle=elementInk('glass',o.hue);c.fillRect(o.x+runtime.W/2-runtime.S.wx,o.y+runtime.H/2-runtime.S.wy,2,2);continue;}
   c.save();c.translate(o.x+runtime.W/2-runtime.S.wx,o.y+runtime.H/2-runtime.S.wy);c.globalAlpha=Math.max(.16,1-d/800)*(.55+o.lit*.35);c.strokeStyle=elementInk('glass',o.hue);c.lineWidth=1.1;livingGlyph(c,o,t);if(o.lit){c.globalAlpha=o.lit*.2;c.beginPath();c.arc(0,0,o.size+6,0,Math.PI*2);c.stroke();}c.restore();}
  if(label){const {o}=label;c.globalAlpha=.7;c.fillStyle=elementInk('glass',o.hue);c.font='9px monospace';c.textAlign='center';c.fillText(livingDefinition(o.kind).name,o.x+runtime.W/2-runtime.S.wx,o.y+runtime.H/2-runtime.S.wy+o.size+20);}c.restore();
 }
 function sources(){return near(250).map(o=>({kind:'living:'+o.kind,name:livingDefinition(o.kind).name,object:o,distance:Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),hint:HINTS[livingDefinition(o.kind).gesture]}));}
 function card(){const found=Object.keys(runtime.S.livingSeen||{});return '<article class="journal-card"><h3>Universo vivo</h3><p>'+found.length+' / '+LIVING_CATALOG.length+' linajes escuchados. Los individuos cambian de voz, forma y conducta según el lugar.</p><p>'+found.map(id=>livingDefinition(id)?.name).filter(Boolean).join(' · ')+'</p></article>';}
 runtime.ACH.push(['vidaNueva','El lugar responde','Escuchaste un nuevo linaje con el cubo.']);
 Object.defineProperties(runtime,{livingTick:{get:()=>tick},livingStep:{get:()=>step},drawLiving:{get:()=>draw},livingNear:{get:()=>near},livingSources:{get:()=>sources},livingCard:{get:()=>card},livingCache:{get:()=>chunks},livingInteract:{get:()=>interact}});
}
