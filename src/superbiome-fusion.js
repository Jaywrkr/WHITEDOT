// Fusion (docs/UNIVERSO.md, phase 15): what is seen follows the music. A region keeps its shape and colour; the music
// family playing there changes how its layers move, so two superbiomes of the same region look different.
// - speed: how fast the region's time runs (drift, waves, twinkles);
// - beat: how the beat reaches the drawing (house pumps, techno is sharp, electro switches, ambient barely moves);
// - axis: motion snaps to straight lines (techno, electro);
// - echo: the middle layer leaves a fainter copy a moment behind (dub);
// - burst: the middle layer jumps forward on strong beats, in pixels (breaks, drum & bass);
// - spin: the middle and far layers sway around the screen centre, in radians (disco);
// - sway: the middle layer swings side to side with the bar (tribal).
const NONE=Object.freeze({speed:1,beat:b=>b});
export const FUSION=Object.freeze({
 ambient:Object.freeze({speed:.45,beat:b=>b*.35}),
 downtempo:Object.freeze({speed:.75,beat:b=>b*.7}),
 dub:Object.freeze({speed:.6,beat:b=>b*.8,echo:.3}),
 house:Object.freeze({speed:1,beat:b=>Math.sqrt(Math.max(0,b))}),
 techno:Object.freeze({speed:1.35,beat:b=>b*b,axis:true}),
 breaks:Object.freeze({speed:1.2,beat:b=>b,burst:3}),
 dnb:Object.freeze({speed:1.7,beat:b=>b,burst:6}),
 electro:Object.freeze({speed:1.2,beat:b=>b>.5?1:0,axis:true}),
 tribal:Object.freeze({speed:1.05,beat:b=>Math.min(1,b*1.2),sway:8}),
 disco:Object.freeze({speed:1,beat:b=>Math.sqrt(Math.max(0,b)),spin:.05})
});
export const fusionOf=family=>FUSION[family]||NONE;
// Straight motion: a wind angle snapped to the nearest quarter turn.
export const snapAxis=a=>Math.round(a/(Math.PI/2))*(Math.PI/2);
// The clock of the region: it starts at the frame time, runs at the family's speed and never jumps when the family
// changes (at speed 1 it is the frame time itself).
export function createClock(){let fused=null,last=null;return (t,speed=1)=>{if(fused===null){fused=last=t;return t;}const dt=Math.max(0,t-last);last=t;return fused+=dt*speed;};}
