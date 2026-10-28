import {HOUSE_OBJECTS,HOUSE_ROOMS,HOUSE_VERSION,houseOwns,roomNeed} from './house-model.js';
import {hashKey} from './universe-regions.js';
// Refugio simple (Jay, 28 Oct 2026, alpha.234): the Refugio is for looking and listening, not for managing. What you earn
// takes its own place in the house; you may move it, you never have to. What you placed by hand stays where you left it.
// Pure: no runtime, no random sequence (hashKey only), so the same save always gives the same house.
export const AUTO_RULE=1;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const INDEX=new Map(HOUSE_OBJECTS.map((d,i)=>[d.id,i]));
// Each kind of thing has a room that suits it: your first pulse in Eco, the memories of places in the Cielo, living
// things in the Jardín de voces and the magic boxes down in the Raíz. A closed room lends its things to Eco.
export function autoRoom(kind){if(kind.startsWith('obj:biome:'))return 'azotea';if(kind.startsWith('obj:life:'))return 'jardin';if(kind.startsWith('obj:box:'))return 'sotano';return 'sala';}
// Rows on each wall (0 ceiling, 1 floor) kept clear of what the room already shows: the shelf, the cards and the
// achievements in Eco, the constellations high in the Cielo, the voices high in the Jardín, the columns and the Core in the Raíz.
const ROWS=Object.freeze({sala:[.62,.76,.9],jardin:[.5,.78],azotea:[.8],sotano:[.24,.4]});
const group=room=>room==='sala'?HOUSE_OBJECTS.map(d=>d.id):HOUSE_OBJECTS.filter(d=>autoRoom(d.id)===room).map(d=>d.id);
// The spot of one kind in one room. It depends only on the kind and the room, so a new arrival never moves the others.
// Across, the step of the bar (five apart, so neighbours spread over the bar); down, a row plus a small fixed lean.
export function autoSpot(kind,room){const list=group(room),i=Math.max(0,list.indexOf(kind)),rows=ROWS[room]||ROWS.sala,step=(i*5+(room==='sala'?0:2))%16,row=Math.floor(i/16)%rows.length,lean=(hashKey('refugio:auto:'+room+':'+kind)-.5)*.06;
 return {room,x:(step+.5)/16,y:Math.max(.05,Math.min(.95,rows[row]+lean))};}
export const autoTarget=(kind,unlocked=['sala'])=>{const want=autoRoom(kind);return autoSpot(kind,unlocked.includes(want)?want:'sala');};
// Places what you own and have not placed. Objects you put away stay away (house.away); objects you moved lose `auto`
// and stay where you left them. The first time (no autoRule), every object already in the house counts as placed by hand.
// Returns the kinds that arrived now. A read-only or future house is never touched.
export function autoDecorate(house,state,{fresh=true}={}){if(!plain(house)||house.readOnly||Number.isInteger(house.version)&&house.version>HOUSE_VERSION)return [];
 if(house.autoRule!==AUTO_RULE){house.autoRule=AUTO_RULE;fresh=false;}
 house.away=plain(house.away)?house.away:{};const unlocked=Array.isArray(house.unlocked)?house.unlocked:['sala'],objects=Array.isArray(house.objects)?house.objects:(house.objects=[]),arrived=[];
 for(const o of objects)if(o&&o.auto===true&&INDEX.has(o.kind)){const t=autoTarget(o.kind,unlocked);if(o.room!==t.room||o.x!==t.x||o.y!==t.y)Object.assign(o,t);}
 for(const d of HOUSE_OBJECTS){if(house.away[d.id]||objects.some(o=>o?.kind===d.id)||!houseOwns(d,state))continue;if(objects.filter(o=>o&&INDEX.has(o.kind)).length>=HOUSE_OBJECTS.length)break;
  objects.push({kind:d.id,...autoTarget(d.id,unlocked),auto:true,...(fresh?{fresh:true}:{})});arrived.push(d.id);}
 return arrived;}
// A hand move: the object keeps the place you gave it from now on.
export function markMoved(house,kind){const o=house?.objects?.find?.(o=>o?.kind===kind);if(o){delete o.auto;delete o.fresh;}if(plain(house?.away))delete house.away[kind];return !!o;}
// A hand put-away: it does not come back by itself.
export function markAway(house,kind){if(!plain(house))return false;house.away={...(plain(house.away)?house.away:{}),[kind]:true};return true;}
// The Jardín de voces fills itself with your four most heard voices: the cards met in the most moments (learning contexts
// and observations), then the rarest, then the newest. Once you choose voices yourself (garden.manual) it is yours.
const TIER={mitico:4,legendario:3,singular:2,raro:1};
export const voiceScore=card=>(Array.isArray(card?.learning?.contexts)?card.learning.contexts.length:0)+(Array.isArray(card?.observations)?card.observations.length:0);
export function favouriteVoices(cards,n=4){return (Array.isArray(cards)?cards:[]).map((c,i)=>({c,i})).filter(e=>e.c&&typeof e.c.id==='string').sort((a,b)=>voiceScore(b.c)-voiceScore(a.c)||(TIER[b.c.odds?.tier]||0)-(TIER[a.c.odds?.tier]||0)||b.i-a.i).slice(0,n).map(e=>e.c.id);}
// Where an automatic voice stands: high in the Jardín, four across.
export const voiceSpot=i=>({room:'jardin',x:[.14,.38,.62,.86][i%4],y:.18});
export function autoGarden(garden,cards,{jardin=false}={}){if(!plain(garden)||garden.readOnly||garden.manual===true||!jardin)return false;const ids=favouriteVoices(cards);if(!ids.length)return false;
 const same=ids.length===garden.cards?.length&&ids.every((id,i)=>garden.cards[i]===id)&&garden.auto===true;if(same)return false;
 if(Array.isArray(garden.cards)&&garden.cards.length&&garden.auto!==true)return false;
 garden.cards=ids;garden.positions={...(plain(garden.positions)?garden.positions:{})};ids.forEach((id,i)=>{garden.positions[id]=voiceSpot(i);});garden.auto=true;return true;}
// One notice only, and only for something new you can see in the house. `look` is what the house shows now; `seen`
// what it showed the last time you were inside. Counts for trophies and ★; lists for the rest (only what is in view).
const LISTS=['objects','sky','pieces','gallery','visitors','rooms','voices'];
export function houseLook({places=0,stars=0,objects=[],sky=[],pieces=[],gallery=[],visitors=[],rooms=[],voices=[]}={}){return {places,stars,objects:[...objects],sky:[...sky],pieces:[...pieces],gallery:[...gallery],visitors:[...visitors],rooms:[...rooms],voices:[...voices]};}
const WORDS=Object.freeze({places:n=>n===1?'1 trofeo':`${n} trofeos`,stars:n=>`${n} ★`,objects:n=>n===1?'1 objeto':`${n} objetos`,sky:n=>n===1?'1 constelación':`${n} constelaciones`,pieces:n=>n===1?'1 pieza':`${n} piezas`,gallery:n=>n===1?'1 tarjeta':`${n} tarjetas`,visitors:n=>n===1?'1 visita':`${n} visitas`,rooms:n=>n===1?'1 sala':`${n} salas`,voices:n=>n===1?'1 voz':`${n} voces`});
export function houseNew(seen,look){if(!plain(seen)||seen.v!==2)return {count:0,parts:[]};const parts=[];
 for(const key of ['rooms','places','stars','objects','sky','voices','gallery','pieces','visitors']){let n=0;
  if(LISTS.includes(key)){const before=new Set(Array.isArray(seen[key])?seen[key]:[]);n=(look[key]||[]).filter(id=>!before.has(id)).length;}
  else n=Math.max(0,(Number.isFinite(look[key])?look[key]:0)-(Number.isFinite(seen[key])?seen[key]:0));
  if(n>0)parts.push({key,n,text:WORDS[key](n)});}
 return {count:parts.reduce((a,p)=>a+p.n,0),parts};}
// What is kept as seen. The old fields (cards, ach) stay for older versions of the game.
export const seenFrom=(look,old={})=>({...(plain(old)?old:{}),v:2,...houseLook(look)});
export const newBadge=n=>n===1?'1 nuevo':`${n} nuevos`;
export const newLine=news=>news.count?'Nuevo: '+news.parts.slice(0,3).map(p=>p.text).join(', '):'';
// A closed room, seen from outside: only the nearer condition, with one number (panel 11, Q4; rule D3 unchanged).
export function roomOpensText(r,progress){const {kind,left:n}=roomNeed(r,progress);if(!n)return '';if(kind==='places')return n===1?'se abre con 1 lugar más':`se abre con ${n} lugares más`;return n===1?'se abre con 1 ★ más':`se abre con ${n} ★ más`;}
export const AUTO_ROOMS=Object.freeze(HOUSE_ROOMS.map(r=>r.id));
