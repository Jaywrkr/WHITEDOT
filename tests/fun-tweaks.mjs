import assert from 'node:assert/strict';
import {createMischief,stepMischief} from '../src/universe-mischief-model.js';
import {moveEscape} from '../src/crystal-play-model.js';
const run=(s,player,seconds,opts)=>{for(let t=0;t<seconds;t+=.05)stepMischief(s,player,.05,opts);return s;};
// Race: the finish lies 300-380 u beyond the site, away from the player; a 3·2·1 count precedes a rival at 150 u/s.
let race=createMischief({id:'r',kind:'race',x:0,y:0,seed:12345},{x:-40,y:0});
assert(race.goal.x>=300&&race.goal.x<=380&&Math.abs(race.goal.y)<1,JSON.stringify(race.goal));
stepMischief(race,{x:-20,y:0},.05);assert.equal(race.stage,1);assert.deepEqual(race.notes,[0]);
run(race,{x:-20,y:0},2.9);assert.equal(race.stage,1,'still counting');assert.deepEqual(race.notes,[0,1,2]);
run(race,{x:-20,y:0},.2);assert.equal(race.stage,2,'the race starts after three');
const start={...race.actor};run(race,{x:-20,y:0},1);assert(Math.abs(race.actor.x-start.x-150)<10,'rival runs at 150 u/s');
// Standing still loses: the rival reaches the finish first and the result is kept.
run(race,{x:-20,y:0},3);assert.equal(race.rank,'second');
// A fast player beats a fresh rival.
race=createMischief({id:'r2',kind:'race',x:0,y:0,seed:12345},{x:-40,y:0});run(race,{x:-20,y:0},3.2);const p={x:0,y:0};for(let t=0;t<3&&!race.done;t+=.05){p.x=Math.min(race.goal.x,p.x+190*.05);stepMischief(race,p,.05);}assert.equal(race.rank,'first');
// Shadow: clues are far (160 u) and only the next one in order counts.
const shadow=createMischief({id:'s',kind:'shadow',x:0,y:0,seed:0},{x:0,y:0});assert(Math.abs(Math.hypot(shadow.drops[2].x,shadow.drops[2].y)-160)<1e-6);
shadow.stage=2;stepMischief(shadow,{x:shadow.drops[2].x,y:shadow.drops[2].y},.05);assert.deepEqual(shadow.clues,[],'the second clue does not count first');
stepMischief(shadow,{x:shadow.drops[0].x,y:shadow.drops[0].y},.05);assert.deepEqual(shadow.clues,[0]);
// Rain: drops rise and fall back, so standing on the ring alone is not enough; under reduced motion they stay put.
const rain=createMischief({id:'w',kind:'rain',x:0,y:0,seed:0},{x:500,y:500});run(rain,{x:500,y:500},1);assert(rain.drops.every(q=>q.rise>0&&q.rise<=32));
const still=createMischief({id:'w2',kind:'rain',x:0,y:0,seed:0},{x:500,y:500});run(still,{x:500,y:500},1,{reduced:true});assert(still.drops.every(q=>!q.rise));
// Rare fragment: it keeps running for five seconds, never beyond 180 u from home.
const home={x:0,y:0};let f={x:5,y:0};for(let age=0;age<4.9;age+=.05)f=moveEscape(f,home,{x:0,y:0},.05,age,180,120,5);assert(Math.hypot(f.x,f.y)<=180+1e-6&&f.x>100);
assert.deepEqual(moveEscape(f,home,{x:0,y:0},.05,5.1,180,120,5),f,'after five seconds it stops');
console.log('PASS fun tweaks: race countdown, far finish and a rival that can win, sequential far shadow clues, rising rain, five-second rare chase');
