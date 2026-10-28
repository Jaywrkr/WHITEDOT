// Sparks are what you buy with; stars are only for going forward and winning (docs/MUNDO.md, plan F3). These are the
// rules that decide how many sparks playing gives, in one place, so the game and the economy simulation agree.
// Playing on time is worth more in the free World: on time ×2, and ×3 from the eighth pulse on time in a row. Since K2 a pulse off time keeps the base value (×1); rhythm adds a bonus, never removes a collected reward.
export const STREAK_TRIPLE=8,STREAK_FORGET_MS=4000;
export const rhythmMultiplier=(onTime,streak=0)=>!onTime?1:streak>=STREAK_TRIPLE?3:2;
// H1 (Jay, 28 Oct 2026, alpha.233): sparks are of the open universe only. A level (a chapter of the Journey, its Camino,
// a round of the eleven places, Maestro or remix) gives ★ and grows Tu canción, never ✦: LEVEL_SPARKS is 0.
export const LEVEL_SPARKS=0;
// What a round paid until alpha.232, kept so the curves can show before and after (scripts/play-curve.mjs): 80, plus 9
// for every tenth of pulses on time (80–170); Maestro double; half from the fourth round of a place in a day. E1 had
// raised it from 60 + 6 (60–120). The game no longer calls it.
export const ROUND_BASE=80,ROUND_PER_TENTH=9,ROUND_FULL_PER_DAY=3;
export function roundSparks(onTimeShare,{maestro=false,roundsToday=0,base:first=ROUND_BASE,perTenth=ROUND_PER_TENTH}={}){const share=Number.isFinite(onTimeShare)?Math.max(0,Math.min(1,onTimeShare)):0;
 const base=first+perTenth*Math.floor(share*10+1e-9),full=base*(maestro?2:1);return roundsToday>=ROUND_FULL_PER_DAY?Math.ceil(full/2):full;}
// Once per place: an activity 30, a mischief scene 20 (H1, alpha.233, to make up for the rounds; E1 had 15 and 10, before
// that 5 and 3). A living encounter pays every time (live-encounters-model.js: 30, or 45 with a pulse on time).
export const ACTIVITY_SPARKS=30,MISCHIEF_SPARKS=20;
// H1: the free World's crystals pay three times what they paid (crystal-play-model.js): a crystal of size 1, 2 or 3 gives
// 3, 9 or 15 sparks at ×1, still in one, three and three fragments, so saved crystals keep their fragments.
export const CRYSTAL_SPARK_SCALE=3;
// What the economy was before E1 (alpha.226), kept so the curves can show before and after (scripts/play-curve.mjs).
// mine is the World's crystals against today's (a third before H1); wild is the wild spark.
export const ECONOMY_BEFORE_E1=Object.freeze({roundBase:60,roundPerTenth:6,activity:5,mischief:3,live:null,mine:1/3,wild:15});
// alpha.231/232, the last economy with sparks in the levels (before H1).
export const ECONOMY_BEFORE_H1=Object.freeze({roundBase:80,roundPerTenth:9,activity:15,mischief:10,live:Object.freeze({base:10,onTime:15}),sky:Object.freeze({base:10,onTime:15}),mine:1/3,wild:15});
// The free World's streak: pulses on time in a row, forgotten after a few seconds without playing or one off time.
export function nextStreak(streak,onTime,sinceLastMs){if(!onTime)return 0;return (sinceLastMs>STREAK_FORGET_MS?0:Math.max(0,streak|0))+1;}
