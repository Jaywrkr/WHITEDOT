import {musicalCharacter,hookInstruments,interactionInstruments,expressiveBassInstruments} from './musical-character.js';
import {familyMusic} from './world-families.js';

// Playback DNA only. Never draw from the placement RNG or mutate a region/save.
export const MUSIC_IDENTITY_VERSION=1;
const line=s=>[...s].map(v=>v==='.'?-1:Number(v));
const recipe=(id,name,genres,influence,bass,motif,hooks,accent,accents,production)=>({
 id,name,genres:genres.split(' '),influence,bass:line(bass),motif,
 hooks:hooks.split(' '),accent,accents,...production,
});
// Complete, restrained arrangements; native drums, scale and BPM remain the foundation.
export const MUSIC_IDENTITIES=[
 recipe('minimal-hush','Pulso de madera','minimal minimaltechno techhouse','espacio',
  '0.....0...4.....',[0,6,14],'clav resonantpluck phasekeys','wood',[3,11],{swing:.08,air:.55,attack:.8,decay:.7,tone:.8,hookLevel:.8,bassLevel:.9,hookLimit:2,harmonyBars:16,progression:[0,0,3,0],energyCap:.62}),
 recipe('micro-wood','Microtexturas','rominimal microhouse minimal techhouse','madera',
  '.0.0...0.0...4..',[0,7,13],'resonantpluck clav phasekeys','rim',[6,15],{swing:.2,air:.45,attack:.65,decay:.6,tone:.85,hookLevel:.75,bassLevel:.86,hookLimit:3,harmonyBars:16,progression:[0,3,0,5],energyCap:.6}),
 recipe('deep-soul','Calor eléctrico','deep soulful chicago garagehouse','soul',
  '0..0..4.2.....4.',[0,6,10,14],'rhodes phasekeys resonantpluck','rim',[7,15],{swing:.14,air:.65,attack:1.15,decay:1.1,tone:.82,hookLevel:.85,bassLevel:.92,hookLimit:4,harmonyBars:8,progression:[0,5,3,4],energyCap:.65}),
 recipe('dub-space','Eco profundo','dub heart','resonancia',
  '0.......0.....4.',[0,10],'orbitorgan hollow choir','wood',[6,14],{swing:.045,air:.4,attack:1.25,decay:1.3,tone:.7,hookLevel:.75,bassLevel:.88,hookLimit:2,harmonyBars:16,progression:[0,0,3,0],energyCap:.55}),
 recipe('organic-strings','Cuerdas del suelo','organic andean downtempo','cuerdas',
  '0.....4...0...2.',[0,3,10,14],'resonantpluck granularair reed','wood',[3,10],{swing:.15,air:.6,attack:1.3,decay:1.1,tone:.8,hookLevel:.82,bassLevel:.88,hookLimit:4,harmonyBars:12,progression:[0,3,5,4],energyCap:.6}),
 recipe('afro-roots','Raíces entrelazadas','afro tribal tropical organic andean','percusión',
  '0..0..4..0....2.',[0,6,12],'reed kalimba resonantpluck','wood',[3,6,10,14],{swing:.11,air:.65,attack:.8,decay:.75,tone:.88,hookLevel:.78,bassLevel:.9,hookLimit:3,harmonyBars:12,progression:[0,0,3,4],energyCap:.65}),
 recipe('disco-orbit','Órbita funk','cosmic nudisco boogie','funk',
  '0..4..0.2.0...4.',[0,3,6,10,14],'phasekeys brass orbitorgan','rim',[7,15],{swing:.1,air:.75,attack:.75,decay:.75,tone:.9,hookLevel:.85,bassLevel:.92,hookLimit:5,harmonyBars:8,progression:[0,5,3,4],energyCap:.68}),
 recipe('melodic-flow','Horizonte de cuerdas','melodic progressive melodictechno detroit gfunk','movimiento',
  '0.0...4.0...2.4.',[0,2,6,10,14],'strings fmglass saw','rim',[3,11],{swing:.03,air:.65,attack:1.25,decay:1.15,tone:.85,hookLevel:.8,bassLevel:.9,hookLimit:5,harmonyBars:12,progression:[0,3,5,4],energyCap:.68}),
 recipe('machine-dialogue','Conversación modular','electro robotic ebm electrofunk detroitelectro ghetto','modulación',
  '0..0...4..0..2..',[0,3,8,11],'phasekeys machine fmglass vocalform','rim',[3,15],{swing:.045,air:.55,attack:.65,decay:.65,tone:.82,hookLevel:.78,bassLevel:.9,hookLimit:3,harmonyBars:16,progression:[0,0,4,0],energyCap:.65}),
 recipe('broken-thread','Hilo quebrado','breaks garage idm algorave brokenbeat footwork baltimore jersey','síncopa',
  '0......4..0...2.',[0,3,7,10,13],'membrane phasekeys granularair rhodes','wood',[6,13],{swing:.13,air:.6,attack:.75,decay:.7,tone:.83,hookLevel:.78,bassLevel:.92,hookLimit:4,harmonyBars:8,progression:[0,3,0,4],energyCap:.65}),
 recipe('liquid-veil','Velos líquidos','dnb liquid','cuerdas',
  '0.0...4.0.0...2.',[0,4,10,12],'rhodes strings phasekeys','rim',[7,15],{swing:.02,air:.55,attack:1.3,decay:1.05,tone:.78,hookLevel:.75,bassLevel:.9,hookLimit:3,harmonyBars:16,progression:[0,5,3,4],energyCap:.65}),
 recipe('half-earth','Gravedad del bajo','dubstep amapiano trap miamibass','graves',
  '0.....4....0..2.',[0,8,14],'hollow rhodes resonantpluck','wood',[6,14],{swing:.12,air:.45,attack:.9,decay:.85,tone:.75,hookLevel:.75,bassLevel:.92,hookLimit:3,harmonyBars:16,progression:[0,0,3,0],energyCap:.62}),
 recipe('ambient-breath','Respirar despacio','ambient heart','silencio',
  '0...............',[0,8],'choir bowed granularair','wood',[],{swing:0,air:.25,attack:1.8,decay:1.2,tone:.65,hookLevel:.7,bassLevel:.8,hookLimit:2,harmonyBars:24,progression:[0,5,0,3],energyCap:.3}),
 recipe('ambient-string','Hilos suspendidos','ambient downtempo berlin','textura',
  '0.......4.......',[0,6,12],'granularair choir bowed','wood',[10],{swing:.025,air:.3,attack:1.7,decay:1.3,tone:.7,hookLevel:.72,bassLevel:.82,hookLimit:2,harmonyBars:24,progression:[0,3,5,0],energyCap:.4}),
 recipe('acid-pulse','Espira analógica','acid acidhouse ebm','resonancia',
  '0.0.4.00.0.4.0.0',[0,6,14],'hollow orbitorgan resonantpluck','rim',[3,11],{swing:.035,air:.5,attack:.7,decay:.65,tone:.75,hookLevel:.72,bassLevel:.88,hookLimit:2,harmonyBars:16,progression:[0,0,4,0],energyCap:.65}),
 recipe('jazz-shadow','Sombras cálidas','jazztronica lofi boombap deep garage brokenbeat','jazz',
  '0......2..4..0..',[0,3,7,10],'rhodes phasekeys reed','wood',[7,13],{swing:.2,air:.4,attack:1.1,decay:1,tone:.75,hookLevel:.8,bassLevel:.88,hookLimit:4,harmonyBars:12,progression:[0,5,3,4],energyCap:.58}),
];
for(const r of MUSIC_IDENTITIES){for(const v of Object.values(r))if(Array.isArray(v))Object.freeze(v);Object.freeze(r);}Object.freeze(MUSIC_IDENTITIES);

export function musicIdentity(region,seedOf,rng,genres={}){
 const pool=MUSIC_IDENTITIES.filter(p=>p.genres.includes(region.genre));
 if(!pool.length)return null;
 const random=rng(seedOf(`music:identity:v1:${region.key}:${region.genre}`)),base=pool[Math.floor(random()*pool.length)];
 const native=genres[region.genre]||{hookP:['rhodes'],bassI:region.track?.bassI||'sub'},profile=musicalCharacter(region.genre);
 const nativeHooks=hookInstruments(region.genre,native)||['rhodes'];
 const allowed=new Set(interactionInstruments(region.genre,native,'lead'));
 const hooks=base.hooks.filter(id=>allowed.has(id));
 const bassPool=expressiveBassInstruments(region.genre,native);
 return Object.freeze(familyMusic({...base,version:MUSIC_IDENTITY_VERSION,genre:region.genre,
  hooks:Object.freeze(hooks.length?hooks:nativeHooks.slice()),bassI:bassPool[Math.floor(random()*bassPool.length)],
  // Fast/straight native traditions keep their grid; shuffle stays in its own traditions.
  swing:Math.min(.33,(native.sw||0)===0?0:(native.sw||0)*.8+base.swing*.2),
  air:base.air*profile.air,energyCap:Math.min(region.genre==='ambient'?.3:.7,base.energyCap),
  hookLimit:Math.min(base.hookLimit,Math.max(...profile.budget)),
  phraseBars:[4,4,6,8][Math.floor(random()*4)],brightness:Math.min(profile.ceiling,4200+base.tone*3300),
  drums:Object.freeze({nativeGenre:region.genre,accent:base.accent,steps:base.accents}),
 },region,[...allowed]));
}

export function identityGrammar(grammar,identity){
 if(!identity)return grammar;
 return {...grammar,identityVersion:identity.version,hookLimit:Math.min(grammar.hookLimit,identity.hookLimit),
  // Ecology may call for long breathing chapters; it remains an upper density limit.
  phraseBars:Math.max(grammar.phraseBars,identity.phraseBars),harmonyBars:Math.max(grammar.harmonyBars,identity.harmonyBars),
  progression:identity.progression,brightness:Math.min(grammar.brightness,identity.brightness),
  hookLevel:grammar.hookLevel*identity.hookLevel,bassLevel:grammar.bassLevel*identity.bassLevel,
  accents:identity.accents,accentInstrument:identity.accent,character:identity.name};
}

export function identityExpression(expression,identity){
 if(!identity)return expression;
 return {...expression,attackScale:expression.attackScale*identity.attack,decayScale:expression.decayScale*identity.decay,
  toneScale:expression.toneScale*identity.tone};
}

export function identityBass(nativeBass,identity,genre,section,phrase=0){
 if(!identity)return nativeBass;
 const anchor=nativeBass.findIndex(n=>n>=0);
 // Native subdivisions define the genre. The recipe shapes its pitches and breathing.
 const last=nativeBass.findLastIndex(n=>n>=0),cycle=Math.floor(Math.max(0,phrase)/4)%4;
 return nativeBass.map((n,s)=>n<0?-1:section===0&&s!==anchor&&s%4!==0?-1:
  s===last&&s!==anchor&&cycle>0&&section>0?[0,4,2,4][cycle]:
  ['acid','acidhouse','ebm','berlin','rominimal','trap','miamibass'].includes(genre)?n:
  identity.bass[s]>=0?identity.bass[s]:n);
}
