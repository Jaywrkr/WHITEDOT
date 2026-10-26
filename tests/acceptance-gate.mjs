// Synthetic validator inputs only; none of these records are real participants.
import assert from 'node:assert/strict';
import {assessAcceptance,ACCEPTANCE_TASKS,ACCEPTANCE_AXES,ACCEPTANCE_DEVICES} from '../scripts/acceptance-gate.mjs';
const hash='a'.repeat(64),pass={status:'pass',runtimeDigest:hash,evidence:'synthetic:test'},person=id=>({id:'P'+id,kind:'human',observed:true,runtimeDigest:hash,evidence:'synthetic:test',externalHelp:false,tasks:Object.fromEntries(ACCEPTANCE_TASKS.map(k=>[k,true])),ratings:Object.fromEntries(ACCEPTANCE_AXES.map(k=>[k,10])),wantsContinue:true});
const input={schemaVersion:1,candidate:{runtimeDigest:hash},checks:Object.fromEntries(['releaseAudit','nodeFull','browserFull','audioFull','ci'].map(k=>[k,{...pass}])),devices:Object.fromEntries(ACCEPTANCE_DEVICES.map(k=>[k,{...pass}])),rounds:{formative:Array.from({length:5},(_,i)=>person(i+1)),confirmation:Array.from({length:8},(_,i)=>person(i+6))}};
const before=JSON.stringify(input),all=assessAcceptance(input);assert(all.criteriaMet);assert.equal(all.tenCertified,false,'even perfect declared scores do not manufacture a ten');assert.equal(JSON.stringify(input),before);
assert(!assessAcceptance({}).criteriaMet);assert(!assessAcceptance({...input,schemaVersion:9}).criteriaMet);
for(const key of Object.keys(input.checks)){const q=structuredClone(input);q.checks[key].runtimeDigest='b'.repeat(64);assert(!assessAcceptance(q).criteriaMet,key);}
{const q=structuredClone(input);q.rounds.confirmation.forEach(s=>s.kind='bot');assert.equal(assessAcceptance(q).counts.confirmation,0);}
{const q=structuredClone(input);q.rounds.confirmation[0].id='P1';assert(!assessAcceptance(q).criteriaMet);assert.deepEqual(assessAcceptance(q).duplicates,['P1']);}
{const q=structuredClone(input);q.rounds.confirmation[0].runtimeDigest='b'.repeat(64);assert.equal(assessAcceptance(q).counts.confirmation,7);}
{const q=structuredClone(input);q.rounds.confirmation[0].externalHelp=true;q.rounds.confirmation[1].tasks.gardenFlower=false;assert(!assessAcceptance(q).criteriaMet);}
{const q=structuredClone(input);q.rounds.confirmation[0].ratings.audio=null;assert.equal(assessAcceptance(q).scores.audio.n,7);assert(!assessAcceptance(q).criteriaMet);}
{const q=structuredClone(input);q.rounds.formative[0].tasks={};q.rounds.formative[0].runtimeDigest='b'.repeat(64);assert(assessAcceptance(q).criteriaMet,'formative failures on a previous candidate remain evidence, not current confirmation');}
console.log('PASS acceptance gate: no blank/bot/duplicate/stale acceptance, independent rounds, honest missing scores and no automatic ten');

{const q=structuredClone(input);q.rounds.confirmation.forEach(s=>s.ratings.polish=9);assert(!assessAcceptance(q).criteriaMet,'the requested ten is not silently lowered');}
