import assert from 'node:assert/strict';
import {KEY_REACH,normalizeKeys,keyHere,landmarkScore,keySection,initialize} from '../src/theme-key.js';
import {THEME} from '../src/journey-pulse.js';
// Saved keys are cleaned: only landmark and superbiome ids, a day and a name; anything else is dropped.
assert.deepEqual(normalizeKeys({'lm:2,0':{d:'2026-10-23',n:'Estrella guía'},'super:faros:dnb':{d:1},x:{d:1},'lm:1,1':'no'}),{'lm:2,0':{d:'2026-10-23',n:'Estrella guía'},'super:faros:dnb':{d:1,n:''}});assert.deepEqual(normalizeKeys([]),{});
// What opens: the nearest landmark within reach, else a rare superbiome; a common one opens nothing.
const lm={id:'lm:2,0',name:'Estrella guía de Polvo',d:KEY_REACH-1,motif:[0,2,1],steps:[0,4,8]};
assert.equal(keyHere([lm],{id:'llanura:house',rarity:'comun'}).kind,'landmark');assert.equal(keyHere([{...lm,d:KEY_REACH+1}],{id:'llanura:house',rarity:'comun'}),null);
assert.deepEqual(keyHere([],{id:'faros:dnb',name:'Púlsares · DnB',rarity:'muy-raro'}),{id:'super:faros:dnb',name:'Púlsares · DnB',kind:'superbiome'});
// The landmark's answer: its motif, then the whole theme after it, on a beat.
const score=landmarkScore([0,2,1],[0,4,8],[57,60,64],[0,2,3,5,7,8,10],0),motif=score.filter(n=>!n.theme),theme=score.filter(n=>n.theme);
assert.equal(motif.length,3);assert.equal(theme.length,THEME.length);assert(theme[0].at>motif.at(-1).at&&theme[0].at%4===0,'the theme starts on a beat after the motif');assert(motif.every(n=>n.midi>=55&&n.midi<=72));
// The Journal.
assert.match(keySection({}),/Toca el tema completo/);const html=keySection({universe:{keys:{'lm:2,0':{d:1,n:'Estrella <b>'}}}});assert.match(html,/Llaves · 1/);assert(!html.includes('<b>'));
// Runtime: only in the free World, kept once with its day, answered every time.
let saves=0,toasts=0;const r={S:{universe:{},layer:'superficie',todayKey:'2026-10-23',sound:false},MU:{},inWorld:()=>true,journeyQuiet:()=>false,save:()=>{saves++;return true;},toast:()=>toasts++,
 nearbyLandmarks:()=>[lm],superbiomeHere:()=>null,chordTones:()=>[57,60,64]};initialize(r);
assert.equal(r.themeKeyPhrase().id,'lm:2,0');assert.deepEqual(r.S.universe.keys['lm:2,0'],{d:'2026-10-23',n:'Estrella guía de Polvo'});assert.equal(toasts,1);
r.themeKeyPhrase();assert.equal(r.themeKeys().answers,2,'it answers every time');assert.equal(toasts,1,'kept once');assert.equal(saves,1);
r.journeyQuiet=()=>true;assert.equal(r.themeKeyPhrase(),null,'not during the Journey');
r.journeyQuiet=()=>false;r.save=()=>false;r.nearbyLandmarks=()=>[];r.superbiomeHere=()=>({id:'faros:dnb',name:'Púlsares · DnB',rarity:'muy-raro'});r.themeKeyPhrase();assert.equal(r.S.universe.keys['super:faros:dnb'],undefined,'a failed save keeps nothing');
console.log('PASS theme as a key: a landmark plays its motif then the theme, a rare superbiome answers a fifth up, kept once in the Journal, only in the free World');
