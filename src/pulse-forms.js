import {DISCOVERY_ELEMENTS,migrateElementBook,knownElementFound} from './element-book-model.js';
const TAU=Math.PI*2;
export const PULSE_FAMILIES=Object.freeze([['ring','Pulso'],['double','Doble'],['triple','Triple'],['arc','Arcos'],['wave','Ondas'],['laser','Láseres'],['bubble','Burbujas'],['petal','Pétalos'],['diamond','Cristales'],['spiral','Espirales']].map(([id,name])=>({id,name})));
export const PULSE_FORMS=Object.freeze(PULSE_FAMILIES.flatMap(f=>Array.from({length:5},(_,variant)=>Object.freeze({id:f.id+'-'+variant,family:f.id,name:f.name+' '+(variant+1),variant,angle:variant*Math.PI/5}))));
// Immutable source order: future catalog insertions cannot revoke earned waves.
export const PULSE_SOURCES=Object.freeze(["living:breath-tree","living:pulse-fruit","living:vine","living:fungal-net","living:pressure-flower","living:reeds","living:moss","living:cactus","living:seed","living:lichen","living:manta","living:deer","living:turtle","living:beetle","living:jelly","living:worm","living:whale","living:moth","living:crab","living:blob","living:root-house","living:mill","living:cathedral","living:observatory","living:plaza","living:mirror-grove","living:bridge","living:membrane-home","living:fern-strings","living:bell-reed","living:drum-cap","living:fan-coral","living:bubble-moss","living:thread-bloom","living:rain-lily","living:ray-bird","living:ribbon-fish","living:thread-spider","living:clock-snail","living:spring-hare","living:lantern-bug","living:stone-crawler","living:kite-jelly","living:wind-harp","living:hollow-cairn","living:resonance-gate","living:night-nest","living:water-wheel","piedra"]);
const sourceIndex=id=>{const at=PULSE_SOURCES.indexOf(id);if(at>=0)return at;let h=2166136261;for(const ch of id)h=Math.imul(h^ch.charCodeAt(0),16777619);return (h>>>0)%49;};
export const pulseForm=id=>PULSE_FORMS.find(p=>p.id===id)||PULSE_FORMS[0];
export function ownedPulses(state){
 const out=new Set(['ring-0']),found=knownElementFound(migrateElementBook(state));
 for(const id of Object.keys(found))out.add(PULSE_FORMS[1+sourceIndex(id)].id);return out;
}
export function pulseHint(id){const i=PULSE_FORMS.findIndex(p=>p.id===id),e=DISCOVERY_ELEMENTS.find(e=>e.id===PULSE_SOURCES[(i+48)%49]);return i===0?'Conserva el pulso original.':'Encuentra: '+(e?.name||'una voz del universo')+'.';}
export function selectedPulse(state){const id=state.cube?.pulse;return ownedPulses(state).has(id)?pulseForm(id):PULSE_FORMS[0];}
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
function factors(p,theta){
 const a=theta-p.angle,v=p.variant;
 if(p.family==='arc'&&Math.abs(wrap(a))>Math.PI*(.28+v*.12)+1e-8)return [];
 if(p.family==='laser'&&!Array.from({length:2+v},(_,i)=>Math.abs(wrap(a-i*TAU/(2+v)))<.055+v*.008).some(Boolean))return [];
 if(p.family==='bubble'){
  const out=[];for(let i=0;i<3+v;i++){const delta=wrap(a-i*TAU/(3+v)),root=.16**2-(.72*Math.sin(delta))**2;if(root>=0&&Math.cos(delta)>0)out.push(.72*Math.cos(delta)+Math.sqrt(root));}return out;
 }
 const shape=p.family==='wave'?.85+.12*Math.sin(a*(3+v)):p.family==='petal'?.7+.28*Math.cos(a*(3+v)):p.family==='diamond'?1/(Math.abs(Math.cos(a))+Math.abs(Math.sin(a))):1;
 if(p.family==='spiral'){const turns=1.5+v*.2,phase=((a%TAU+TAU)%TAU)/TAU;return Array.from({length:3},(_,i)=>(phase+i)/turns).filter(u=>u<=1).map(u=>.15+.8*u);}
 return (p.family==='double'?[.58+v*.045,1]:p.family==='triple'?[.38+v*.025,.66+v*.025,1]:[shape*(p.family==='ring'&&v?.88+.1*Math.cos(a*(v+1)):1)]);
}
export function pulseCrossed(w,x,y){
 const d=Math.hypot(x-w.x,y-w.y),theta=Math.atan2(y-w.y,x-w.x),p=w.form||PULSE_FORMS[0];
 return factors(p,theta).some(f=>d<=w.r*f&&d>w.prev*f);
}
export function pulsePaths(p,r){
 const paths=[],v=p.variant;
 if(p.family==='laser')return Array.from({length:2+v},(_,i)=>{const a=p.angle+i*TAU/(2+v);return [[Math.cos(a)*r*.2,Math.sin(a)*r*.2],[Math.cos(a)*r,Math.sin(a)*r]];});
 if(p.family==='bubble')return Array.from({length:3+v},(_,i)=>Array.from({length:25},(_,j)=>{const a=p.angle+i*TAU/(3+v),b=j*TAU/24;return [Math.cos(a)*r*.72+Math.cos(b)*r*.16,Math.sin(a)*r*.72+Math.sin(b)*r*.16];}));
 if(p.family==='spiral')return [Array.from({length:65},(_,i)=>{const u=i/64,a=p.angle+u*TAU*(1.5+v*.2);return [Math.cos(a)*r*(.15+.8*u),Math.sin(a)*r*(.15+.8*u)];})];
 const fronts=p.family==='double'?2:p.family==='triple'?3:1;
 for(let f=0;f<fronts;f++){const path=[];for(let i=0;i<=64;i++){const a=p.family==='arc'?p.angle+(-1+2*i/64)*Math.PI*(.28+v*.12):i*TAU/64,
   factor=factors(p,a)[f]??0;path.push([Math.cos(a)*r*factor,Math.sin(a)*r*factor]);}paths.push(path);}return paths;
}
export function drawPulse(c,p,x,y,r,reduced=false){
 c.save();c.translate(x,y);for(const path of pulsePaths(p,reduced?26:r)){c.beginPath();path.forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));c.stroke();}c.restore();
}
