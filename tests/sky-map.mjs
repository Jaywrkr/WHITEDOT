import assert from 'node:assert/strict';
import {SKY_VERSION,SKY_CELL,SKY_MARGIN,SKY_SHARE,SKY_REWARD,SKY_TOUCH,SKY_PULSE,SKY_MAX_OPEN,SKY_MAX_DONE,SKY_STAR_GAIN,SKY_MOTIF_GAIN,SKY_FIGURES,SKY_SERIES,skyFigure,skySeries,skyLines,skyCell,skyStar,skyStars,skyEligible,skyStep,skyReward,skyDifficulty,skyRarity,skyNote,skyNight,skyDirection,skyForced,skySeriesProgress,skyZodiacComplete,normalizeSkyMap} from '../src/sky-map-model.js';
// Mapa del cielo (F1, Jay, 28 Oct 2026): the catalog, where the figures are (from hashKey, never the old random
// sequence), joining in order, the save (half-done kept, futures kept), the rewards and the series.
const ids=SKY_FIGURES.map(f=>f.id);assert.equal(new Set(ids).size,ids.length);assert.equal(SKY_FIGURES.length,28);
const names=SKY_FIGURES.map(f=>f.name);
for(const n of ['Orión','Osa Mayor','Casiopea','Cruz del Sur','Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis','Gato','Vinilo','Auricular','Cubo','Ballena','Cohete','Guitarra','La Mano'])assert(names.includes(n),n);
assert.deepEqual(SKY_SERIES.map(s=>[s.id,skySeries(s.id).length]),[['zodiaco',12],['norte',5],['sur',3],['propias',8]]);
for(const f of SKY_FIGURES){
 assert(f.stars.length>=4&&f.stars.length<=8,f.id);assert(f.motif.length>=5&&f.motif.length<=8,f.id+': a motif of 5–8 notes');
 assert.equal(f.from.length,f.stars.length);assert.equal(f.from[0],-1,f.id);f.from.forEach((a,i)=>assert(a===-1||a>=0&&a<i,f.id+' line '+i));
 for(const [a,b] of f.extra)assert(a>=0&&b>=0&&a<f.stars.length&&b<f.stars.length&&a!==b,f.id);
 for(const [x,y] of f.stars)assert(Math.abs(x)<=1&&Math.abs(y)<=1,f.id);assert(skyLines(f).length>=f.stars.length-2,f.id);}
// La Mano: the secret wink, a legend from 50 km; the zodiac along the band, from 5 km; the two bears and the cross in their half.
const mano=skyFigure('mano');assert(mano.secret&&mano.legend&&mano.km===50);assert(!skyEligible(mano,{km:49}));assert(skyEligible(mano,{km:51}));
assert(!skyEligible(skyFigure('cruzdelsur'),{km:1,y:-20000})&&skyEligible(skyFigure('cruzdelsur'),{km:1,y:20000}),'the Southern Cross in the south');
assert(!skyEligible(skyFigure('osamayor'),{km:6,y:60000})&&skyEligible(skyFigure('osamayor'),{km:6,y:-60000}),'the Great Bear in the north');
assert(!skyEligible(skyFigure('leo'),{km:3,y:0})&&skyEligible(skyFigure('leo'),{km:6,y:0})&&!skyEligible(skyFigure('leo'),{km:30,y:200000}),'the zodiac along the band, from 5 km');
assert(!skyEligible(skyFigure('cisne'),{km:6,y:-60000,night:false})&&skyEligible(skyFigure('cisne'),{km:6,y:-60000,night:true}),'some only at night');
// Placement: from hashKey alone. The same world gives the same figures; another world, others. Nothing reads Math.random.
const under=biome=>()=>({biome,region:null}),random=Math.random;Math.random=()=>{throw Error('the old random sequence is never read');};
try{
 const a=skyCell('w1',3,-2,under('llanura')),b=skyCell('w1',3,-2,under('llanura'));assert.deepEqual(a,b);
 const grid=(world,u,night=false,n=60)=>{const out=[];for(let i=-n/2;i<n/2;i++)for(let j=-n/2;j<n/2;j++){const s=skyCell(world,i,j,u,{night});if(s)out.push(s);}return out;};
 const day=grid('w1',under('llanura')),night=grid('w1',under('llanura'),true),cells=3600;
 // About one cell in six on open land by day, more at night; more in the Void and the Pulsars, most in Constelaciones.
 assert(Math.abs(day.length/cells-SKY_SHARE.base)<.03,day.length);assert(Math.abs(night.length/cells-(SKY_SHARE.base+SKY_SHARE.night))<.03,night.length);
 const voids=grid('w1',under('vacio')).length,pulsars=grid('w1',under('faros')).length,abyss=grid('w1',()=>({biome:'vacio',region:'constelaciones'})).length;
 assert(voids>day.length*1.5&&pulsars>day.length*1.5&&abyss>voids,JSON.stringify({day:day.length,voids,pulsars,abyss}));
 // Night only adds: every day figure is there at night, the same figure in the same place (the map does not move).
 const atNight=new Map(night.map(s=>[s.id,s]));for(const s of day)assert.deepEqual(atNight.get(s.id),s);
 assert(night.some(s=>s.kind==='night')&&day.every(s=>s.kind==='day'));
 // Off the cell's edges: two figures are always at least 2 km apart (0.4 of a cell).
 for(const s of night){const i=Math.floor(s.x/SKY_CELL),j=Math.floor(s.y/SKY_CELL);assert(s.x>=(i+SKY_MARGIN)*SKY_CELL-1e-6&&s.x<=(i+1-SKY_MARGIN)*SKY_CELL+1e-6&&s.y>=(j+SKY_MARGIN)*SKY_CELL-1e-6);}
 // Within 5 km only short figures; the zodiac and Orion from 5 km; long and rare ones from 20 km; La Mano from 50 km.
 for(const s of night){const km=Math.hypot(s.x,s.y)/10000,f=skyFigure(s.fig);assert(km>=f.km,s.fig+' at '+km.toFixed(1));if(f.side==='sur')assert(s.y>SKY_CELL);if(f.side==='norte')assert(s.y<-SKY_CELL);if(f.night)assert.equal(s.kind,'night');}
 const near=grid('w1',under('vacio'),true,12);assert(near.length>10);assert(near.every(s=>skyFigure(s.fig).km<5));
 const far=[];for(let i=1000;i<1060;i++)for(let j=-6;j<6;j++){const s=skyCell('w1',i,j,under('vacio'),{night:true});if(s)far.push(s);}
 assert(far.some(s=>s.fig==='mano'),'La Mano far away');const mean=pick=>{const list=SKY_FIGURES.filter(pick);return far.filter(s=>list.includes(skyFigure(s.fig))).length/list.length;};assert(mean(f=>f.km>=20&&!f.legend)>mean(f=>f.km===0)*3,'far away, the far figures come more');
 const other=grid('w2',under('llanura'));assert.notDeepEqual(other.map(s=>s.id+s.fig),day.map(s=>s.id+s.fig));
}finally{Math.random=random;}
// Joining in order: only the next star lights by touch; a pulse on time near the next one lights it, and the one after
// if that one is near the pulse too; off time does nothing.
const site={id:'t',fig:'orion',x:0,y:0,turn:0,lit:0,done:false,onTime:false},st=k=>skyStar(site,k);
assert.equal(skyStars(site).length,7);
assert.equal(skyStep(site,st(3)).lit,0,'another star does not count');assert.equal(site.lit,0);
assert.equal(skyStep(site,st(0)).lit,1);assert.equal(site.lit,1);
assert.equal(skyStep(site,{x:999,y:999},[{...st(1),beat:false}]).lit,0,'off time does not count');
const both=skyStep(site,{x:999,y:999},[{x:(st(1).x+st(2).x)/2,y:(st(1).y+st(2).y)/2,beat:true}]);assert.equal(both.lit,2,'a pulse on time counts double when the next two are near');assert(both.onTime&&site.onTime);
assert.equal(skyStep(site,{x:st(3).x+SKY_TOUCH-1,y:st(3).y}).lit,1);
for(let k=site.lit;k<7;k++)skyStep(site,st(k));assert(site.done&&site.lit===7);assert.equal(skyStep(site,st(0)).lit,0,'done stays done');
// Rewards (H1, Jay, alpha.233), the first time only: base 4 × difficulty (stars) × distance × rarity, ×1.5 on time.
const at=(fig,km,onTime=false)=>skyReward({fig,x:km*10000,y:0,onTime},true);
assert.equal(at('casiopea',1),4,'small and near: a few');assert.equal(at('casiopea',1,true),6);assert.equal(at('orion',6),9,'7 stars, past 5 km');assert.equal(at('ballena',25),24,'8 stars, far and rare');
assert.equal(at('mano',60),54,'the legend, far: the most');assert.equal(at('mano',60,true),81);assert.equal(skyReward({fig:'gato',onTime:true},false),0,'a copy pays nothing');
assert.equal(skyDifficulty(skyFigure('ballena')),2);assert.equal(skyRarity(skyFigure('cisne')),1.5);assert.equal(skyRarity(skyFigure('mano')),3);assert.equal(skyRarity(skyFigure('lira')),1);
assert(SKY_REWARD.base>=4&&SKY_REWARD.base<6&&SKY_REWARD.onTime>SKY_REWARD.base&&SKY_STAR_GAIN<=.012&&SKY_MOTIF_GAIN<=.02);
// Notes: in the scale, from its tonic.
const dorian=[0,2,3,5,7,9,10];assert.equal(skyNote(dorian,69,0),69);assert.equal(skyNote(dorian,69,2),72);assert.equal(skyNote(dorian,69,7),81);assert.equal(skyNote(dorian,69,-1),67);assert.equal(skyNote(null,60,4),67);
// Words and the hour.
assert.equal(skyDirection({x:0,y:0},{x:0,y:-5000}),'al norte');assert.equal(skyDirection({x:0,y:0},{x:5000,y:5000}),'al sureste');assert.equal(skyDirection({x:0,y:0},{x:10,y:0}),'aquí');
assert(skyNight(22)&&skyNight(3)&&!skyNight(12)&&!skyNight(19));
assert.equal(skyForced('?cielo=orion'),'orion');assert.equal(skyForced('?cielo=nada'),null);assert.equal(skyForced(''),null);
// The save: new, migrated without losing anything, a later version kept as it is.
const fresh=normalizeSkyMap(undefined);assert.deepEqual(fresh,{version:SKY_VERSION,figures:{},sites:{},earned:0,halo:null,wear:{}});
const future={version:SKY_VERSION+1,whatever:true};assert.equal(normalizeSkyMap(future),future);
const raw={figures:{orion:{first:'2026-10-28',done:2,onTime:5},futura:{first:'',done:1},__proto__:{done:1}},earned:-3,wear:{halo:true},extraField:7,
 sites:{a:{fig:'orion',x:1,y:2,lit:3},b:{fig:'orion',x:1,y:2,lit:99},c:{fig:'gato',x:'no',y:2,lit:1},d:{fig:'futura',x:5,y:5,lit:2},e:{fig:'cubo',x:0,y:0,lit:0},f:{fig:'cubo',x:0,y:0,lit:0,done:true}}};
const q=normalizeSkyMap(raw);assert.equal(q.extraField,7,'unknown fields stay');assert.equal(q.figures.orion.onTime,2,'on time never above done');assert(q.figures.futura,'a figure of a later catalog stays');
assert.deepEqual(Object.keys(q.sites).sort(),['a','b','d','f']);assert.equal(q.sites.a.lit,3);assert(!q.sites.a.done);assert(q.sites.b.done&&q.sites.b.lit===7,'all lit is done');assert(q.sites.f.done&&q.sites.f.lit===4);
assert.equal(q.sites.d.lit,2,'a site of a later catalog stays');assert.equal(q.earned,0);assert.equal(q.halo,null);assert.deepEqual(q.wear,{},'no halo, nothing to wear');
assert.deepEqual(normalizeSkyMap(q),q,'normalizing twice changes nothing');
const many={sites:Object.fromEntries([...Array.from({length:SKY_MAX_OPEN+10},(_,i)=>['o'+i,{fig:'gato',x:i,y:0,lit:1}]),...Array.from({length:SKY_MAX_DONE+10},(_,i)=>['d'+i,{fig:'gato',x:i,y:0,lit:5}])])};
const capped=normalizeSkyMap(many),open=Object.keys(capped.sites).filter(k=>k[0]==='o'),done=Object.keys(capped.sites).filter(k=>k[0]==='d');
assert.equal(open.length,SKY_MAX_OPEN);assert.equal(done.length,SKY_MAX_DONE);assert(open.includes('o'+(SKY_MAX_OPEN+9))&&!open.includes('o0'),'the newest kept');
assert.deepEqual(normalizeSkyMap({halo:{at:'2026-10-28'}}).wear,{halo:true},'the halo is on once earned');assert.deepEqual(normalizeSkyMap({halo:{at:'2026-10-28'},wear:{halo:false}}).wear,{halo:false},'and stays off if taken off');
// Series: the zodiac complete is the halo's condition.
const zodiac=normalizeSkyMap({figures:Object.fromEntries(skySeries('zodiaco').map(f=>[f.id,{done:1}]))});assert(skyZodiacComplete(zodiac));assert.deepEqual(skySeriesProgress(zodiac,'zodiaco'),{done:12,total:12});
delete zodiac.figures.leo;assert(!skyZodiacComplete(zodiac));assert.deepEqual(skySeriesProgress(zodiac,'propias'),{done:0,total:8});
console.log('PASS sky map model: 28 figures (12 zodiac, 5 north, 3 south, 8 our own, La Mano a legend), placed from hashKey only (night adds, never moves; more in the Void, the Pulsars and Constelaciones; bands of distance, halves of the map and the zodiac band), joined in order (touch the next, a pulse on time counts double), 10/15 ✦ once, the save migrated and bounded, the zodiac for the halo');
