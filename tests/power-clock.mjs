import assert from 'node:assert/strict';
import {createPowerClock} from '../src/power-clock.js';
const c=createPowerClock({gift:{seconds:2}});c.give('gift');
for(let i=0;i<1000;i++)c.tick(.1,false);assert.equal(c.powers.gift-c.now(),2000);
c.give('gift');c.give('gift');assert.equal(c.powers.gift-c.now(),4000);
for(let i=0;i<40;i++)c.tick(.1,true);assert.equal(c.powers.gift-c.now(),0);c.clear();assert.equal(Object.keys(c.powers).length,0);
console.log('Active time, suspension, stacking cap and expiry verified');

c.give('gift');c.tick(.4,true);assert.equal(c.powers.gift-c.now(),1600,'active power time must follow elapsed time at low frame rates');
