import assert from 'node:assert/strict';
import {MISCHIEF,mischiefCell,createMischief,stepMischief,normalizeMischief} from '../src/universe-mischief-model.js';import {drawMischief} from '../src/universe-mischief-art.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
let occupied=0;const kinds=new Set();for(let x=-30;x<30;x++)for(let y=-30;y<30;y++){const a=mischiefCell(x,y,seedOf);assert.deepEqual(a,mischiefCell(x,y,seedOf));occupied+=a.length;for(const q of a)kinds.add(q.kind);}assert.equal(kinds.size,10);assert(occupied>350&&occupied<520);
globalThis.Path2D=class{};const c=new Proxy({globalAlpha:1},{get:(o,k)=>o[k]??((...a)=>{for(const n of a)if(typeof n==='number')assert(Number.isFinite(n),k);return k==='createLinearGradient'?{addColorStop(){}}:undefined;}),set:(o,k,v)=>(o[k]=v,true)});
const tricks=new Set();let solved=0;for(const reduced of [false,true])for(let seed=0;seed<12;seed++)for(const {id}of MISCHIEF){
 const p={x:0,y:0},s=createMischief({id:'fixture:'+id,kind:id,x:0,y:0,seed,target:id==='helper'?{id:'real',x:130,y:0,size:3}:id==='dance'?{id:'real-totem',kind:'stack',x:0,y:0}:null},p),opts={reduced};
 const step=()=>stepMischief(s,p,.05,opts),wait=n=>{for(let i=0;i<Math.ceil(n/.05)&&!s.done;i++)step();},move=(x,y)=>{for(let i=0;i<2000&&!s.done;i++){const dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);if(d<.1)break;const k=Math.min(1,6/d);p.x+=dx*k;p.y+=dy*k;step();}};step();
 if(id==='helper'){wait(3);move(130,0);opts.broken=true;step();}
 if(id==='imitator'){move(65,0);move(65,65);move(-30,65);move(-30,-20);wait(1);}
 if(id==='rain')for(const q of s.drops)move(q.x,q.y);
 if(id==='shadow'){wait(2);for(const i of [0,2,4])move(s.drops[i].x,s.drops[i].y);move(s.actor.x,s.actor.y);}
 if(id==='audience'){wait(6);move(120,0);move(120,160);move(0,160);wait(4);}
 if(id==='dance'){move(65,0);for(let i=0;i<180&&!s.done;i++){const a=i*.08;move(Math.cos(a)*65,Math.sin(a)*65);}wait(3);}
 if(id==='race'){wait(4);move(s.goal.x,s.goal.y);}
 if(id==='breath'){wait(8.2);move(135,0);wait(1.5);}
 if(id==='twin'){wait(1.7);move(110,0);wait(3);for(const q of s.drops)move(q.x,q.y);}
 if(id==='farewell'){move(120,0);wait(5);}
 assert(s.done,id+' seed '+seed);for(const flag of s.flags)tricks.add(flag);assert(s.notes.length<=8);const before=JSON.stringify(s);drawMischief({cx:c,W:390,H:844,camX:0,camY:0,S:{wx:p.x,wy:p.y},seedOf},s,reduced);assert.equal(JSON.stringify(s),before,'drawing must not alter progress');solved++;
}
const party=createMischief({id:'festival',kind:'audience',x:0,y:0,seed:1},{x:0,y:0});const fan={x:0,y:0};for(let i=0;i<125;i++)stepMischief(party,fan,.05);for(let i=0;i<35;i++){fan.x+=5;stepMischief(party,fan,.05,{totem:{x:170,y:0}});}for(let i=0;i<65;i++)stepMischief(party,fan,.05,{totem:{x:170,y:0}});assert(party.done&&party.festival);tricks.add('festivalManager');for(const id of ['stoneLawyer','badChoreographer','upsideDownWeather','shadowDetective','awkwardSilence','festivalManager','leftFeet','politeLoser','heldLaughter','farewellConductor'])assert(tricks.has(id),'reachable secret '+id);
const future={version:7,opaque:{keep:1}};assert.equal(normalizeMischief(future),future);const old=normalizeMischief({extension:true,counts:{helper:3},done:{site:{kind:'helper'}}});assert(old.extension&&old.counts.helper===3);assert.equal(Object.keys(normalizeMischief({done:Object.fromEntries(Array.from({length:5000},(_,i)=>['x'+i,true]))}).done).length,4096);
console.log('PASS '+solved+' movement/contact solutions across ten scenes and reduced motion, independent placement, bounded notes/saves, future data and finite immutable Canvas rendering');
