// Playback arrangements only: no world RNG, scale, BPM or save mutation.
const line=s=>Object.freeze([...s].map(n=>n==='.'?-1:Number(n)));
const family=(id,name,genres,leads,bass,motifs,progression,drums,swing)=>Object.freeze({id,name,genres:Object.freeze(genres.split(' ')),leads:Object.freeze(leads.split(' ')),bass:line(bass),motifs:Object.freeze(motifs.map(line)),progression:Object.freeze(progression),drums:Object.freeze(Object.fromEntries(Object.entries(drums).map(([k,v])=>[k,Object.freeze(v)]))),swing});
export const MUSIC_FAMILIES=Object.freeze([
 family('funk','Funk y disco','nudisco boogie cosmic electrofunk gfunk','clav p_gutguitar p_softhorn','0..4..0.2.0...4.',['0..2..4...2...0.','...4..2...0..2..'],[0,5,1,4],{kick:[0,4,8,12],clap:[4,12],hat:[2,6,10,14],wood:[3,11]},.09),
 family('dub','Dub y reggae','dub','p_barkkeys orbitorgan p_gutguitar','0.......4..0....',['..0.......2.....','......4.......0.'],[0,0,3,0],{kick:[0,10],rim:[8],hat:[2,6,10,14]},.03),
 family('jazz','Jazz y bossa','jazztronica lofi boombap deep soulful','feltpiano rhodes p_gutguitar','0.....4.2....0..',['0..2...4..1.....','...3..2......4..'],[1,4,0,5],{kick:[0,7,10],rim:[4,12],shaker:[2,6,10,14],wood:[3,10]},.16),
 family('afro','Afro y latino','afro tribal tropical amapiano','p_panreed p_gutguitar kalimba','0..0..4...2...0.',['0..2..4...2.0...','..4...2..0....2.'],[0,0,3,4],{kick:[0,8],conga:[0,3,6,10,12],wood:[2,8,14],shaker:[3,7,11,15]},.08),
 family('folk','Folk y cuerdas','organic andean downtempo','p_gutguitar p_cellobody airflute','0.......4.......',['0.....2...4.....','....3.......0...'],[0,3,5,4],{kick:[0],wood:[6,14],shaker:[10]},.025),
 family('chamber','Ambient y cámara','ambient heart','bowed silkstrings airflute','0...............',['0...............','........2.......'],[0,5,0,3],{},0),
]);
export const musicFamily=genre=>MUSIC_FAMILIES.find(f=>f.genres.includes(genre))||null;
export function familyArrangement(frame,region,seedOf){
 const f=musicFamily(region.genre);if(!f)return frame;
 const h=seedOf('music:family:v1:'+region.key+':'+region.genre)>>>0,bar=Math.max(0,frame.harmonyBar||0),position=Math.floor(bar)%8,turn=Math.floor(bar/8),release=position===7;
 const motif=f.motifs[(turn+(h>>>5))%f.motifs.length],rest=release||frame.labScore?.listenQuiet===true||(f.id!=='chamber'&&frame.melodyRest&&(frame.labScore?.electronic?.count||1)<=3),
  hook=rest?Array(16).fill(-1):motif.map((n,i)=>n<0?-1:Math.min(6,n+((turn%4===2&&i%4!==0)?1:0))),
  bass=release?f.bass.map((n,i)=>i===0?n:-1):f.bass.slice(),lead=f.leads[(h+Math.floor(turn/2))%f.leads.length];
 return {...frame,musicFamily:f,hook,bass,hookI:lead,bassI:f.id==='funk'?'p_roundbass':f.id==='afro'||f.id==='folk'?'p_woodybass':'velvetbass',melodyRest:rest,
  referenceSupport:null,identity:{...frame.identity,name:f.name,hooks:f.leads,bassI:f.id==='funk'?'p_roundbass':f.id==='afro'||f.id==='folk'?'p_woodybass':'velvetbass',swing:f.swing},
  grammar:{...frame.grammar,progression:f.progression.slice(),harmonyBars:f.id==='chamber'?16:f.id==='jazz'?2:4,hookLevel:Math.min(1,frame.grammar.hookLevel),accents:[]},
  expression:{...frame.expression,harmony:f.id==='jazz',attackScale:f.id==='chamber'?1.6:1,decayScale:f.id==='funk'?.65:1},
  labScore:frame.labScore?{...frame.labScore,listenQuiet:frame.labScore.listenQuiet||release}:frame.labScore};
}
export function familyDrums(frame,step,bar,energy){
 const f=frame.musicFamily;if(!f||energy<=.12)return [];
 const release=Math.floor(frame.harmonyBar??bar)%8===7;
 return Object.entries(f.drums).filter(([id,steps])=>steps.includes(step)&&(!release||id==='kick'&&step===0)&&(id==='kick'||energy>.25)).map(([instrument])=>({instrument,gain:({kick:.19,clap:.045,rim:.032,conga:.055,wood:.025,shaker:.012,hat:.016})[instrument]}));
}
const RINGING=new Set(['bell','glass','steel','fmglass','p_roundbell','p_celestabody']);
export function createAmbientPunctuation(){
 let owner=null,lastStep=-Infinity;const recent=new Map();
 return {allow(instrument,origin,key,bar,state){
  if(origin!=='ambient'||!RINGING.has(instrument))return true;
  if(state!==owner||bar<lastStep){owner=state;recent.clear();}lastStep=bar;
  const previous=recent.get(key)??-Infinity;if(bar-previous<8)return false;
  recent.delete(key);recent.set(key,bar);while(recent.size>64)recent.delete(recent.keys().next().value);return true;
 }};
}
