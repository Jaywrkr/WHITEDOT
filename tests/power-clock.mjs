import assert from 'node:assert/strict';
import {createPowerClock} from '../src/power-clock.js';
const c=createPowerClock({gift:{seconds:2}});c.give('gift');
for(let i=0;i<1000;i++)c.tick(.1,false);assert.equal(c.powers.gift-c.now(),2000);
c.give('gift');c.give('gift');assert.equal(c.powers.gift-c.now(),4000);
for(let i=0;i<40;i++)c.tick(.1,true);assert.equal(c.powers.gift-c.now(),0);c.clear();assert.equal(Object.keys(c.powers).length,0);
console.log('Active time, suspension, stacking cap and expiry verified');

c.give('gift');c.tick(.4,true);assert.equal(c.powers.gift-c.now(),1600,'active power time must follow elapsed time at low frame rates');

const saved=c.snapshot(),restored=createPowerClock({gift:{seconds:2}});assert(restored.restore(saved));assert.equal(restored.powers.gift-restored.now(),1600);restored.tick(1,false);assert.equal(restored.snapshot().remaining.gift,1600);restored.tick(.5,true);assert.equal(restored.snapshot().remaining.gift,1100);restored.restore({version:1,remaining:{gift:999999,constructor:99}});assert.equal(restored.snapshot().remaining.gift,4000);assert.equal(restored.give('constructor'),false);assert.equal(restored.give('__proto__'),false);assert(!restored.restore({version:2,remaining:{gift:99}}));assert(!Object.keys(restored.powers).length);

const field=createPowerClock({campo:{seconds:150}});field.give('campo');for(let i=0;i<30;i++)field.tick(.05,true);const {fieldRadius}=await import('../src/expansion-music.js');assert.equal(fieldRadius(148.5,150,field.age('campo')),170);field.give('campo');assert.equal(fieldRadius(field.snapshot().remaining.campo/1000,150,field.age('campo')),170,'extending the duration does not collapse its radius');for(let i=0;i<151;i++)field.tick(1,true);assert.equal(fieldRadius(field.snapshot().remaining.campo/1000,150,field.age('campo')),170,'crossing the original duration never replays the opening');const restoredField=createPowerClock({campo:{seconds:150}});restoredField.restore(field.snapshot());assert.equal(fieldRadius(restoredField.snapshot().remaining.campo/1000,150,restoredField.age('campo')),170,'restore keeps an extended field open');
