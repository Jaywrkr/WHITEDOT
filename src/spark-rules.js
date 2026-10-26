// Sparks are what you buy with; stars are only for going forward and winning (docs/MUNDO.md, plan F3). These are the
// rules that decide how many sparks playing gives, in one place, so the game and the economy simulation agree.
// Playing on time is worth more in the free World: on time ×2, and ×3 from the eighth pulse on time in a row. Since K2 a pulse off time keeps the base value (×1); rhythm adds a bonus, never removes a collected reward.
export const STREAK_TRIPLE=8,STREAK_FORGET_MS=4000;
export const rhythmMultiplier=(onTime,streak=0)=>!onTime?1:streak>=STREAK_TRIPLE?3:2;
// A round completed in one of the eleven places: 60 sparks, plus 6 for every tenth of pulses on time (60–120); a
// Maestro round, double. The first three rounds of a place each day give everything; after that, half, so repeating
// one place is never the best way to earn.
export const ROUND_BASE=60,ROUND_PER_TENTH=6,ROUND_FULL_PER_DAY=3;
export function roundSparks(onTimeShare,{maestro=false,roundsToday=0}={}){const share=Number.isFinite(onTimeShare)?Math.max(0,Math.min(1,onTimeShare)):0;
 const base=ROUND_BASE+ROUND_PER_TENTH*Math.floor(share*10+1e-9),full=base*(maestro?2:1);return roundsToday>=ROUND_FULL_PER_DAY?Math.ceil(full/2):full;}
// The free World's streak: pulses on time in a row, forgotten after a few seconds without playing or one off time.
export function nextStreak(streak,onTime,sinceLastMs){if(!onTime)return 0;return (sinceLastMs>STREAK_FORGET_MS?0:Math.max(0,streak|0))+1;}
