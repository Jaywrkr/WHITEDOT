// New namespace: existing terrain, seeds and musical RNG are never consumed.
export const TOTEM_CELL=1400,TOTEM_RATE=.03,TOTEM_DAILY_LIMIT=64;
const cup='M-18 -27Q0 -30 18 -27L18 -16Q18 -8 8 -5L6 0H-6L-8 -5Q-18 -8 -18 -16Z';
export const TOTEMS=Object.freeze({
 stack:{name:'Torre violeta',action:'stack',voice:'gota',colors:['#59004e','#df38dd','#270024'],pieces:[{path:cup,y:0},{path:cup,y:-27},{path:cup,y:-54}]},
 hourglass:{name:'Reloj verde',action:'stack',voice:'campanilla',colors:['#064c35','#a4ce51','#093c25'],pieces:[{path:'M-17 0L-6 -23L-16 -45H16L6 -23L17 0Z',y:0},{path:cup,y:-45}]},
 orb:{name:'Esfera de ámbar',action:'orb',voice:'cristal',colors:['#5f0050','#ba22c6','#320025'],pieces:[{path:cup,y:0},{path:cup,y:-27},{path:'M15 -70A15 15 0 1 1 -15 -70A15 15 0 1 1 15 -70',y:0,head:true,colors:['#efae25','#c17d00','#9b5b00']}]},
 diamond:{name:'Rombo azul',action:'orb',voice:'cristal',colors:['#114af2','#001790','#6198dc'],pieces:[{path:'M-17 0Q-17 -14 0 -31Q17 -14 17 0Q0 5 -17 0Z',y:0},{path:'M0 -31L-15 -52L-9 -74H9L15 -52Z',y:0,head:true}]},
 bottle:{name:'Botella rosa',action:'guide',voice:'gota',colors:['#ef9ae2','#ff326d','#860027'],pieces:[{path:'M-16 0Q-20 -1 -20 -12V-55Q-20 -62 -12 -66V-78Q0 -80 12 -78V-66Q20 -62 20 -55V-12Q20 -1 16 0Z',y:0}]},
 spire:{name:'Aguja de cobalto',action:'guide',voice:'campanilla',colors:['#0038cc','#124aef','#242378'],pieces:[{path:'M-16 0Q-23 -14 -10 -34L-6 -50V-101H6V-50L10 -34Q23 -14 16 0Z',y:0}]}
});
export const TOTEM_KINDS=Object.freeze(Object.keys(TOTEMS));
const hash=(seedOf,key)=>{let h=seedOf('sculptures:v1:'+key)>>>0;h=Math.imul(h^(h>>>16),0x7feb352d);h=Math.imul(h^(h>>>15),0x846ca68b);return (h^(h>>>16))>>>0;};
export function totemCell(x,y,seedOf,layer='superficie'){
 const key=layer+':'+x+','+y,h=hash(seedOf,key);if(h/4294967296>=TOTEM_RATE)return [];
 const k=hash(seedOf,key+':shape'),count=k%3===0?2+((k>>>8)%2):1,cx=(x+.35+(k>>>16)%300/1000)*TOTEM_CELL,cy=(y+.35+(k>>>4)%300/1000)*TOTEM_CELL;
 return Array.from({length:count},(_,i)=>({id:'totem:v1:'+key+':'+i,group:key,kind:TOTEM_KINDS[hash(seedOf,key+':'+i)%TOTEM_KINDS.length],x:cx+(i-(count-1)/2)*88,y:cy+(i%2)*25,variant:k%12}));
}
export function normalizeTotemClaims(raw){return Object.fromEntries(Object.entries(raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{}).filter(([k,v])=>k.startsWith('totem:v1:')&&k.length<120&&v===true).slice(0,TOTEM_DAILY_LIMIT));}
