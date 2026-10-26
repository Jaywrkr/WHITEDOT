import {LIVING_CATALOG} from './living-catalog.js';
import {POWER_IDS,POWERS} from './expansion-music.js';
// Panel 10 (P8, D3-B): a room opens by places complete or by ★ (S.lugares), never by days. The Journey's five chapters
// are five places, so the first new room asks one place more. LEGACY_ROOMS keeps the old days-or-achievements rule only
// to migrate older houses on load (save-store.js): every room it opened stays open (roomRule 2 marks a migrated house).
export const HOUSE_ROOMS=Object.freeze([{id:'sala',name:'Eco',places:0,stars:0,cut:8000,echo:.03},{id:'jardin',name:'Jardín de voces',places:6,stars:9,cut:4500,echo:.02},{id:'azotea',name:'Cielo',places:8,stars:15,cut:6500,echo:.08},{id:'sotano',name:'Raíz',places:11,stars:24,cut:2400,echo:.05}].map(Object.freeze));
export const LEGACY_ROOMS=Object.freeze({sala:{days:0,found:0},jardin:{days:3,found:8},azotea:{days:7,found:20},sotano:{days:14,found:40}});
export const HOUSE_ROOM_RULE=2;
export const legacyRoomsOpen=(days=0,found=0)=>HOUSE_ROOMS.filter(r=>LEGACY_ROOMS[r.id].days<=days||LEGACY_ROOMS[r.id].found<=found).map(r=>r.id);
export const roomAsks=r=>r.places+' lugares o '+r.stars+' ★';
const biomes=['llanura','bosque','lago','dunas','cristales','jardin','ruinas','cueva','tormenta','faros','vacio'];
export const HOUSE_OBJECTS=Object.freeze([
 {id:'obj:origen',name:'Pulso de casa',source:'cube:color:ffffff',instrument:'sub',role:'bajo',shape:'square'},
 ...biomes.map((id,i)=>({id:'obj:biome:'+id,name:'Recuerdo · '+id,source:'biome:'+id,achievement:['mundo','arbol1','loto1','cactus1','cristal1','flor1','pilar1','bajo1','percusion4','faro','cielo1'][i],instrument:['rhodes','wood','reed','shaker','metalkeys','kalimba','tom','hollow','rim','sub','strings'][i],role:['lead','perc','lead','perc','lead','lead','perc','lead','perc','bajo','acorde'][i],shape:['branch','pod','wave'][i%3]})),
 ...LIVING_CATALOG.slice(0,22).map((p,i)=>({id:'obj:life:'+p.id,name:p.name,source:'lineage:'+p.id,role:p.role,instrument:p.role==='bajo'?['sub','rubber','machine'][i%3]:p.role==='perc'?['tom','wood','rim'][i%3]:['reed','rhodes','bowed','hollow'][i%4],shape:p.shape})),
 ...POWER_IDS.map((id,i)=>({id:'obj:box:'+id,name:POWERS[id].name,source:'box:'+id,role:i%2?'perc':'bajo',instrument:i%2?'conga':'fm',shape:'box'}))
].map(Object.freeze));
const finite=(v,fallback=0)=>Number.isFinite(v)?v:fallback;
// Version 2 is the dollhouse: same objects and rooms (x is the beat, y the height on the wall, so the
// sequencer is unchanged), plus room for capsule decor, object colours and capsule counts. Version 1 migrates
// in place; anything newer is kept untouched and opened read-only.
export const HOUSE_VERSION=2;
const COLOR=/^#[0-9a-f]{6}$/i,safeId=v=>typeof v==='string'&&v.length>0&&v.length<=60&&!['__proto__','constructor','prototype'].includes(v);
function normalizeDecor(list){const out=[];for(const d of Array.isArray(list)?list:[]){if(!d||!safeId(d.id)||out.length>=60)continue;if(!HOUSE_ROOMS.some(r=>r.id===d.room)){out.push({...d});continue;}out.push({...d,x:Math.max(0,Math.min(1,finite(d.x,.5))),y:Math.max(0,Math.min(1,finite(d.y,.5)))});}return out;}
function normalizeTints(raw){const out={};if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const [k,v]of Object.entries(raw))if(safeId(k)&&typeof v==='string'&&COLOR.test(v))out[k]=v.toLowerCase();return out;}
function normalizeCapsules(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},items={};for(const [k,v]of Object.entries(q.items&&typeof q.items==='object'?q.items:{}))if(safeId(k)&&v)items[k]=v===true?true:v;return {...q,count:Number.isSafeInteger(q.count)&&q.count>=0?q.count:0,items};}
// Rooms open by places complete or by ★ earned, whichever comes first.
export const roomOpens=(r,{places=0,stars=0}={})=>r.places<=places||r.stars<=stars;
// progress: {places,stars} from S.lugares. The old rule is migrated once, on load (save-store.js validateSave).
export function normalizeHouse(raw,progress={}){if(Number.isInteger(raw?.version)&&raw.version>HOUSE_VERSION)return {...raw,readOnly:true,objects:Array.isArray(raw.objects)?raw.objects:[],unlocked:Array.isArray(raw.unlocked)?raw.unlocked:['sala'],knownVisitors:raw.knownVisitors||{}};const objects=[],seen=new Set();for(const p of Array.isArray(raw?.objects)?raw.objects:[]){if(p&&typeof p.kind==='string'&&!HOUSE_OBJECTS.some(d=>d.id===p.kind)&&!seen.has(p.kind)){seen.add(p.kind);objects.push({...p});continue;}if(!p||seen.has(p.kind)||!HOUSE_ROOMS.some(r=>r.id===p.room))continue;seen.add(p.kind);objects.push({...p,kind:p.kind,room:p.room,x:Math.max(0,Math.min(1,finite(p.x,.5))),y:Math.max(0,Math.min(1,finite(p.y,.5)))});}
 const unlocked=[...new Set([...(Array.isArray(raw?.unlocked)?raw.unlocked.filter(id=>HOUSE_ROOMS.some(r=>r.id===id)):[]),...HOUSE_ROOMS.filter(r=>roomOpens(r,progress)).map(r=>r.id)])];
 return {...raw,readOnly:undefined,version:HOUSE_VERSION,roomRule:HOUSE_ROOM_RULE,objects,unlocked,visited:raw?.visited===true,playerRoom:HOUSE_ROOMS.some(r=>r.id===raw?.playerRoom)?raw.playerRoom:'sala',x:Math.max(0,Math.min(1,finite(raw?.x,.5))),y:Math.max(0,Math.min(1,finite(raw?.y,.5))),knownVisitors:raw?.knownVisitors&&typeof raw.knownVisitors==='object'?{...raw.knownVisitors}:{},decor:normalizeDecor(raw?.decor),tints:normalizeTints(raw?.tints),capsules:normalizeCapsules(raw?.capsules)};}
export const houseOwns=(definition,state)=>!!state.rewards?.items?.[definition.id]||!!state.rewards?.items?.[definition.source]||!!(definition.achievement&&state.ach?.[definition.achievement]);
export const houseStep=o=>Math.min(15,Math.floor(o.x*16));
export const houseRegister=o=>o.room==='sotano'?36:36+Math.min(2,Math.floor((1-o.y)*3))*12;
export const houseDegree=o=>Math.min(6,Math.floor((1-o.y)*7));
export const houseGain=(o,player)=>Math.max(.12,Math.min(.65,.65-Math.hypot(o.x-player.x,o.y-player.y)*.4));
export function placeHouseObject(house,kind,room,x,y){if(house.readOnly||!Number.isFinite(x)||!Number.isFinite(y)||!house.unlocked.includes(room)||!HOUSE_OBJECTS.some(p=>p.id===kind))return false;const p={kind,room,x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y))};const existing=house.objects.findIndex(p=>p.kind===kind);if(existing>=0)house.objects[existing]={...house.objects[existing],...p};else if(house.objects.length<HOUSE_OBJECTS.length)house.objects.push(p);else return false;return true;}
const b64=text=>btoa(text).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),unb64=text=>atob(text.replace(/-/g,'+').replace(/_/g,'/'));
// A house with only objects keeps the WH1 code older versions can read; decor or colours need WH2.
export function encodeHouse(house){if(house.readOnly||house.version>HOUSE_VERSION)throw Error('Este refugio necesita una versión más reciente.');const safe=normalizeHouse(house),o=safe.objects.filter(p=>HOUSE_OBJECTS.some(d=>d.id===p?.kind)).map(p=>[p.kind,p.room,Math.round(p.x*1000),Math.round(p.y*1000)]);
 const d=safe.decor.filter(x=>HOUSE_ROOMS.some(r=>r.id===x.room)).map(x=>[x.id,x.room,Math.round(x.x*1000),Math.round(x.y*1000)]),t=safe.tints;
 if(!d.length&&!Object.keys(t).length)return 'WH1-'+b64(JSON.stringify({v:1,r:safe.unlocked,o}));
 return 'WH2-'+b64(JSON.stringify({v:2,r:safe.unlocked,o,d,t}));}
const row=r=>Array.isArray(r)&&r.length===4&&typeof r[0]==='string'&&Number.isFinite(r[2])&&Number.isFinite(r[3]);
export function decodeHouse(text){if(typeof text!=='string'||!/^WH[12]-/.test(text)||text.length>16000)throw Error('Código de refugio inválido.');let p;try{p=JSON.parse(unb64(text.slice(4)));}catch(_){throw Error('Código de refugio dañado.');}
 const v=Number(text[2]);if(p?.v!==v||!Array.isArray(p.o)||p.o.length>40||!p.o.every(row)||v===2&&(!Array.isArray(p.d)||p.d.length>60||!p.d.every(row)))throw Error('Refugio incompatible.');
 return normalizeHouse({unlocked:p.r,objects:p.o.map(([kind,room,x,y])=>({kind,room,x:x/1000,y:y/1000})),decor:(p.d||[]).map(([id,room,x,y])=>({id,room,x:x/1000,y:y/1000})),tints:p.t});}
export function houseSelection(objects,step,bar){const matches=objects.filter(p=>houseStep(p)===step),offset=(bar*4)%Math.max(1,matches.length);return matches.slice(offset,offset+4).concat(matches.slice(0,Math.max(0,offset+4-matches.length))).slice(0,Math.min(4,matches.length));}
