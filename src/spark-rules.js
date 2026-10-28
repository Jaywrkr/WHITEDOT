// Sparks are what you buy with; stars are only for going forward and winning (docs/MUNDO.md, plan F3). These are the
// rules that decide how many sparks playing gives, in one place, so the game and the economy simulation agree.
// Playing on time is worth more in the free World: on time ×2, and ×3 from the eighth pulse on time in a row. Since K2 a pulse off time keeps the base value (×1); rhythm adds a bonus, never removes a collected reward.
export const STREAK_TRIPLE=8,STREAK_FORGET_MS=4000;
export const rhythmMultiplier=(onTime,streak=0)=>!onTime?1:streak>=STREAK_TRIPLE?3:2;
// A round completed in one of the eleven places: 80 sparks, plus 9 for every tenth of pulses on time (80–170); a
// Maestro round, double. The first three rounds of a place each day give everything; after that, half, so repeating
// one place is never the best way to earn. E1 (Jay, 27 Oct 2026, «more sparks»): up from 60 + 6 (60–120).
export const ROUND_BASE=80,ROUND_PER_TENTH=9,ROUND_FULL_PER_DAY=3;
export function roundSparks(onTimeShare,{maestro=false,roundsToday=0,base:first=ROUND_BASE,perTenth=ROUND_PER_TENTH}={}){const share=Number.isFinite(onTimeShare)?Math.max(0,Math.min(1,onTimeShare)):0;
 const base=first+perTenth*Math.floor(share*10+1e-9),full=base*(maestro?2:1);return roundsToday>=ROUND_FULL_PER_DAY?Math.ceil(full/2):full;}
// Once per place (E1, Jay: «more sparks»): an activity 15 (was 5), a mischief scene 10 (was 3). A living encounter pays
// every time (live-encounters-model.js: 10, or 15 with a pulse on time).
export const ACTIVITY_SPARKS=15,MISCHIEF_SPARKS=10;
// What the economy was before E1 (alpha.226), kept so the curves can show before and after (scripts/play-curve.mjs).
export const ECONOMY_BEFORE_E1=Object.freeze({roundBase:60,roundPerTenth:6,activity:5,mischief:3,live:null});
// The free World's streak: pulses on time in a row, forgotten after a few seconds without playing or one off time.
export function nextStreak(streak,onTime,sinceLastMs){if(!onTime)return 0;return (sinceLastMs>STREAK_FORGET_MS?0:Math.max(0,streak|0))+1;}
