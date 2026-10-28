// «?rapido=2» short for real (Jay, 28 Oct 2026, alpha.230): two Camino crystals, the portal after one second, the
// Vacío's short sky kept after a reload. «?rapido=1» and the normal game keep ten crystals and the usual wait.
import assert from 'node:assert/strict';
import {rapidLevel,rapidTest,rapidScale,fillRapidCamino,RAPID_CAMINO,RAPID_SCALE,RAPID_SCALE_2} from '../src/chapter-test.js';
import {PORTAL_WAIT,RAPID_PORTAL_WAIT} from '../src/journey-chapters.js';
import {normalizeRelease,releaseTotal,RELEASE_MIN} from '../src/journey-release.js';
assert.equal(rapidLevel('?rapido=2'),2);assert.equal(rapidLevel('?rapido=1'),1);assert.equal(rapidLevel(''),0);assert.equal(rapidLevel('?rapido=3'),0);
assert.equal(rapidTest('?rapido=2'),true);assert.equal(rapidTest('?rapido=1'),true);assert.equal(rapidTest('?x=1'),false);
assert.equal(rapidScale('?rapido=2'),RAPID_SCALE_2);assert.equal(rapidScale('?rapido=1'),RAPID_SCALE);assert.equal(rapidScale(''),1);
assert.equal(RAPID_CAMINO,2);assert.ok(RAPID_PORTAL_WAIT<PORTAL_WAIT&&RAPID_PORTAL_WAIT<=1000);
// The Camino: nothing before two crystals; with two, the other eight count, marked as quick; never past ten or twice.
const one={pathCrystals:['path:a:1']};assert.equal(fillRapidCamino(one),false);assert.deepEqual(one.pathCrystals,['path:a:1']);
const two={pathCrystals:['path:a:1','path:a:2']};assert.equal(fillRapidCamino(two),true);assert.equal(two.pathCrystals.length,10);
assert.deepEqual(two.pathCrystals.slice(2),Array.from({length:8},(_,i)=>'rapido:'+(i+2)));assert.equal(fillRapidCamino(two),false);assert.equal(two.pathCrystals.length,10);
assert.equal(fillRapidCamino({}),false);assert.equal(fillRapidCamino(null),false);
// The Vacío: a twentieth of the minimum is one star, and a reload keeps it; normal saves keep theirs.
assert.equal(Math.round(releaseTotal(0)*RAPID_SCALE_2),1);
assert.equal(normalizeRelease({total:1,released:0}).total,1);assert.equal(normalizeRelease({total:2,released:5}).released,2);
assert.equal(normalizeRelease({total:RELEASE_MIN}).total,RELEASE_MIN);assert.equal(normalizeRelease({total:99}).total,24);
assert.equal(normalizeRelease({total:0}).total,0);assert.equal(normalizeRelease({total:-3}).total,0);assert.equal(normalizeRelease({total:1.5}).total,0);
console.log('PASS ?rapido=2: two Camino crystals, the portal after one second, the short Vacío kept after a reload; ?rapido=1 and the normal game unchanged');
