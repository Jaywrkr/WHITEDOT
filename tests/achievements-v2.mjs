import assert from 'node:assert/strict';
import {newAchievementRules,achievementMetrics,achievementMeta,achievementProgress,ACH_CATEGORIES} from '../src/achievements-model.js';
import {createRewardsCatalog,migrateRewards} from '../src/rewards-model.js';
const existing=Array.from({length:148},(_,i)=>['old'+i,'Anterior','Conserva tu progreso.']);const rules=newAchievementRules(existing);assert.equal(rules.length+existing.length,250);assert.equal(new Set(rules.map(p=>p.id)).size,rules.length);
assert(ACH_CATEGORIES.every(c=>rules.some(p=>p.category===c)));assert(rules.every(p=>p.name.split(/\s+/).length<=12&&p.description.split(/\s+/).length<=12));
assert.equal(achievementMeta(['dj','DJ','Anterior']).retired,true);assert.equal(achievementMeta(['r30','Constancia','Anterior']).category,'Camino');
const p=rules.find(p=>p.metric==='genres');const state={ach:{dj:'2026-01-01'},journal:{music:{genres:{minimal:1,deep:1}}},totalDays:2,rewards:{items:{'future:piece':{obtainedAt:'2025-01-01'}},sources:{}}};assert.equal(achievementMetrics(state).genres,2);assert.equal(achievementProgress(p,state).ratio,1);
state.ach[p.id]='2026-10-14';const catalog=createRewardsCatalog([...existing,[p.id,p.name,p.description]]),book=migrateRewards(state,catalog,{at:'2026-10-14'});assert(book.items['achievement:'+p.id]);assert.equal(state.ach.dj,'2026-01-01');assert(book.items['future:piece']);console.log('PASS 250 unique achievements, seven categories, meaningful metrics, tiers, catalog rewards and preserved retired/future progress');
