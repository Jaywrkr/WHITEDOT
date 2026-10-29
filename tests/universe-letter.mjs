// Ganas de volver (alpha.236) · carta del universo: after a few hours away, one short line from real game data, chosen
// with hashKey of the day, once per opening, without humans, no reward; the save migrates and a future one is only read.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LETTER_VERSION,LETTER_AWAY_MS,LETTER_DEEDS,LETTER_PLACES,LETTER_TITLE,FIGURE_DEED,normalizeLetter,letterDue,letterPool,letterFor,letterHTML} from '../src/universe-letter.js';
import {LIVE_ENCOUNTERS} from '../src/live-encounters-model.js';
import {SKY_FIGURES} from '../src/sky-map-model.js';
import {PLACE_IDS} from '../src/places.js';
import {EN} from '../src/i18n-en.js';
// Every line names a real encounter of its own biome and a real place; «Tu reflejo» and «Tu eco» are the player's, left out.
const ids=new Set(LIVE_ENCOUNTERS.map(d=>d.id));for(const id of Object.keys(LETTER_DEEDS))assert.ok(ids.has(id),id);
assert.equal(Object.keys(LETTER_DEEDS).length,LIVE_ENCOUNTERS.length-2);assert.ok(!LETTER_DEEDS.reflejo&&!LETTER_DEEDS.eco);
assert.deepEqual(Object.keys(LETTER_PLACES).sort(),[...PLACE_IDS].sort());
// No humans in the universe: no people, no names of people, nobody but creatures, light and weather.
const HUMAN=/\b(persona|gente|hombre|mujer|niñ[oa]|alguien|viajer[oa]|pastor|pescador|explorador|habitante|vecin[oa]|tú|usted)\b/i;
for(const text of [...Object.values(LETTER_DEEDS),FIGURE_DEED,LETTER_TITLE])assert.ok(!HUMAN.test(text),text);
// Short: one idea, one sentence.
for(const t of Object.values(LETTER_DEEDS)){const line=t.replace('{}','los Cristales');assert.ok(line.length<=60,line);assert.equal(line.split('. ').length,1);}
// English for each line and place (src/i18n-en.js).
for(const k of [...Object.values(LETTER_DEEDS),FIGURE_DEED,LETTER_TITLE,...Object.values(LETTER_PLACES)])assert.ok(EN[k],'English for '+k);
// The save: migrates, keeps unknown fields, and a future version is only read.
{const q=normalizeLetter(undefined);assert.deepEqual(q,{version:LETTER_VERSION,seenAt:0,count:0,last:null});
 const old=normalizeLetter({seenAt:1000,count:2,last:{day:'2026-10-28',text:'x'},other:7});assert.equal(old.other,7);assert.equal(old.count,2);assert.equal(old.last.text,'x');
 const bad=normalizeLetter({seenAt:-4,count:'3',last:{text:5}});assert.equal(bad.seenAt,0);assert.equal(bad.count,0);assert.equal(bad.last,null);
 const future={version:LETTER_VERSION+1,seenAt:1};assert.equal(normalizeLetter(future),future);assert.equal(letterDue(future,1e15),false);}
// Due only after a few hours away, and never on a first opening.
{const now=Date.UTC(2026,9,29,12);assert.equal(LETTER_AWAY_MS,4*3600e3);
 assert.equal(letterDue({version:1,seenAt:0},now),false,'a first opening has nothing to tell');
 assert.equal(letterDue({version:1,seenAt:now-3*3600e3},now),false);assert.equal(letterDue({version:1,seenAt:now-4*3600e3},now),true);assert.equal(letterDue({version:1,seenAt:now-50*3600e3},now),true);}
// From what the player knows first: encounters met, places seen, constellations joined.
{const none=letterPool({});assert.equal(none.length,Object.keys(LETTER_DEEDS).length,'nothing known yet: the whole universe');
 const lake=letterPool({lugares:{seen:{lago:true}}});assert.deepEqual(lake.map(l=>l.id).sort(),['live:burbujas','live:ola','live:pez']);assert.ok(lake.every(l=>l.text.endsWith('el Lago.')));
 const met=letterPool({liveEncounters:{kinds:{caravana:{caught:1}}},skyMap:{figures:{orion:{done:1},osamayor:{done:0}}}});
 assert.deepEqual(met.map(l=>l.id),['live:caravana','sky:orion']);assert.equal(met[0].text,'Una caravana acampó en las Dunas.');assert.equal(met[1].text,SKY_FIGURES.find(f=>f.id==='orion').name+' brilló un rato sobre el Refugio.');
 // Chosen with hashKey of the day (and how many letters came): the same day gives the same line, other days vary.
 const state={lugares:{seen:{lago:true,dunas:true,llanura:true}}};const a=letterFor(state,'2026-10-29',0),b=letterFor(state,'2026-10-29',0);assert.deepEqual(a,b);
 const seen=new Set();for(let d=1;d<=28;d++)seen.add(letterFor(state,'2026-11-'+String(d).padStart(2,'0'),0).id);assert.ok(seen.size>=5,'different days, different letters: '+seen.size);
 assert.ok(letterPool(state).some(l=>l.id===a.id));}
// Shown as a small notice: the title, then the line, escaped.
assert.equal(letterHTML('Una <b>ola</b>.'),'<em>Mientras no estabas</em><br>Una &lt;b&gt;ola&lt;/b&gt;.');
// No reward and no random sequence; wired once; the notice can be closed with a tap; it waits out the Journey and levels.
const src=readFileSync(new URL('../src/universe-letter.js',import.meta.url),'utf8').replace(/\/\/.*$/gm,'');
assert.ok(!/spark|chispa|✦|Math\.random|runtime\.rng\(|unlock\(/i.test(src),'no reward, no random sequence');
for(const guard of ['journeyQuiet','freeOpen(','placeRun','#returnEntrance','universeTexts===false','activityActive','liveEncounterActive'])assert.ok(src.includes(guard),guard);
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8'),sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8'),css=readFileSync(new URL('../styles/estilo-j.css',import.meta.url),'utf8');
assert.equal(sw.split('"./src/universe-letter.js"').length,2);assert.match(main,/universeLetter\(runtime\)/);assert.match(css,/#toast\[data-detail="carta"\]\{pointer-events:auto/);
console.log('PASS universe letter: real encounters and places, what you know first, hashKey of the day, after four hours away, no humans, English, no reward, migrates and reads future saves');
