import assert from 'node:assert/strict';
import {tierStep,songChord,SONG_IDS} from '../src/song.js';
import {THEME,themePitch} from '../src/journey-pulse.js';
import {songPlan,stageEvents,stageCaption,snapToScale,FINAL_ENTRY_BARS,THEME_BARS,CODA_BARS,CODA_PICKUP,SILENCE_BARS,SONG_BARS_OPEN,tonicChord} from '../src/song-stage.js';
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
// The finale: one layer a bar, then your notes from each place in order, a bar of silence, the theme twice, a tail.
const notes={lago:[60,62,64,65],cueva:[67]},fin=songPlan({final:true,notes});
assert.equal(fin.entry.cueva,10*FINAL_ENTRY_BARS);assert.equal(fin.notesAt,11);assert.deepEqual(fin.noteOrder,['lago','cueva']);assert.equal(fin.silenceAt,13);assert.equal(fin.themeAt,13+SILENCE_BARS);assert.equal(fin.bars,fin.themeAt+THEME_BARS+CODA_BARS);assert.equal(fin.codaAt,fin.endAt);
const SC=[0,2,4,5,7,9,11],tiers=Object.fromEntries(SONG_IDS.map(id=>[id,2])),at=(k,more={})=>stageEvents(fin,k,[60,64,67],{tiers,notes,scale:SC,tr:0,...more});
assert(at(0).every(e=>e.layer==='llanura'),'bar 0: only the first layer');
// Plan I4: your notes in the World's scale; on the steps you played them when kept.
const mine=[];for(let k=11*16;k<13*16;k++)for(const e of at(k))if(e.mine)mine.push(e.midi-12);assert.deepEqual(mine,[60,62,64,65,67].map(m=>snapToScale(m,SC,0)),'your notes, one bar per place, in the scale');
assert.equal(snapToScale(61,SC,0),61);assert.equal(snapToScale(60,SC,0),59);assert.equal(snapToScale(70,SC,2),70);assert.equal(snapToScale(60,SC,2),59);
{const ticks={lago:[0,3,3,9]},exact=songPlan({final:true,notes,ticks}),st=[];for(let k=11*16;k<12*16;k++)for(const e of stageEvents(exact,k,[60,64,67],{tiers,notes,scale:SC}))if(e.mine)st.push(k%16);assert.deepEqual(st,[0,3,3,9],'explicit absolute timestamps preserve simultaneous notes and rhythm');}
for(let k=13*16;k<14*16;k++)assert.deepEqual(at(k),[],'a bar of silence before the theme');
const theme=[];for(let k=fin.themeAt*16;k<fin.endAt*16;k++)for(const e of at(k))if(e.theme)theme.push(e);assert.equal(theme.length,12,'the cube\'s theme twice');assert(theme.every(e=>e.what==='stab'&&e.tones.length&&e.tones.every(n=>n<e.midi&&n>=e.midi-12)),'on top of the dub stabs');assert.equal(theme[6].midi-theme[0].midi,7,'the second time a fifth up');
// The Faros' melody keeps silent in the finale until the theme has sounded, and again in the written coda (Q7, D9-C):
// it plays only in the bars a minute's length leaves between them.
{const long=songPlan({final:true,notes,six:.125}),la=k=>stageEvents(long,k,[60,64,67],{tiers,notes,scale:SC,tr:0}),lead=(a,b)=>{let n=0;for(let k=a*16;k<b*16;k++)n+=la(k).filter(e=>e.layer==='faros'&&e.what==='lead').length;return n;};
 assert(long.codaAt>long.endAt);assert.equal(lead(long.entry.faros,long.endAt),0);assert(lead(long.endAt,long.codaAt)>0);assert.equal(lead(long.codaAt,long.bars),0);}
assert.deepEqual(at(fin.bars*16),[],'then it ends');
// Panel 11 (Q7, D9-C, Wintory; dub techno after Jay heard the first renders): with the eleven at ★ (the least that
// reaches the finale) the coda plays the whole theme on top of the stabs at the first pass's pitch, rises (a riser over
// its first two bars) and lands on the tonic with the hit on the last bar's «1»: the tonic on a held sus2 stab, the sub
// on the root, the kick and an impact, a bar long to the cut. Nothing starts after it. The same with every layer at ★★.
for(const tier of [1,2])for(const [scale,tr] of [[SC,0],[[0,2,3,5,7,8,10],3],[undefined,7]]){const plan=songPlan({final:true,notes,six:.125}),all=Object.fromEntries(SONG_IDS.map(id=>[id,tier])),ev=k=>stageEvents(plan,k,[62,65,69],{tiers:all,notes,scale,tr});
 const coda=[];for(let k=plan.codaAt*16;k<plan.bars*16;k++)for(const e of ev(k))if(e.coda)coda.push({...e,k});
 assert.deepEqual(coda.map(e=>e.midi),THEME.map(([d])=>snapToScale(themePitch(d,scale,tr)+12,scale,tr)),'the six notes of the theme, in order');
 assert(coda.every(e=>e.what==='stab'));assert.equal(coda[0].k,plan.codaAt*16+CODA_PICKUP,'from a pickup');
 const last=coda.at(-1);assert.equal(last.k,(plan.bars-1)*16,'the tonic on the last «1»');assert.equal(((last.midi-57-(tr||0))%12+12)%12,0,'the last note is the tonic');
 for(let k=(plan.bars-1)*16+1;k<plan.bars*16;k++)assert.deepEqual(ev(k),[],'nothing starts after the last «1»');
 const end=ev((plan.bars-1)*16),home=tonicChord(scale,tr),sc=scale||[0,2,3,5,7,8,10];assert.deepEqual(end.map(e=>e.what).sort(),['impact','kick','stab','sub']);assert(end.every(e=>e.golpe));
 assert.deepEqual(home.tones.map(n=>((n-57-(tr||0))%12+12)%12),[0,1,4].map(i=>sc[i]),'sus2 on the tonic');assert.deepEqual(new Set(end.find(e=>e.what==='stab').tones.map(n=>n%12)),new Set(home.tones.map(n=>n%12)));assert.equal(end.find(e=>e.what==='sub').midi,home.root);
 assert(end.filter(e=>e.len).every(e=>e.len===16),'a bar long, then the cut');
 const rise=[];for(let k=plan.codaAt*16;k<plan.bars*16;k++)rise.push(...ev(k).filter(e=>e.what==='riser').map(e=>({...e,k})));assert.equal(rise.length,1);assert.equal(rise[0].k+rise[0].len,(plan.bars-1)*16,'the riser lands on the hit');}
// At least a minute: at 120 BPM (a sixteenth of .125 s) the layers play on until 30 bars.
assert.equal(songPlan({final:true,notes,six:.125}).bars,30);assert(songPlan({final:true,notes,six:.09}).bars*16*.09>=60);
console.log('PASS song tiers (H4): ★ fragment, ★★ whole layer, ★★★ variation in the chord given; the song opens eight bars; the finale brings the layers in one a bar, your notes from each place, then a bar of silence and the cube\'s theme twice on the cello, at least a minute (I4)');

// Narration follows the existing phrase plan, including phrases longer than one bar.
{const plan=songPlan({final:true,ids:['lago','bosque'],notes:{lago:[60,62,64],bosque:[65]},ticks:{lago:[0,18,38],bosque:[0]},six:.125});
 assert.equal(stageCaption(plan,-1).phase,'waiting');assert.equal(stageCaption(plan,0).phase,'layers');
 assert.equal(stageCaption(plan,plan.noteStarts.lago*16).text,'Tu frase · Lago');
 assert.equal(stageCaption(plan,plan.noteStarts.bosque*16-1).text,'Tu frase · Lago');
 assert.equal(stageCaption(plan,plan.noteStarts.bosque*16).text,'Tu frase · Bosque');
 assert.equal(stageCaption(plan,plan.silenceAt*16).phase,'space');assert.equal(stageCaption(plan,plan.themeAt*16).phase,'theme');assert.equal(stageCaption(plan,plan.endAt*16).phase,'ending');}

// The actual audible onset wins over future scheduled onsets; rests have zero intensity.
{const {layerPulse}=await import('../src/song-stage.js'),hits=[{layer:'lago',t:1},{layer:'lago',t:1.25},{layer:'bosque',t:1.1}];assert.equal(layerPulse(hits,'lago',.99,.5),0);assert.equal(layerPulse(hits,'lago',1,.5),1);assert.equal(layerPulse(hits,'lago',1.125,.5),.75);assert.equal(layerPulse(hits,'lago',1.25,.5),1);assert.equal(layerPulse(hits,'lago',2,.5),0);}
