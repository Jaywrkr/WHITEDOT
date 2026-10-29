// Reto entre dos (Jay, 29 Oct 2026, alpha.239, «Con Luca»; docs/MUNDO.md#con-luca): two people on the same phone, no
// account, no network. One leaves a mark (a time) in a place already complete; the other tries to beat it. Two simple
// players (a short name and a symbol; nothing personal), one mark per place with the path of its round, so the rival's
// ghost can run with you. The end compares without punishing: «¡Nueva marca!» or «Casi: a 1,2 s». A challenge round is
// an ordinary round: the same ★, the same song, no sparks; only the mark is its own, and it can be erased.
// No page or canvas here; duos.js wires it. Nothing uses the old random numbers.
import {PLACE_IDS,complete,roundTime} from './places.js';
import {normalizeGhost} from './ritmo-model.js';
export const DUOS_VERSION=1;
// The symbols a player can take (white, never ★ or ✦, which are gold and earned) and the longest name.
export const DUO_SYMBOLS=Object.freeze(['●','▲','■','◆','✚','◯']);
export const DUO_NAME_MAX=8;
export const DUO_DEFAULTS=Object.freeze([Object.freeze({name:'Uno',sym:'●'}),Object.freeze({name:'Dos',sym:'▲'})]);
// «Casi» up to ten seconds behind; past that, how far, as plainly.
export const DUO_NEAR=10000;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const share=v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):0;
// A name: letters, digits, spaces and a few marks, at most eight, never empty (then the default).
export function cleanName(v,fallback){const s=typeof v==='string'?v.normalize('NFC').replace(/[^\p{L}\p{N} ._'-]/gu,'').replace(/\s+/g,' ').trim():'';return [...s].slice(0,DUO_NAME_MAX).join('').trim()||fallback;}
const player=(raw,i)=>{const d=DUO_DEFAULTS[i],q=plain(raw)?raw:{};return {...q,name:cleanName(q.name,d.name),sym:DUO_SYMBOLS.includes(q.sym)?q.sym:d.sym};};
// A kept mark: who (0 or 1), the time, the share on time, with or without sound, calm or not, the day, and the path.
export function normalizeMark(raw){if(!plain(raw)||!Number.isFinite(raw.ms)||raw.ms<=0||![0,1].includes(raw.by))return null;const g=normalizeGhost(raw.ghost);
 const m={...raw,by:raw.by,ms:Math.round(raw.ms),onTime:share(raw.onTime),sound:raw.sound!==false,calm:raw.calm===true,day:typeof raw.day==='string'?raw.day.slice(0,24):''};if(g)m.ghost=g;else delete m.ghost;return m;}
// The save (S.duos): the two players, whose turn it is, the last place chosen and one mark per place. Unknown fields are
// kept; a later version is left untouched (and nothing is written to it).
export function normalizeDuos(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>DUOS_VERSION)return raw;const q=plain(raw)?raw:{};
 const list=Array.isArray(q.players)?q.players:[],players=[0,1].map(i=>player(list[i],i)),marks={};
 if(plain(q.marks))for(const id of PLACE_IDS){const m=normalizeMark(q.marks[id]);if(m)marks[id]=m;}
 return {...q,version:DUOS_VERSION,players,turn:q.turn===1?1:0,place:PLACE_IDS.includes(q.place)?q.place:null,marks};}
export const duosWritable=d=>d?.version===DUOS_VERSION;
// A challenge is offered in a place already complete (the round is known), never in a locked or future save.
export const duoOffered=(places,id)=>!!places&&!places.readOnly&&PLACE_IDS.includes(id)&&complete(places,id);
export const duoPlaces=places=>PLACE_IDS.filter(id=>duoOffered(places,id));
// How a time compares with the mark: the first, a new mark, a tie (same tenth), near (within 10 s) or further.
export const tenths=ms=>Math.round(Math.max(0,ms)/100);
export function duoCompare(mark,ms){if(!Number.isFinite(ms)||ms<=0)return null;if(!mark)return {kind:'first',gap:0};const a=tenths(ms),b=tenths(mark.ms);
 if(a<b)return {kind:'record',gap:(b-a)*100};if(a===b)return {kind:'tie',gap:0};return {kind:(a-b)*100<=DUO_NEAR?'near':'far',gap:(a-b)*100};}
// Seconds with a tenth, the Spanish way: 1200 → «1,2».
export const gapText=ms=>(Math.max(0,tenths(ms))/10).toFixed(1).replace('.',',');
// What the mark says before a round: whose, its time, and the question.
export const markLine=mark=>mark?{lead:'Marca de',time:roundTime(mark.ms),ask:'¿la superas?'}:null;
// The end of a challenge round, without punishment: the mark beaten, a tie, close, or further.
export function resultLine(cmp){if(!cmp)return null;switch(cmp.kind){case 'first':return 'Primera marca.';case 'record':return '¡Nueva marca!';case 'tie':return 'Empate con la marca.';
 case 'near':return `Casi: a ${gapText(cmp.gap)} s.`;default:return `A ${gapText(cmp.gap)} s de la marca.`;}}
// The mark kept after a round: the new one when it is the first or better; the old one otherwise.
export function duoKeep(marks,id,{by,ms,onTime=0,sound=true,calm=false,day='',ghost=null}){const old=marks?.[id]||null,cmp=duoCompare(old,ms);if(!cmp)return {mark:old,cmp:null,changed:false};
 if(cmp.kind!=='first'&&cmp.kind!=='record')return {mark:old,cmp,changed:false};
 return {mark:normalizeMark({by,ms,onTime,sound,calm,day,ghost}),cmp,changed:true};}
// The other player: whose turn it is after a round.
export const other=i=>i===1?0:1;
