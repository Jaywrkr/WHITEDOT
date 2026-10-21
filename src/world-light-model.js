// Light of the hour, from the world's own day (0 midnight .. 1 noon, a ten-minute cycle) and the player's clock.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// How dark the player's real night is: 0 by day, 1 between midnight and four, ramps at dusk and dawn.
export function realNight(hour){const h=((hour%24)+24)%24;if(h>=0&&h<4)return 1;if(h>=4&&h<7)return 1-(h-4)/3;if(h>=20)return (h-20)/4;return 0;}
// rising: whether the world's day is getting brighter (dawn) or darker (dusk).
export function lightOfHour(day,rising,hour=12){
 const d=clamp(Number.isFinite(day)?day:1,0,1),night=clamp((1-d)**1.5*(1+realNight(hour)*.25),0,1),edge=clamp(1-Math.abs(d-.5)/.22,0,1);
 return {night,dawn:rising?edge:0,dusk:rising?0:edge,stars:.7+.9*night,darkness:Math.min(.5,night*.42),fireflies:night>.35?Math.round(6+night*10):0};
}
