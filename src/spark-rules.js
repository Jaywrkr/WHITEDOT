// Sparks are what you buy with; stars are only for going forward and winning (docs/MUNDO.md, plan F3). These are the
// rules that decide how many sparks playing gives, in one place, so the game and the economy simulation agree.
// Loose sparks (Jay, H1, alpha.233): every spark you pick up in the open universe (a crystal's fragment) is worth 1;
// broken or picked up on time, 2. Since K2 a pulse off time keeps the base value (×1). Until alpha.232 the eighth pulse
// on time in a row made it ×3 (STREAK_TRIPLE); the streak is still counted, but it no longer triples anything.
export const LOOSE_SPARK=1,ON_TIME_MULTIPLIER=2,STREAK_TRIPLE=8,STREAK_FORGET_MS=4000;
export const rhythmMultiplier=onTime=>onTime?ON_TIME_MULTIPLIER:1;
// H1 (Jay, 28 Oct 2026, alpha.233): sparks are of the open universe only. A level (a chapter of the Journey, its Camino,
// a round of the eleven places, Maestro or remix) gives ★ and grows Tu canción, never ✦: LEVEL_SPARKS is 0.
export const LEVEL_SPARKS=0;
// What a round paid until alpha.232, kept so the curves can show before and after (scripts/play-curve.mjs): 80, plus 9
// for every tenth of pulses on time (80–170); Maestro double; half from the fourth round of a place in a day. E1 had
// raised it from 60 + 6 (60–120). The game no longer calls it.
export const ROUND_BASE=80,ROUND_PER_TENTH=9,ROUND_FULL_PER_DAY=3;
export function roundSparks(onTimeShare,{maestro=false,roundsToday=0,base:first=ROUND_BASE,perTenth=ROUND_PER_TENTH}={}){const share=Number.isFinite(onTimeShare)?Math.max(0,Math.min(1,onTimeShare)):0;
 const base=first+perTenth*Math.floor(share*10+1e-9),full=base*(maestro?2:1);return roundsToday>=ROUND_FULL_PER_DAY?Math.ceil(full/2):full;}
// What appears or has to be done (Jay, H1, alpha.233): a living encounter, a figure of the Mapa del cielo, an activity, a
// mischief scene. Its reward is one rule:
//   reward = base × difficulty × distance × rarity (× 1.5 if a pulse on time did it), rounded, at least 1.
// base: what the thing is (UNIVERSE_BASE). difficulty: 1 easy, 1.5 medium, 2 hard, from the thing's own measure (the bots
// of the living encounters on foot, the stars of a figure, the size of an activity, the kind of mischief). distance: how
// far from the origin of the map it is, ×1 under 5 km, ×1.5 to 20 km, ×2 to 50 km, ×3 beyond. rarity: ×1 common, ×1.5
// rare, ×3 a legend (how likely it is to be met at all). The on-time bonus is the one living encounters and the sky had.
// No cap: a near, easy encounter gives a few sparks; a far legend, many.
export const UNIVERSE_BASE=Object.freeze({live:5,sky:4,activity:10,mischief:4});
export const DIFFICULTY=Object.freeze({easy:1,medium:1.5,hard:2});
export const RARITY=Object.freeze({common:1,rare:1.5,legend:3});
export const DISTANCE_BANDS=Object.freeze([[5,1],[20,1.5],[50,2],[Infinity,3]]);
export const ON_TIME_REWARD=1.5,UNITS_PER_KM=10000;
export const distanceKm=(x=0,y=0)=>Math.hypot(Number(x)||0,Number(y)||0)/UNITS_PER_KM;
export const distanceFactor=(x=0,y=0)=>{const km=distanceKm(x,y);return DISTANCE_BANDS.find(([upTo])=>km<upTo)[1];};
export function universeReward(base,{difficulty=1,x=0,y=0,rarity=1,onTime=false}={}){
 return Math.max(1,Math.round(base*difficulty*distanceFactor(x,y)*rarity*(onTime?ON_TIME_REWARD:1)));}
// Activities by size (universe-activities-model.js): the 51 × 51 maze is hard; the ones with six or more steps to find,
// guide or switch are medium; the rest, easy.
export const ACTIVITY_DIFFICULTY=Object.freeze({maze:DIFFICULTY.hard,city:DIFFICULTY.medium,giant:DIFFICULTY.medium,shadows:DIFFICULTY.medium,tower:DIFFICULTY.medium,fireflies:DIFFICULTY.medium,bridges:DIFFICULTY.medium});
export const activityReward=(kind,x,y)=>universeReward(UNIVERSE_BASE.activity,{difficulty:ACTIVITY_DIFFICULTY[kind]||DIFFICULTY.easy,x,y});
// Mischief by kind: a race you have to win and the scenes that stretch over a large area (the twin, the farewell) are
// medium; the rest, easy.
export const MISCHIEF_DIFFICULTY=Object.freeze({race:DIFFICULTY.medium,twin:DIFFICULTY.medium,farewell:DIFFICULTY.medium});
export const mischiefReward=(kind,x,y)=>universeReward(UNIVERSE_BASE.mischief,{difficulty:MISCHIEF_DIFFICULTY[kind]||DIFFICULTY.easy,x,y});
// Until alpha.232: an activity 15, a mischief scene 10 (E1; 5 and 3 before), the crystals' fragments 1, 3 or 5 per size.
// What the economy was before E1 (alpha.226), kept so the curves can show before and after (scripts/play-curve.mjs).
// mine: the World's crystals against today's (fragments of 1, 3 or 5 by size: 10/9 of today's 1, 3 and 3 on average);
// streak: whether the eighth pulse on time tripled them; wild: the wild spark.
export const ECONOMY_BEFORE_E1=Object.freeze({roundBase:60,roundPerTenth:6,activity:5,mischief:3,live:null,mine:10/9,streak:true,wild:15});
// alpha.231/232, the last economy with sparks in the levels (before H1).
export const ECONOMY_BEFORE_H1=Object.freeze({roundBase:80,roundPerTenth:9,activity:15,mischief:10,live:Object.freeze({base:10,onTime:15}),sky:Object.freeze({base:10,onTime:15}),mine:10/9,streak:true,wild:15});
// The free World's streak: pulses on time in a row, forgotten after a few seconds without playing or one off time.
export function nextStreak(streak,onTime,sinceLastMs){if(!onTime)return 0;return (sinceLastMs>STREAK_FORGET_MS?0:Math.max(0,streak|0))+1;}
