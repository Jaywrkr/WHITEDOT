import assert from 'node:assert/strict';
import {normalizeSessions,summarize} from '../src/playtest.js';
const input=[{start:1000,ms:6000,order:['ronda:jardin'],chapters:{'ronda:jardin':{activeMs:5000,firstActionMs:2000,noProgressMs:3000,helps:1,done:true}}}];
const got=normalizeSessions(input);assert.equal(got[0].chapters['ronda:jardin'].helps,1);assert.equal(got[0].chapters['ronda:jardin'].firstActionMs,2000);assert.match(summarize(got),/Jardín · ronda/);assert.match(summarize(got),/primer avance 0:02/);assert.match(summarize(got),/ayuda 1/);
const old=normalizeSessions([{start:1,order:['bosque'],chapters:{bosque:{ms:6000}}}]);assert.equal(old[0].chapters.bosque.firstActionMs,null);assert.equal(old[0].chapters.bosque.activeMs,0);assert.equal(normalizeSessions([{start:1,order:['unknown'],chapters:{unknown:{}}}])[0].order.length,0);
console.log('PASS opt-in observations: eleven place rounds, first progress, active/stalled time, explicit help and compatible old notes');
