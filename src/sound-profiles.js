// Sonido pro (alpha.266): the production layer only. Each of the 52 genres belongs to one of fourteen sound families;
// a family profile says how its notes and hits sound (kit, bass, synths, space, bus). The composition (tempo, swing,
// patterns, harmony, regions) is not read or changed here. A family without a ready profile keeps the classic sound.
const family=(id,name,genres)=>Object.freeze({id,name,genres:Object.freeze(genres.split(' '))});
export const SOUND_FAMILIES=Object.freeze([
 family('house','House clásico','deep chicago soulful garagehouse acidhouse progressive'),
 family('tech','Tech house y minimal','techhouse minimal rominimal microhouse'),
 family('techno','Techno','acid minimaltechno detroit dub'),
 family('melodic','Melodic y orgánico','melodic melodictechno organic tropical andean'),
 family('afro','Afro y latino','afro tribal amapiano'),
 family('disco','Disco y funk','nudisco cosmic boogie electrofunk'),
 family('uk','UK y breaks','garage breaks brokenbeat'),
 family('bass','Club de bajos','ghetto baltimore jersey miamibass footwork'),
 family('dnb','DnB y dubstep','dnb liquid dubstep'),
 family('hiphop','Hip-hop','boombap lofi trap gfunk'),
 family('electro','Electro','electro robotic detroitelectro ebm'),
 family('ambient','Ambient','ambient downtempo heart berlin'),
 family('jazz','Jazz','jazztronica'),
 family('experimental','Experimental','idm algorave')
]);
const BY_GENRE=new Map(SOUND_FAMILIES.flatMap(f=>f.genres.map(g=>[g,f])));
export const soundFamily=genre=>BY_GENRE.get(genre)||null;

// The classic velocity of each hit in audio.js: a pro hit keeps the composition's dynamics as a ratio of it.
export const CLASSIC_LEVEL=Object.freeze({kick:.26,snare:.09,clap:.06,hat:.022,hatO:.03,rim:.045,shaker:.016,wood:.045,tom:.09,conga:.08,cowbell:.02,blip:.03});
// Math.random draws the classic hit makes; a pro hit draws the same so the composition's stream does not move.
export const CLASSIC_DRAWS=Object.freeze({hat:2,hatO:2,shaker:1,rim:1,clap:1,snare:1,wood:1});

// «Tech house y minimal»: the 08 direction Jay chose («bien marcado»). Dry and percussive, air between the hits.
const TECH=Object.freeze({
 ready:true,
 kit:Object.freeze({kick:Object.freeze({click:.55,decay:.12,drive:2.4,length:.42,hold:.11,tail:.06}),hatTone:1.47,clapRoom:.3,snareUnderClap:.38}),
 // Pro level of each hit at its classic velocity (1 = the kick).
 levels:Object.freeze({kick:.45,snare:.7,clap:.9,hat:1.3,hatO:.9,rim:.6,shaker:.6,wood:.55,tom:.55,conga:.55,cowbell:.3,blip:.4}),
 pan:Object.freeze({hat:.25,hatO:-.2,rim:-.4,shaker:.45,wood:.38,conga:-.3,tom:.25,cowbell:.3,blip:-.3,ghost:-.3}),
 room:Object.freeze({clap:.3,snare:.2,rim:.22,wood:.25,conga:.25,tom:.3,blip:.35}),
 echo:Object.freeze({rim:.12,blip:.3,wood:.08}),
 ghostHats:.22,      // quiet closed hats on the off sixteenths, from the kick: texture, no new accent
 bass:Object.freeze({sub:.6,mid:.9,steps:1,bright:.42}),
 lead:Object.freeze({keep:2,kind:'chop',level:.85,room:.25,echo:.3}),   // every second melody note, as a vocal chop
 chords:Object.freeze({kind:'stab',level:.7,room:.2,echo:.42}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.32,release:.1}),
 glue:Object.freeze({threshold:-16,ratio:2.2,attack:.01,release:.12}),
 drive:1.35,
 output:1,
 phrase:Object.freeze({crash:16,sweep:32})
});
const PROFILES=Object.freeze({tech:TECH});
const CLASSIC=Object.freeze({ready:false});
const MEMO=new Map();
export function soundProfile(genre){let p=MEMO.get(genre);if(!p){const f=soundFamily(genre);p=f&&PROFILES[f.id]?Object.freeze({family:f.id,name:f.name,...PROFILES[f.id]}):Object.freeze({family:f?.id||null,name:f?.name||null,...CLASSIC});if(MEMO.size<128)MEMO.set(genre,p);}return p;}
export const convertedGenre=genre=>soundProfile(genre).ready===true;
export const convertedFamilies=()=>SOUND_FAMILIES.filter(f=>PROFILES[f.id]?.ready).map(f=>f.id);

// ---------- the setting (S.soundPro) ----------
// «Sonido clásico» off by default: converted families sound new. Unknown fields are kept; a later version is left
// untouched and reads as the default (new sound).
export const SOUND_PRO_VERSION=1;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function normalizeSoundPro(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>SOUND_PRO_VERSION)return raw;const q=plain(raw)?raw:{};return {...q,version:SOUND_PRO_VERSION,classic:q.classic===true};}
export const soundProWritable=q=>q?.version===SOUND_PRO_VERSION;
export const soundProClassic=q=>soundProWritable(q)&&q.classic===true;

// ---------- region transitions, DJ style ----------
// Mirrors territory-journey.js from the cues it already sends each bar (it is not changed): the guest region comes in
// filtered and without bass, a riser announces the swap two bars ahead, the kick drops out for the last half bar and
// an impact marks the swap, where the bass changes hands.
export const GUEST_HIGHPASS=170;
export function guestFilter(w){const k=Math.max(0,Math.min(1,(Number.isFinite(w)?w:0)/.45));return {highpass:GUEST_HIGHPASS,lowpass:Math.round(700*Math.pow(20000/700,k))};}
export function createTransitionTracker(){
 let primary=null,secondary=null,primarySince=0,guestSince=0,last=null;
 function reset(){primary=null;secondary=null;primarySince=0;guestSince=0;last=null;}
 function advance(f){
  const bar=f.bar;
  if(last!==null&&bar<last)reset();
  if(primary===null||f.primary!==primary&&!f.swap){primarySince=bar;guestSince=bar;}
  else if(f.swap)primarySince=bar;
  else if((f.secondary||null)!==secondary)guestSince=bar;
  primary=f.primary;secondary=f.secondary||null;last=bar;
  // The journey swaps on a bar that is a multiple of 8, with the guest at half or more, the primary there for 8 bars
  // and the guest for 4, once you are in the guest's ground: only then does the guest pass one half.
  const swapIn=k=>{const b=bar+k;return !!secondary&&b%8===0&&b-primarySince>=8&&b-guestSince>=4&&(f.to??0)>.5+1e-9;};
  const phrase=bar-primarySince;
  return {bar,primary,secondary,impact:f.swap===true,drop:swapIn(1),riser:swapIn(2)?2:0,
   crash:!f.swap&&phrase>0&&phrase%16===0,sweep:phrase%32===31,phrase,
   from:Number.isFinite(f.from)?f.from:0,to:Number.isFinite(f.to)?f.to:0};
 }
 return {advance,reset};
}
