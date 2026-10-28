// Living encounters, clearer (Jay, 28 Oct 2026, alpha.230): each one starts with its name and verb, shows the time
// left in a ring round the cube and a white arrow to the next step, ends visibly (a burst in the biome's light when won;
// drifting away and fading when lost, never a cut) and leaves one summary line. Rules, rewards and frequency unchanged.
import assert from 'node:assert/strict';
import {initialize} from '../src/live-encounters.js';
import {drawLive,liveTimeLeft} from '../src/live-encounters-art.js';
import {LIVE_ENCOUNTERS,LIVE_WORDS,LIVE_REWARD,LIVE_FAREWELL,LIVE_NOTICE,LIVE_SUMMARY,LIVE_EVERY,liveTitle,liveSummary,liveOutcome,liveDefinition,createLive,liveInterval} from '../src/live-encounters-model.js';
globalThis.document={hidden:false,querySelector:()=>null};
// Words: every encounter has a short name and its verb as an order; the summary for every ending.
assert.equal(Object.keys(LIVE_WORDS).length,33);
for(const d of LIVE_ENCOUNTERS){const w=LIVE_WORDS[d.id];assert(w&&w.short&&w.cue,d.id);assert.equal(liveTitle(d.id),d.name+' · '+w.cue);assert(liveTitle(d.id).length<=40,liveTitle(d.id));
 const wins={perseguir:'caught',huir:'safe',hacer:'done'}[d.verb];
 assert.match(liveSummary({kind:d.id,result:wins},15),/ · \+15 ✦$/);assert.match(liveSummary({kind:d.id,result:wins},10),/ · \+10 ✦$/);
 assert.match(liveSummary({kind:d.id,result:'escaped'},0),/ · sin premio$/);
 for(const r of [wins,'escaped',...(d.verb==='huir'?['hit']:[])])assert(liveSummary({kind:d.id,result:r},0).length<=40,liveSummary({kind:d.id,result:r},0));
 if(d.verb==='perseguir')assert(['f','m'].includes(w.g),d.id);}
assert.equal(liveTitle('polilla'),'Polilla de luz · atrápala');
assert.equal(liveSummary({kind:'polilla',result:'caught'},15),'Polilla · atrapada · +15 ✦');assert.equal(liveSummary({kind:'pez',result:'caught'},10),'Pez · atrapado · +10 ✦');
assert.equal(liveSummary({kind:'ola',result:'hit'},0),'Ola · te alcanzó · sin premio');assert.equal(liveSummary({kind:'ola',result:'safe'},15),'Ola · a salvo · +15 ✦');
assert.equal(liveSummary({kind:'motas',result:'done'},10),'Motas · hecho · +10 ✦');assert.equal(liveSummary({kind:'motas',result:'escaped'},0),'Motas · sin terminar · sin premio');
assert.equal(liveSummary({kind:'polilla',result:'escaped'},0),'Polilla · se escapó · sin premio');assert.equal(liveOutcome({kind:'nada',result:'caught'}),'');
// Rules and frequency as they were; rewards ×3 since H1 (alpha.233).
assert.deepEqual({...LIVE_REWARD},{base:30,onTime:45});assert.deepEqual({...LIVE_EVERY},{min:60,max:90});assert.equal(LIVE_FAREWELL,1.4);
// The controller: the notice at the start, the goodbye while it fades, then the summary, each for its time.
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const BIOMES=LIVE_ENCOUNTERS.filter(d=>d.verb==='perseguir').map(d=>({id:d.biome}));
function game(){const r={S:{mode:'world',todayKey:'2026-10-28',layer:'superficie',wx:0,wy:0,sparks:0,sound:false,sparkEconomy:{version:1,earned:0,spent:0,log:[]}},
 worldIdentity:{seed:'clear',generation:2},BIOMES,seedOf,waves:[],regionOfPos:()=>({z:0,sea:false,genre:'deep'}),inWorld(){return true;},save(){return true;},
 get sparkEconomy(){return this.S.sparkEconomy;},toast(){},recordElement(){return true;},showSparkPickup(){},chordTones:()=>[57,60,64,67],vel:n=>n,hookInst(){},beatSoon(){},MU:{step:0},ac:{state:'running'}};initialize(r);return r;}
const tick=(r,seconds)=>{for(let i=0;i<Math.round(seconds/.05);i++)r.liveTick(.05);};
{const r=game();assert(r.liveEncounterSpawn('polilla'));let st=r.liveEncounterState();assert.equal(st.title,'Polilla de luz · atrápala');assert.equal(st.hint,liveDefinition('polilla').line);assert.equal(st.summary,'');
 // Caught with a pulse on time: a summary with its sparks, once the burst is over; the notice goes as soon as it ends.
 const s=st.scene;r.waves.push({x:s.x,y:s.y,origin:'player',beat:true});r.liveTick(.05);st=r.liveEncounterState();assert.equal(st.scene.stage,'caught');assert.equal(st.title,'');
 tick(r,LIVE_FAREWELL+.1);st=r.liveEncounterState();assert(!st.scene);assert.equal(st.summary,'Polilla · atrapada · +45 ✦');assert.equal(r.S.sparks,45);
 tick(r,LIVE_SUMMARY+.1);assert.equal(r.liveEncounterState().summary,'','the summary goes after its time');}
{const r=game();assert(r.liveEncounterSpawn('ola'));tick(r,.2);assert.equal(r.liveEncounterState().title,'Ola gigante · llega al anillo');
 tick(r,LIVE_NOTICE);assert.equal(r.liveEncounterState().title,'','the notice is short');
 // Standing still, the wave reaches the cube: its goodbye while it drifts away, then «… · te alcanzó · sin premio».
 for(let i=0;i<600&&r.liveEncounterState().scene?.stage==='run';i++)r.liveTick(.05);let st=r.liveEncounterState();assert.equal(st.scene.stage,'hit');assert.equal(st.line,liveDefinition('ola').bye);
 tick(r,LIVE_FAREWELL+.1);st=r.liveEncounterState();assert(!st.scene);assert.equal(st.summary,'Ola · te alcanzó · sin premio');assert.equal(r.S.sparks,0);}
{const r=game();assert(r.liveEncounterSpawn('motas'));r.S.wx+=5000;r.liveTick(.05);assert.equal(r.liveEncounterState().scene.stage,'escaped');tick(r,LIVE_FAREWELL+.1);assert.equal(r.liveEncounterState().summary,'Motas · sin terminar · sin premio');}
// Leaving the free World (a level, the Refugio) still ends it at once, with nothing counted and no summary.
{const r=game();assert(r.liveEncounterSpawn('polilla'));r.S.mode='camino';r.inWorld=()=>false;r.liveTick(.05);const st=r.liveEncounterState();assert(!st.scene&&st.summary===''&&st.title==='');}
// Drawing: a canvas that records what is drawn.
// (Like a real context: globalAlpha is an accessor of the prototype, the methods are recorded.)
class Ctx{constructor(){this.calls=[];this._a=1;this.fillStyle='#000';this.strokeStyle='#000';this.lineWidth=1;this.font='';this.stack=[];}get globalAlpha(){return this._a;}set globalAlpha(v){this._a=v;}
 save(){this.stack.push([this._a,this.fillStyle,this.strokeStyle,this.lineWidth,this.font]);}restore(){const s=this.stack.pop();if(s)[this._a,this.fillStyle,this.strokeStyle,this.lineWidth,this.font]=s;}
 createRadialGradient(...a){const g={stops:[],addColorStop:(o,col)=>g.stops.push(col)};this.calls.push({k:'createRadialGradient',a,stops:g.stops});return g;}
 createLinearGradient(...a){return this.createRadialGradient(...a);}}
for(const k of ['arc','fill','fillRect','stroke','strokeRect','beginPath','moveTo','lineTo','closePath','ellipse','fillText','rect','setLineDash','translate','rotate','scale','quadraticCurveTo'])Ctx.prototype[k]=function(...a){this.calls.push({k,a,alpha:this._a,fill:this.fillStyle,stroke:this.strokeStyle,font:this.font});};
function canvas(){return new Ctx();}
const view=(s,cube)=>{const cx=canvas();return {cx,W:390,H:844,camX:cube.x,camY:cube.y,S:{wx:cube.x,wy:cube.y}};};
const arcsAround=(calls,r=20)=>calls.filter(q=>q.k==='arc'&&q.a[0]===195&&q.a[1]===422&&q.a[2]===r);
const sweep=q=>q.a[4]-q.a[3];
for(const kind of ['polilla','ola','derrumbe','motas']){const d=liveDefinition(kind),cube={x:0,y:0},s=createLive(d,{x:200,y:-200,seed:7},cube);s.age=d.life/4;
 const r=view(s,cube);drawLive(r,s,{color:'#eb9a3c',title:liveTitle(kind),hint:d.line});const calls=r.cx.calls;
 // The time ring: a faint full ring and a white arc of the time left (filling for a threat you only have to last).
 const ring=arcsAround(calls).filter(q=>q.stroke==='#ffffff'&&q.alpha>.5);assert(ring.length>=1,kind+': a time ring by the cube');
 const want=d.survive?1-liveTimeLeft(s,d):liveTimeLeft(s,d);assert(ring.some(q=>Math.abs(sweep(q)-want*Math.PI*2)<1e-6),kind+': its arc is the time left');
 // The white arrow to the next step (a filled triangle by the cube or at the edge).
 assert(calls.some(q=>q.k==='fill'&&q.fill==='#ffffff'),kind+': a white arrow');
 // The notice: its name and verb in white, 12 px, inside the screen.
 const title=calls.find(q=>q.k==='fillText'&&q.a[0]===liveTitle(kind));assert(title&&title.fill==='#ffffff'&&/12px/.test(title.font)&&title.a[3]<=358,kind+': the notice');}
// The end: a win bursts in the biome's light; a loss drifts away from the cube and fades; neither cuts.
{const d=liveDefinition('motas'),cube={x:0,y:0},s=createLive(d,{x:200,y:-200,seed:7},cube);s.stage=s.result='done';
 for(const over of [.1,.5]){s.over=over;const r=view(s,cube);drawLive(r,s,{color:'#eb9a3c'});assert(r.cx.calls.some(q=>q.k==='createRadialGradient'&&q.a[0]===195&&q.a[1]===422&&q.a[5]>40&&q.stops[0]==='#eb9a3c'),'a burst in the biome colour, at the cube');}
 s.over=1.2;let r=view(s,cube);drawLive(r,s,{color:'#eb9a3c'});assert(!r.cx.calls.some(q=>q.k==='createRadialGradient'&&q.a[0]===195&&q.a[1]===422&&q.a[5]>40),'brief');}
{const d=liveDefinition('remolino'),cube={x:0,y:0},s=createLive(d,{x:0,y:-200,seed:3},cube);s.x=0;s.y=-120;s.stage=s.result='hit';const at=[];
 for(const over of [0,.5,1]){s.over=over;const r=view(s,cube);drawLive(r,s,{color:'#eb9a3c',line:d.bye});const g=r.cx.calls.filter(q=>q.k==='createRadialGradient');at.push(g.length?g[0]:null);
  const bye=r.cx.calls.find(q=>q.k==='fillText');assert.equal(bye.a[0],d.bye);}
 assert(at.every(Boolean),'the threat is drawn while it fades (no cut)');}
{const d=liveDefinition('remolino'),cube={x:0,y:0},s=createLive(d,{x:0,y:-200,seed:3},cube);s.x=0;s.y=-120;s.stage=s.result='hit';
 const ys=[0,.7,1.3].map(over=>{s.over=over;const r=view(s,cube),pts=[];r.cx.calls.length=0;drawLive(r,s,{color:'#eb9a3c'});return r.cx.calls.filter(q=>q.k==='fillRect').map(q=>q.a[1]);});
 const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;assert(mean(ys[1])<mean(ys[0])-20&&mean(ys[2])<mean(ys[1]),'it drifts away from the cube');
 const alphas=[0,.7,1.3].map(over=>{s.over=over;const r=view(s,cube);drawLive(r,s,{color:'#eb9a3c'});return Math.max(...r.cx.calls.filter(q=>q.k==='fillRect').map(q=>q.alpha));});assert(alphas[0]>alphas[1]&&alphas[1]>alphas[2]&&alphas[2]>0,'and fades');}
// The summary, alone, in white.
{const r={cx:canvas(),W:390,H:844,camX:0,camY:0,S:{wx:0,wy:0}};drawLive(r,null,{summary:'Polilla · atrapada · +15 ✦'});const t=r.cx.calls.find(q=>q.k==='fillText');assert.equal(t.a[0],'Polilla · atrapada · +15 ✦');assert.equal(t.fill,'#ffffff');}
console.log('PASS living encounters, clearer: name and verb at the start, the time ring and the white arrow for every verb, a burst in the biome\'s light when won, a slow fading drift when lost, one summary line («Polilla · atrapada · +15 ✦», «Ola · te alcanzó · sin premio»); rules, rewards and frequency unchanged');
