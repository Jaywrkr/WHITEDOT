// Sonido pro (alpha.266, house clásico alpha.267): the production layer only. Each of the 52 genres belongs to one of fourteen sound families;
// a family profile says how its notes and hits sound (kit, bass, synths, space, bus). The composition (tempo, swing,
// patterns, harmony, regions) is not read or changed here. A family without a ready profile keeps the classic sound.
const family=(id,name,genres)=>Object.freeze({id,name,genres:Object.freeze(genres.split(' '))});
export const SOUND_FAMILIES=Object.freeze([
 family('house','House clásico','deep chicago soulful garagehouse acidhouse progressive tropical'),
 family('tech','Tech house y minimal','techhouse minimal rominimal microhouse'),
 family('techno','Techno','acid minimaltechno detroit dub'),
 family('melodic','Melodic y orgánico','melodic melodictechno organic andean'),
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
// «House clásico»: warm and round where tech is dry. Full melody, played by the instrument the composition chose
// (organ, Rhodes-like keys, mallets, pads), wide chords in a longer hall, a gentler pump. Each genre keeps its own
// touch on top (GENRE_TOUCH): acid line, raw 909, organ and shuffle, soft deep kick, long builds, airy mallets.
const HOUSE=Object.freeze({
 ready:true,
 kit:Object.freeze({id:'house',kick:Object.freeze({click:.4,decay:.15,drive:2,length:.48,hold:.13,tail:.08}),kickHz:52,hatTone:1.3,clapRoom:.35,snareUnderClap:.3}),
 levels:Object.freeze({kick:.47,snare:.65,clap:.85,hat:1.1,hatO:.85,rim:.6,shaker:.65,wood:.5,tom:.55,conga:.6,cowbell:.35,blip:.4}),
 pan:Object.freeze({hat:.22,hatO:-.18,rim:-.35,shaker:.4,wood:.35,conga:-.32,tom:.25,cowbell:.3,blip:-.3,ghost:-.28}),
 room:Object.freeze({clap:.35,snare:.25,rim:.25,wood:.25,conga:.3,tom:.3,blip:.35,cowbell:.2}),
 echo:Object.freeze({rim:.1,blip:.3,wood:.08,conga:.06}),
 ghostHats:.16,
 bass:Object.freeze({kind:'split',sub:.62,mid:.75,steps:2,bright:.3}),
 // Instrument the composition chose → how it sounds here; anything else takes the style's own kind.
 lead:Object.freeze({keep:1,kind:'ep',level:.8,room:.18,hall:.22,echo:.22,hold:2,map:Object.freeze({organ:'organ',rhodes:'ep',keys:'ep',feltpiano:'ep',saw:'supersaw',strings:'pad',silkstrings:'pad',bowed:'pad',steel:'mallet',kalimba:'mallet',marimba:'mallet',glass:'mallet'})}),
 chords:Object.freeze({kind:'ep',level:.75,room:.15,hall:.35,echo:.15,hold:3,map:Object.freeze({organ:'organ',rhodes:'ep',keys:'ep',feltpiano:'ep',strings:'pad',silkstrings:'pad',bowed:'pad',steel:'mallet',kalimba:'mallet',marimba:'mallet'})}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.4,release:.12}),
 output:.8,
 syncChords:true,   // notes of the melody's instrument struck together with it are chord notes, not melody
 build:null,
 phrase:Object.freeze({crash:16,sweep:32})
});
// Per-genre touches inside the family (one level deep over HOUSE). The composition (tempo, swing, patterns) is not here.
const GENRE_TOUCH=Object.freeze({
 // Warm pads, a softer and rounder kick, the side-stick and hats pulled back.
 deep:{kit:{id:'deep',kick:{click:.2,decay:.2,drive:1.5,length:.55,hold:.15,tail:.1},kickHz:50,hatTone:1.3},levels:{kick:.4,hat:1.25,rim:.6,shaker:.9},ghostHats:.3,
  bass:{bright:.2,mid:.7,sub:.46},chords:{kind:'pad',level:1.4,hall:.5,hold:6,map:{organ:'pad',rhodes:'pad',keys:'pad'}},lead:{level:.75,hall:.3},sidechain:{floor:.48,release:.16}},
 // Raw 909: a harder click and drive, bright hats, a dry clap and bright piano-like stabs.
 chicago:{kit:{id:'chicago',kick:{click:.75,decay:.13,drive:3,length:.44,hold:.11,tail:.06},kickHz:54,hatTone:1.55,clapRoom:.18,snareUnderClap:.45},levels:{kick:.48,hat:1.35,hatO:1,clap:.95,conga:.65},
  ghostHats:.12,chords:{kind:'stab',level:.85,cut:3800,hall:.15,map:null},lead:{map:{organ:'organ'}},sidechain:{floor:.36,release:.1}},
 // Church organ and Rhodes, shuffled ghost hats, warm room.
 soulful:{kit:{id:'soulful',kick:{click:.35,decay:.16,drive:1.9,length:.5,hold:.13,tail:.08},kickHz:50},levels:{shaker:1},ghostHats:.35,chords:{kind:'organ',level:.85,hall:.4},lead:{level:.8},bass:{bright:.25}},
 // Paradise Garage: organ chords that float, a strong shuffle in the ghost hats, the organ bass kept round.
 garagehouse:{kit:{id:'garage',hatTone:1.4},ghostHats:.4,chords:{kind:'organ',level:1.1,hall:.45,hold:4},bass:{bright:.22,mid:.85}},
 // A resonant, sliding acid line on the bass voice, its filter breathing over sixteen bars.
 acidhouse:{kit:{id:'acid',kick:{click:.6,decay:.13,drive:2.6,length:.44,hold:.11,tail:.06},kickHz:54,hatTone:1.5},levels:{hatO:.9,cowbell:.4},ghostHats:.1,
  bass:{kind:'acid',sub:.35,mid:1,steps:1,bright:.5,q:15,low:280,high:2600,cycle:16,slide:.3,accent:.35,drive:2.4},sidechain:{floor:.42,release:.1}},
 // Long filter builds over each 32-bar phrase on pads and leads; a tight kick, more pump.
 progressive:{kit:{id:'progressive',kick:{click:.45,decay:.13,drive:2.2,length:.46,hold:.12,tail:.07},kickHz:50,hatTone:1.4},levels:{hat:1.35,hatO:.95},ghostHats:.12,
  chords:{kind:'pad',level:1.3,hall:.5,hold:12,map:{organ:'pad',rhodes:'pad',keys:'pad'}},lead:{map:{saw:'supersaw',keys:'supersaw',organ:'organ'},echo:.32},build:{bars:32,low:500,high:14000},sidechain:{floor:.3,release:.14}},
 // Airy: mallet plucks, a soft kick, more hall and echo, light hats.
 tropical:{kit:{id:'tropical',kick:{click:.25,decay:.17,drive:1.6,length:.5,hold:.13,tail:.09},kickHz:50,hatTone:1.35},levels:{kick:.42,hat:1.1,shaker:1.3,conga:.7},room:{conga:.35},echo:{conga:.1},ghostHats:.2,
  bass:{bright:.22,sub:.55,mid:.6},lead:{kind:'mallet',level:.85,hall:.35,echo:.32,map:{steel:'mallet',kalimba:'mallet'}},chords:{kind:'mallet',hall:.45},sidechain:{floor:.45,release:.15}}
});
const plainObj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
function freezeDeep(o){if(plainObj(o)){for(const v of Object.values(o))freezeDeep(v);Object.freeze(o);}return o;}
function touched(base,touch){if(!touch)return base;const out={...base};for(const [k,v] of Object.entries(touch)){const b=base[k];
 out[k]=plainObj(v)&&plainObj(b)?Object.fromEntries([...Object.entries(b),...Object.entries(v).map(([k2,v2])=>[k2,plainObj(v2)&&plainObj(b[k2])?{...b[k2],...v2}:v2])]):v;}return freezeDeep(out);}
const PROFILES=Object.freeze({tech:TECH,house:HOUSE});
const CLASSIC=Object.freeze({ready:false});
const MEMO=new Map();
export function soundProfile(genre){let p=MEMO.get(genre);if(!p){const f=soundFamily(genre);p=f&&PROFILES[f.id]?Object.freeze({family:f.id,name:f.name,...touched(PROFILES[f.id],GENRE_TOUCH[genre])}):Object.freeze({family:f?.id||null,name:f?.name||null,...CLASSIC});if(MEMO.size<128)MEMO.set(genre,p);}return p;}
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
