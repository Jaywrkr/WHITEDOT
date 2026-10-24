import assert from 'node:assert/strict';
import {tierStep,songChord,SONG_IDS} from '../src/song.js';
import {songPlan,stageEvents,FINAL_ENTRY_BARS,THEME_BARS,FINAL_TAIL_BARS,SONG_BARS_OPEN} from '../src/song-stage.js';
// Plan H4: a layer grows with its stars: ★ a fragment (every other bar), ★★ the whole layer, ★★★ its variation.
const c=songChord([60,64,67]),count=(id,tier,bars=2)=>{let n=0;for(let s=0;s<bars*16;s++)n+=tierStep(id,s,c,tier).length;return n;};
for(const id of SONG_IDS){assert.equal(count(id,0),0,id);assert(count(id,1)<=count(id,2),id);assert(count(id,2)<count(id,3)||id==='faros',id);}
assert.equal(count('jardin',1),8);assert.equal(count('jardin',2),16);assert.equal(count('jardin',3),32,'the arpeggio doubled an octave up');
assert(tierStep('jardin',0,c,3).some(e=>e.soft&&e.midi===tierStep('jardin',0,c,2)[0].midi+12));
assert.deepEqual(tierStep('llanura',16,c,1),[],'★: the second bar is silent');
// The layers follow the chord they are given: C major here, not the old fixed A major.
assert(tierStep('jardin',0,c,2).every(e=>[0,4,7].includes(e.midi%12)));
// Opening the song: eight bars, every won layer in from the start.
const open=songPlan({ids:['llanura','lago']});assert.equal(open.bars,SONG_BARS_OPEN);assert.deepEqual(open.entry,{llanura:0,lago:0});
// The Faros' layer is the cube's theme in the World's key: three notes at ★, six at ★★, doubled at ★★★.
{const f=songPlan({ids:['faros']}),n=tier=>{let q=0;for(let k=0;k<32;k++)q+=stageEvents(f,k,[60,64,67],{tiers:{faros:tier},scale:[0,2,4,5,7,9,11]}).length;return q;};assert.deepEqual([n(1),n(2),n(3)],[3,6,12]);}
// The finale: one layer a bar, then your notes from each place in order, then the theme, then a short tail.
const notes={lago:[60,62,64,65],cueva:[67]},fin=songPlan({final:true,notes});
assert.equal(fin.entry.cueva,10*FINAL_ENTRY_BARS);assert.equal(fin.notesAt,11);assert.deepEqual(fin.noteOrder,['lago','cueva']);assert.equal(fin.themeAt,13);assert.equal(fin.bars,13+THEME_BARS+FINAL_TAIL_BARS);
const tiers=Object.fromEntries(SONG_IDS.map(id=>[id,2])),at=k=>stageEvents(fin,k,[60,64,67],{tiers,notes,scale:[0,2,4,5,7,9,11],tr:0});
assert(at(0).every(e=>e.layer==='llanura'),'bar 0: only the first layer');
const mine=[];for(let k=11*16;k<13*16;k++)for(const e of at(k))if(e.mine)mine.push(e.midi-12);assert.deepEqual(mine,[60,62,64,65,67],'your notes, one bar per place');
const theme=[];for(let k=13*16;k<17*16;k++)for(const e of at(k))if(e.theme)theme.push(e);assert.equal(theme.length,6,'the cube\'s six-note theme');
assert.deepEqual(at(fin.bars*16),[],'then it ends');
console.log('PASS song tiers (H4): ★ fragment, ★★ whole layer, ★★★ variation in the chord given; the song opens eight bars; the finale brings the layers in one a bar, your notes from each place, then the cube\'s theme');
