// Secondary box outcomes preserve the six original powers and their seeded odds.
export const BOX_SURPRISES=Object.freeze({
 lento:{name:'Paso de miel',seconds:10,text:'Camina más lento. Puedes deshacerlo.',speed:.55},
 pequeno:{name:'Miniatura',seconds:20,text:'Tu cubo se vuelve pequeño por un rato.',scale:.55},
 redondo:{name:'Burbuja',seconds:15,text:'Rueda como una burbuja blanca.',shape:'round'},
 grande:{name:'Expansión',seconds:15,text:'Tu cubo crece un poco.',scale:1.35},
 elipse:{name:'Gota viajera',seconds:15,text:'Viaja con una silueta de gota.',shape:'drop'},
 resorte:{name:'Resorte',seconds:15,text:'Tu silueta salta suavemente al caminar.',bounce:true},
 arcos:{name:'Órbitas detrás',seconds:20,text:'Deja pequeños arcos que se desvanecen.',trail:'arcs'},
 cintas:{name:'Cinta viajera',seconds:20,text:'Dibuja una cinta de color al caminar.',trail:'ribbon'},
 diamantes:{name:'Polvo de prismas',seconds:20,text:'Deja prismas pequeños detrás.',trail:'diamonds'},
 puntos:{name:'Lluvia inversa',seconds:20,text:'Tus pasos dejan puntos que ascienden.',trail:'dots'},
 satelites:{name:'Tres lunas',seconds:20,text:'Tres luces giran alrededor de ti.',satellites:true},
 semillas:{name:'Jardín prestado',seconds:20,text:'Deja brotes de luz. Desaparecen después.',marks:'grow'},
 duplicador:{name:'Eco de siluetas',seconds:15,text:'Multiplica tus rastros, sin duplicar objetos ganados.',copies:true},
 borrador:{name:'Vacío amable',seconds:10,text:'Borra solamente tus brotes temporales de luz.',erase:true},
 salto:{name:'Salto inesperado',seconds:10,text:'Llegas a otro lugar. Puedes volver.',teleport:true},
 prisma:{name:'Halo prisma',seconds:20,text:'Un halo de colores acompaña tus pasos.',prism:true}
});
export const SURPRISE_IDS=Object.keys(BOX_SURPRISES);
export function surpriseFor(box,seedOf){const h=seedOf('box:surprise:v1:'+box.id)>>>0;return h%100<45?SURPRISE_IDS[(h>>>8)%SURPRISE_IDS.length]:null;}
export function normalizeSurprise(raw){if(Number.isInteger(raw?.version)&&raw.version>1)return raw;return {...raw,version:1,remaining:{...raw?.remaining},elapsed:{...raw?.elapsed}};}
export function surpriseStyle(ids){const defs=ids.map(id=>BOX_SURPRISES[id]).filter(Boolean);return {speed:defs.reduce((v,d)=>v*(d.speed||1),1),scale:defs.reduce((v,d)=>v*(d.scale||1),1),shape:defs.find(d=>d.shape)?.shape||'cube'};}
