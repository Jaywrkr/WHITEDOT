// Original discoveries: independent hash, cosmetic ownership and original short musical phrases.
export const WONDER_CELL=2200,WONDER_RATE=.035;
const rows=[
 ['star-seed','Semilla de una estrella extinguida','Núcleo dorado','Arpa y bajo','plucked','M0-20 5-5 20 0 5 5 0 20-5 5-20 0-5-5Z',[0,2,4,7,10,14],[0,1,2,3,2,0]],
 ['ocean-shell','Caracol que guarda un océano','Onda nacarada','Bossa nova','plucked','M-20 12Q-25-20 0-20Q25-20 20 5Q14 24-2 14Q-15 3-2-4Q12-8 9 4Q6 12 0 6',[0,3,6,8,11,14],[0,2,1,3,1,0]],
 ['gramophone','Aguja de un gramófono gigante','Surcos viajeros','Swing','brass','M-18 18V3L20-19V3L-18 10M-24 18H24M0 0V18',[0,3,4,7,8,12],[0,2,3,1,2,0]],
 ['yesterday-flower','Flor que crece hacia ayer','Brote de reposo','Cámara','strings','M0 22V0Q-26-20-7-22Q0-40 7-22Q26-20 0 0M0 13Q-15 0-19 13Q-10 24 0 13',[0,2,5,8,10,14],[3,2,1,0,1,2]],
 ['empty-bell','Campana sin interior','Borde resonante','Campanas armónicas','steel','M-20 10Q-10 0-12-12Q0-30 12-12Q10 0 20 10ZM-4 17Q0 23 4 17',[0,4,6,9,12,15],[0,2,1,3,2,0]],
 ['giant-shoe','Zapato de un gigante bailarín','Pasos de luz','Flamenco','resonantpluck','M-22 7Q-8 10-2-18H12V2Q15 8 24 8V17H-22Z',[0,2,3,6,8,11],[0,1,0,2,3,0]],
 ['score-fish','Pez de papel de partitura','Pez de papel','Ragtime','feltpiano','M-20 0Q0-25 20 0Q0 25-20 0L-30-12V12ZM6-3V-6',[0,3,4,6,11,12],[0,3,1,2,0,2]],
 ['singing-coal','Carbón que canta','Brasa interior','Blues','plucked','M-15 18-23-4-8-23 14-18 23 5 8 23ZM-8 4 0-12 8 4 0 14Z',[0,4,7,8,11,14],[0,0,1,2,1,0]],
 ['storm-nest','Nido de tormentas diminutas','Relámpago interior','Percusión orquestal','membrane','M-24 9Q0 35 24 9M-20 2Q0 22 20 2M-6-22H10L0-7H12L-10 10-2-4H-12Z',[0,2,5,8,12,14],[0,2,0,3,1,0]],
 ['note-door','Puerta del tamaño de una nota','Umbral viajero','Tango','reed','M-15 22V-22H15V22M-9 22V-15H8V22M1 4H4',[0,3,6,8,11,14],[0,1,3,2,1,0]],
 ['night-hat','Sombrero que contiene una noche','Cielo en el cubo','Jazz íntimo','rhodes','M-27 12H27M-17 12-11-17H11L17 12ZM-6-5H6',[0,3,5,8,10,15],[2,0,1,3,2,1]],
 ['crystal-bone','Hueso de un animal de cristal','Estructura de cristal','Marimba','marimba','M-16-5Q-31-23-14-25Q-4-27-7-14L14 7Q27 2 25 14Q23 31 5 16Z',[0,2,6,7,10,12],[0,2,1,0,3,2]],
 ['wind-letter','Carta enviada por el viento','Cinta del viento','Vals de acordeón','reed','M-24-16H24V16H-24ZM-24-16 0 4 24-16M-24 16-8 0M24 16 8 0',[0,2,4,7,9,11],[0,1,2,0,2,1]],
 ['wood-heart','Piedra con un corazón de madera','Veta cálida','Folk','plucked','M-22 9-14-19 10-23 25-2 12 23-12 20ZM0 12Q-20-3-7-8Q0-13 0-5Q6-14 13-6Q20 1 0 12',[0,4,6,8,13,14],[0,2,0,1,2,3]],
 ['folded-moon','Luna doblada en cuatro','Luna acompañante','Coro sin palabras','choir','M0-25Q-27-4-3 23Q30 4 0-25ZM0-25-3 23M-15-1 17 0',[0,3,7,9,12,14],[0,1,2,3,1,0]],
 ['silence-machine','Máquina de coser silencios','Puntadas blancas','Cuerdas en tres','clav','M-24 16H24M-17 16V-17H10Q22-17 22-5H4V8H-2V-8H-17M10-8V8',[0,2,4,6,10,12],[0,2,1,3,0,1]],
 ['sun-umbrella','Paraguas para una lluvia de soles','Halo segmentado','Son cubano','plucked','M-25-2Q0-35 25-2Q12-10 0-2Q-12-10-25-2ZM0-2V18Q0 30-10 22',[0,3,6,10,12,14],[0,2,0,1,3,2]],
 ['cathedral-fruit','Fruta que contiene una catedral','Reflejo de catedral','Órgano','orbitorgan','M-18 22V-10L-8-20 0-8 8-20 18-10V22ZM0-8V22M-10 22V4H10V22',[0,4,5,9,12,15],[0,1,3,2,0,2]],
 ['matchbox-comet','Cometa en una caja de fósforos','Cola de cometa','Bluegrass','bowed','M-22-14H18V14H-22ZM-15 5 5-5M-11 10 9 0M4-9 15-9 15 2 4 2Z',[0,1,4,6,9,12],[0,2,3,1,0,2]],
 ['dawn-mirror','Espejo de otro amanecer','Cara iridiscente','Cuerdas andinas','plucked','M-17-24H17V24H-17ZM-12 10Q0-12 12 10M-12 13H12M0-12V-18',[0,3,5,7,10,14],[3,1,2,0,1,0]]
];
export const WONDERS=Object.freeze(rows.map(([id,name,gift,style,instrument,path,steps,degrees],index)=>Object.freeze({id,name,gift,style,instrument,path,steps,degrees,index,color:['#e9ca7d','#8ae0dd','#d3a0ed','#f5a7c0','#a7c97b'][index%5]})));
export const wonderDefinition=id=>WONDERS.find(d=>d.id===id);
export function wonderCell(x,y,seedOf,layer='superficie'){
 const h=seedOf('musical-wonders:v1:'+layer+':'+x+','+y)>>>0;if(h/4294967296>=WONDER_RATE)return [];
 const k=seedOf('musical-wonders:shape:v1:'+layer+':'+x+','+y)>>>0;
 return [{id:'wonder:v1:'+layer+':'+x+','+y,kind:WONDERS[k%20].id,x:(x+.3+(k>>>8)%400/1000)*WONDER_CELL,y:(y+.3+(k>>>17)%400/1000)*WONDER_CELL}];
}
export function normalizeWonders(raw){if(Number.isInteger(raw?.version)&&raw.version>1)return raw;return {...raw,version:1,found:{...(raw?.found&&typeof raw.found==='object'&&!Array.isArray(raw.found)?raw.found:{})},totems:{...(raw?.totems&&typeof raw.totems==='object'&&!Array.isArray(raw.totems)?raw.totems:{})}};}
export function wonderScore(d,tones){if(!tones?.length)return [];return d.steps.map((step,i)=>({step,instrument:d.instrument,note:Math.max(48,Math.min(84,tones[d.degrees[i]%tones.length]+(d.degrees[i]>=tones.length?12:0))),gain:i===0?.024:.016}));}
