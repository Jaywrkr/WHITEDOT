import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HOUSE_ROOMS,roomNeed,roomNeedText,roomOpens,roomAsks} from '../src/house-model.js';
// Panel 11 (Q4 · Refugio y Lugares legibles): a closed room shows only its nearer condition, with one number.
const room=id=>HOUSE_ROOMS.find(r=>r.id===id),cielo=room('azotea'),raiz=room('sotano');
// The nearer condition is the smaller share still missing; a tie goes to places.
assert.deepEqual(roomNeed(cielo,{places:5,stars:5}),{kind:'places',left:3},'3 of 8 places beats 10 of 15 ★');
assert.equal(roomNeedText(cielo,{places:5,stars:5}),'faltan 3 lugares');
assert.deepEqual(roomNeed(cielo,{places:2,stars:12}),{kind:'stars',left:3},'3 of 15 ★ beats 6 of 8 places');
assert.equal(roomNeedText(cielo,{places:2,stars:12}),'faltan 3 ★');
assert.equal(roomNeedText(cielo,{places:7,stars:0}),'falta 1 lugar');
assert.equal(roomNeedText(cielo,{places:0,stars:14}),'falta 1 ★');
assert.deepEqual(roomNeed(raiz,{places:0,stars:0}),{kind:'places',left:11},'nothing yet: a tie, places');
// Every closed state of every room: one number, the nearer one, and the rule itself is unchanged (D3).
for(const r of HOUSE_ROOMS.slice(1))for(let places=0;places<=11;places++)for(let stars=0;stars<=33;stars++){
 const p={places,stars};if(roomOpens(r,p))continue;const text=roomNeedText(r,p),nums=text.match(/\d+/g)||[];assert.equal(nums.length,1,text);
 const left=Number(nums[0]),pl=r.places-places,st=r.stars-stars;assert.equal(left,pl/r.places<=st/r.stars?pl:st,r.id+' '+places+'/'+stars+': '+text);
 assert.ok(pl>0&&st>0,'closed means both conditions are missing');assert.ok(left<=Math.max(pl,st));}
assert.match(roomAsks(cielo),/^8 lugares o 15 ★$/,'the full rule still exists (D3)');
// The Refugio draws the nearer condition, records what it draws for the overlap test, and keeps its labels at 4.5:1.
const house=readFileSync(new URL('../src/house.js',import.meta.url),'utf8');
assert.match(house,/roomOpensText\(r,progressNow\)/,"Refugio simple: the closed room says what opens it, the nearer condition");assert.doesNotMatch(house,/'#ffffff4d'/,'closed labels no longer at 30 % white');assert.match(house,/houseLayout:/);
const caps=readFileSync(new URL('../src/house-capsules.js',import.meta.url),'utf8');assert.doesNotMatch(caps,/'#ffffff73'/);
// Lugares: one action column, the cue upward; the Bitácora opens on Logros with unread achievements; the map fills its box.
const lugares=readFileSync(new URL('../src/refugio-lugares.js',import.meta.url),'utf8');assert.match(lugares,/lugar-actions/);assert.match(lugares,/más arriba/);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');for(const id of ['lugaresScrollUp','lugaresScrollHint','lugaresList','houseStars','bAch','mapCv'])assert.match(html,new RegExp(`id="${id}"`));
const controls=readFileSync(new URL('../src/controls.js',import.meta.url),'utf8');assert.match(controls,/achievementsUnread\?\.\(\)\?'achievements'/);
const map=readFileSync(new URL('../src/map.js',import.meta.url),'utf8');assert.match(map,/Math\.max\(x1-x0,y1-y0,4\)/);assert.doesNotMatch(map,/y1-y0,12\)/);
console.log('PASS Refugio y Lugares legibles: one number per room label, the nearer condition, D3 unchanged');
