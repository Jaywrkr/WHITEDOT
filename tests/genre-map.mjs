import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PICK_BPM,pickRange,playTempo,soundingBpm} from '../src/genre-tempo.js';
// Retuning a genre's tempo (docs/UNIVERSO.md) never changes the map: every place keeps its genre, region and saved
// tempo; only the music moves the tempo into the new range when it plays. Golden captured from main (8456caa) over
// 1,326 regions of two worlds.
const GOLDEN={'':'9d82633bf87ad132e86f07b3b73c0e607a3725772516648d2559d660e42cb084','humedal-01':'495743020d6dfebdef95ebb65aa38f4e6d5137d4a0ef27da12d1df9eb7ad2d51'};
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const base=new URL('../src/',import.meta.url);
for(const [seed,golden] of Object.entries(GOLDEN)){
 globalThis.location={search:seed?`?testSeed=${seed}&layout=classic&generation=2`:''};
 const v='?world='+encodeURIComponent(seed),[d,p,w]=await Promise.all(['data','progress','world'].map(n=>import(new URL(n+'.js'+v,base))));const r={};d.initialize(r);p.initialize(r);w.initialize(r);r.S.todayKey='2026-10-13';
 const cells=[];for(let x=-25;x<=25;x+=1)for(let y=-25;y<=25;y+=2){const g=r.regionOfPos((x+.5)*r.WCH,(y+.5)*r.WCH);cells.push([x,y,g.genre,g.z,g.bpm]);
  if(PICK_BPM[g.genre]){const s=soundingBpm(g,r.GEN);assert(s>=r.GEN[g.genre].bpm[0]&&s<=r.GEN[g.genre].bpm[1],`${g.genre} sounds in its new range`);}}
 assert.equal(createHash('sha256').update(JSON.stringify(cells)).digest('hex'),golden,`genres, regions and tempos on the map are unchanged (${seed||'main world'})`);
}
// The same relative point of the range: the low end stays low, the high end stays high.
const g={bpm:[100,110]};assert.equal(playTempo('x',g,105),105);
for(const id of Object.keys(PICK_BPM)){const [a,b]=pickRange(id,{bpm:[0,0]});const G={bpm:[a+10,b+10]};assert.equal(playTempo(id,G,a),a+10);assert.equal(playTempo(id,G,b),b+10);}
console.log('PASS genre map: retuned genres keep every place and region of two worlds, and play at the same point of their new tempo range');
