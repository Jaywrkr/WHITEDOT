// Cube shop: slots from docs/TIENDA_DEL_CUBO.md and the pieces that are already built.
// A piece is listed only once it works; later batches add pieces here without touching saves.
export const CUBE_SHOP_SLOTS=Object.freeze([
 {id:'motion',name:'Movimiento',many:false},
 {id:'body',name:'Cuerpo',many:false},
 {id:'eyes',name:'Ojos',many:false},
 {id:'habits',name:'Hábitos',many:true},
 {id:'accessory',name:'Accesorio',many:false},
 {id:'trail',name:'Rastro',many:false},
 {id:'companion',name:'Compañero',many:false},
 {id:'pulse',name:'Forma del pulso',many:false},
 {id:'pulseVoice',name:'Voz del pulso',many:false},
 {id:'sound',name:'Sonido del cubo',many:true},
 {id:'gestures',name:'Gestos',many:true},
 {id:'world',name:'El mundo reacciona',many:true},
 {id:'wild',name:'Locuras',many:true},
 {id:'skills',name:'Habilidades',many:true}
].map(Object.freeze));
// Former ids are kept so existing purchases stay valid.
// art: extra SVG marks for the 180x60 preview, around the cube drawn at 85,25 (10x10).
export const CUBE_SHOP=Object.freeze([
 {id:'dust',slot:'trail',name:'Polvo viajero',cost:40,text:'Deja pequeñas chispas blancas al caminar.',art:'<path d="M32 34h2m14-7h2m13 9h2m9-8h2"/>'},
 {id:'facet',slot:'pulse',name:'Pulso facetado',cost:80,text:'Añade facetas visuales sin cambiar el alcance.',art:'<path d="M90 7l40 23-40 23-40-23zM90 7v46M50 30h80"/>'},
 {id:'orbit',slot:'companion',name:'Órbita personal',cost:150,text:'Tres luces acompañan a tu cubo.',art:'<circle cx="90" cy="30" r="20"/><circle cx="70" cy="30" r="2"/><circle cx="100" cy="13" r="2"/><circle cx="100" cy="47" r="2"/>'},
 {id:'motion:jelly',slot:'motion',name:'Gelatina',cost:75,text:'Se aplasta al frenar y se estira al arrancar.',art:'<path d="M70 38q20 6 40 0M74 22q16-5 32 0"/>'},
 {id:'motion:skate',slot:'motion',name:'Patinador',cost:100,text:'Se desliza con inercia y deja marcas.',art:'<path d="M80 39h20M40 27h30M44 33h26"/>'},
 {id:'motion:pogo',slot:'motion',name:'Pogo',cost:125,text:'Avanza a saltitos con sombra.',art:'<path d="M84 46h12M60 40q10-30 22-12M100 28q12-18 22 12"/>'},
 {id:'motion:worm',slot:'motion',name:'Gusano',cost:150,text:'Se estira y se encoge para avanzar.',art:'<path d="M60 30h20M100 30h22M66 26v8M114 26v8"/>'},
 {id:'motion:float',slot:'motion',name:'Ingravidez',cost:175,text:'Flota sobre el suelo y se balancea.',art:'<path d="M82 48h16M80 18q10-6 20 0"/>'},
 {id:'motion:roll',slot:'motion',name:'Rodar',cost:200,text:'Avanza girando cara por cara, como un dado.',art:'<path d="M70 20a24 24 0 0 1 40 0M106 14l4 6-7 1"/>'},
 {id:'motion:legs',slot:'motion',name:'Patitas',cost:250,text:'Le salen patas de píxel al caminar.',art:'<path d="M86 35l-3 6M90 35l1 6M94 35l-1 6M98 35l3 6"/>'},
 {id:'motion:blink',slot:'motion',name:'Parpadeo',cost:300,text:'Reaparece un poco más adelante, a tempo.',art:'<rect x="105" y="25" width="10" height="10" stroke-dasharray="2 2"/>'},
 {id:'body:beat',slot:'body',name:'Latido',cost:75,text:'Late al tempo de la región.',art:'<rect x="81" y="21" width="18" height="18"/><rect x="77" y="17" width="26" height="26" stroke-opacity=".4"/>'},
 {id:'body:dice',slot:'body',name:'Dado',cost:100,text:'Muestra un número que cambia con cada cristal roto.',art:'<path d="M60 24h1M60 36h1M66 30h1"/>'},
 {id:'body:chameleon',slot:'body',name:'Camaleón',cost:150,text:'Toma el color de la región.',art:'<path d="M60 30h14M106 30h14" stroke-dasharray="1 3"/>'},
 {id:'body:streak',slot:'body',name:'Racha',cost:200,text:'Crece un poco con cada cristal de una cadena.',art:'<rect x="80" y="20" width="20" height="20" stroke-opacity=".5"/><rect x="76" y="16" width="28" height="28" stroke-opacity=".25"/>'},
 {id:'body:fish',slot:'body',name:'Pecera',cost:300,text:'Cubo de cristal con un pez de luz dentro.',art:'<rect x="78" y="18" width="24" height="24"/><path d="M86 30h6M92 28v4"/>'},
 {id:'body:origami',slot:'body',name:'Origami',cost:350,text:'Se despliega como papel al lanzar un pulso.',art:'<path d="M85 25l5-12 5 12M85 35l5 12 5-12M85 25l-12 5 12 5M95 25l12 5-12 5"/>'},
 {id:'body:assembly',slot:'body',name:'Ensamblaje',cost:400,text:'Hecho de píxeles que se separan al quedarte quieto.',art:'<path d="M74 22h4M102 22h4M74 38h4M102 38h4M90 14v4M90 42v4"/>'},
 {id:'body:disco',slot:'body',name:'Bola de disco',cost:450,text:'Facetas y puntos de luz que giran en el suelo.',art:'<path d="M50 44h2M62 50h2M118 46h2M128 40h2M40 38h2M138 52h2"/>'},
 {id:'body:swarm',slot:'body',name:'Enjambre',cost:600,text:'Cuatro mini cubos que te siguen y se reúnen al parar.',art:'<rect x="66" y="22" width="5" height="5"/><rect x="58" y="32" width="5" height="5"/><rect x="108" y="22" width="5" height="5"/><rect x="116" y="32" width="5" height="5"/>'},
 {id:'eyes:serious',slot:'eyes',name:'Serio',cost:20,text:'Mirada recta y tranquila.',art:'<path d="M86 23h3M91 23h3"/>'},
 {id:'eyes:sleepy',slot:'eyes',name:'Dormilón',cost:30,text:'Párpados a media asta; sueña si te paras.',art:'<path d="M106 14h4l-4 5h4M114 8h3l-3 4h3"/>'},
 {id:'eyes:curious',slot:'eyes',name:'Curioso',cost:30,text:'Mira lo más interesante que tiene cerca.',art:'<path d="M104 30h18M118 26l4 4-4 4"/>'},
 {id:'eyes:naughty',slot:'eyes',name:'Travieso',cost:40,text:'Guiña y mira de reojo.',art:'<path d="M104 18q6-6 12 0"/>'},
 {id:'eyes:blush',slot:'eyes',name:'Rubor',cost:40,text:'Se sonroja al encontrar una tarjeta rara.',art:'<path d="M74 32h4M102 32h4" stroke-opacity=".6"/>'},
 {id:'habit:yawn',slot:'habits',name:'Bostezo',cost:25,text:'Bosteza si te quedas quieto un rato.',art:'<path d="M106 18q6-8 12 0"/>'},
 {id:'habit:greet',slot:'habits',name:'Saludo',cost:30,text:'Guiña a las criaturas que se acercan.',art:'<circle cx="130" cy="30" r="3"/><path d="M104 26q6-4 12 0"/>'},
 {id:'habit:sneeze',slot:'habits',name:'Estornudo',cost:40,text:'Estornuda chispas en zonas con esporas, polvo o niebla.',art:'<path d="M104 24h3M108 30h4M104 36h3M116 22h2M118 38h2"/>'},
 {id:'habit:dizzy',slot:'habits',name:'Mareo',cost:60,text:'Se marea si das muchas vueltas seguidas.',art:'<path d="M82 14h2M96 12h2M89 9h2"/><path d="M70 30a20 10 0 1 0 40 0" stroke-dasharray="2 3"/>'},
 {id:'acc:mustache',slot:'accessory',name:'Bigote',cost:25,text:'Bigote de píxel.',art:'<path d="M84 39h12M84 39v2M96 39v2"/>'},
 {id:'acc:hat',slot:'accessory',name:'Gorrito',cost:30,text:'Gorrito de fiesta.',art:'<path d="M85 24l5-14 5 14"/><circle cx="90" cy="9" r="1.5"/>'},
 {id:'acc:shades',slot:'accessory',name:'Gafas de sol',cost:40,text:'Gafas negras de dos píxeles.',art:'<path d="M78 28h24M80 28v4h7v-4M93 28v4h7v-4"/>'},
 {id:'acc:monocle',slot:'accessory',name:'Monóculo',cost:40,text:'Monóculo con cadenita.',art:'<circle cx="99" cy="28" r="4"/><path d="M102 31q4 10 0 18"/>'},
 {id:'trail:graffiti',slot:'trail',name:'Grafiti',cost:150,text:'Pinta el suelo y se borra poco a poco.',art:'<path d="M30 40q15-14 30-4t22-6" stroke-width="3" stroke-opacity=".6"/>'},
 {id:'trail:comet',slot:'trail',name:'Cometa',cost:175,text:'Estela larga que se curva con tus giros.',art:'<path d="M20 48q30-4 45-14t18-6" stroke-opacity=".7"/><path d="M34 46q20-4 34-13" stroke-opacity=".3"/>'},
 {id:'trail:steps',slot:'trail',name:'Huellas del día',cost:200,text:'Tus pasos quedan en el suelo hasta medianoche.',art:'<path d="M30 40h2M38 36h2M46 40h2M54 36h2M62 40h2M70 36h2"/>'},
 {id:'trail:garden',slot:'trail',name:'Jardín',cost:250,text:'Crecen flores donde pasas.',art:'<path d="M40 48v-6M56 48v-8M72 48v-5"/><circle cx="40" cy="40" r="2"/><circle cx="56" cy="38" r="2"/><circle cx="72" cy="41" r="2"/>'},
 {id:'trail:rainbow',slot:'trail',name:'Arcoíris',cost:300,text:'Aparece tras romper tres cristales en cadena.',art:'<path d="M30 46q25-30 50-16M30 50q25-30 50-16M30 54q25-30 50-16" stroke-opacity=".6"/>'},
 {id:'pet:cloud',slot:'companion',name:'Nube',cost:150,text:'Una nube pequeña llueve sobre el cubo.',art:'<path d="M80 12h20M78 15h24M84 9h10M84 19v3M90 18v3M96 19v3"/>'},
 {id:'pet:bird',slot:'companion',name:'Pájaro',cost:200,text:'Vuela contigo y se posa encima al parar.',art:'<path d="M86 16l3 2 3-2M92 16l3 2 3-2"/>'},
 {id:'pet:mimic',slot:'companion',name:'Imitador',cost:250,text:'Mini cubo que repite tu camino con retraso.',art:'<rect x="56" y="27" width="5" height="5"/><path d="M63 30h14" stroke-dasharray="2 2"/>'},
 {id:'pet:dj',slot:'companion',name:'Satélite DJ',cost:300,text:'Un disquito que gira marcando el tempo.',art:'<circle cx="114" cy="18" r="5"/><circle cx="114" cy="18" r="1"/><path d="M90 30m-22 0a22 12 0 1 0 44 0a22 12 0 1 0-44 0" stroke-opacity=".25"/>'},
 {id:'pet:ghost',slot:'companion',name:'Fantasma de ayer',cost:400,text:'Repite en miniatura tu recorrido de ayer.',art:'<path d="M66 20q10-12 22-4t20 6q8 10-4 16t-24 2q-16 0-14-20" stroke-opacity=".35"/><rect x="104" y="20" width="5" height="5" stroke-opacity=".5"/>'},
 {id:'pulse:square',slot:'pulse',name:'Cuadrado',cost:20,text:'Onda cuadrada, con el alcance de siempre.',art:''},
 {id:'pulse:star',slot:'pulse',name:'Estrella',cost:40,text:'Onda en estrella.',art:''},
 {id:'pulse:double',slot:'pulse',name:'Doble anillo',cost:50,text:'Dos ondas casi juntas.',art:''},
 {id:'pulse:spiral',slot:'pulse',name:'Espiral',cost:75,text:'La onda gira al abrirse.',art:''},
 {id:'pulse:bolt',slot:'pulse',name:'Rayo',cost:125,text:'La onda se quiebra en zigzag.',art:''},
 {id:'pulse:echo',slot:'pulse',name:'Eco rítmico',cost:200,text:'Dos ecos siguen a la onda, a corcheas.',art:''},
 {id:'pulse:charged',slot:'pulse',name:'Cargado',cost:300,text:'Cuanto más esperas entre pulsos, más brilla el siguiente. Nunca llega más lejos.',art:''},
 {id:'gesture:pose',slot:'gestures',name:'Pose',cost:50,text:'Quieto cinco segundos: posa.',art:''},
 {id:'gesture:flip',slot:'gestures',name:'Voltereta',cost:75,text:'Dos pulsos seguidos: da una vuelta.',art:''},
 {id:'gesture:confetti',slot:'gestures',name:'Confeti',cost:100,text:'Confeti de píxeles al ganar un logro.',art:''},
 {id:'gesture:dance',slot:'gestures',name:'Baile',cost:150,text:'Da vueltas en círculo y se pone a bailar.',art:''},
 {id:'gesture:victory',slot:'gestures',name:'Baile de victoria',cost:200,text:'Celebra al completar una actividad.',art:''},
 {id:'voice:808',slot:'pulseVoice',name:'Bombo 808',cost:125,text:'Golpe grave y redondo.',art:''},
 {id:'voice:bell',slot:'pulseVoice',name:'Campana FM',cost:125,text:'Campana metálica brillante.',art:''},
 {id:'voice:acid',slot:'pulseVoice',name:'Ácido',cost:150,text:'Squelch tipo 303.',art:''},
 {id:'voice:vocal',slot:'pulseVoice',name:'Corte vocal',cost:175,text:'Sílaba cortada y afinada.',art:''},
 {id:'voice:scratch',slot:'pulseVoice',name:'Scratch',cost:200,text:'Arrastre de vinilo.',art:''},
 {id:'voice:chord',slot:'pulseVoice',name:'Acorde',cost:250,text:'El pulso suena en la armonía de la región.',art:''},
 {id:'sound:hat',slot:'sound',name:'Hi-hat al caminar',cost:150,text:'Pasos a tempo.',art:''},
 {id:'sound:filter',slot:'sound',name:'Filtro',cost:250,text:'Al acelerar, la música se abre como un barrido.',art:''},
 {id:'sound:hum',slot:'sound',name:'Tarareo',cost:300,text:'Quieto, tararea bajito la melodía de la región.',art:''},
 {id:'sound:dj',slot:'sound',name:'Modo DJ',cost:350,text:'Scratch al cambiar de dirección.',art:''},
 {id:'sound:antenna',slot:'sound',name:'Antena',cost:450,text:'Oye de lejos la radio de la región vecina.',art:''},
 {id:'trail:notes',slot:'trail',name:'Notas pisables',cost:500,text:'Deja notas que suenan al volver a pisarlas: loops caminando.',art:''},
 {id:'world:lantern',slot:'world',name:'Linterna',cost:125,text:'Luz propia en el Subsuelo.',art:''},
 {id:'world:grass',slot:'world',name:'Hierba',cost:150,text:'La hierba se aparta a tu paso.',art:''},
 {id:'world:puddles',slot:'world',name:'Charcos',cost:200,text:'Los charcos reflejan el cubo.',art:''},
 {id:'world:retinue',slot:'world',name:'Séquito',cost:250,text:'Tres criaturas te siguen un rato.',art:''},
 {id:'world:constellation',slot:'world',name:'Tu constelación',cost:400,text:'Las estrellas forman tu inicial.',art:''},
 {id:'wild:morse',slot:'wild',name:'Morse',cost:150,text:'Parpadea tu nombre en morse.',art:''},
 {id:'wild:backpack',slot:'wild',name:'Mochila',cost:250,text:'Lleva colgadas tus tres últimas tarjetas.',art:''},
 {id:'wild:screen',slot:'wild',name:'Pantalla',cost:300,text:'Muestra el BPM o el género que suena.',art:''},
 {id:'wild:hologram',slot:'wild',name:'Holograma',cost:350,text:'Proyecta encima tu tarjeta más rara.',art:''},
 {id:'wild:costume',slot:'wild',name:'Disfraces',cost:750,text:'Tres pulsos seguidos: esfera, pirámide o dodecaedro durante un minuto.',art:''},
 {id:'wild:vjskin',slot:'wild',name:'Piel VJ',cost:750,text:'Los visuales VJ sobre el cuerpo del cubo.',art:''},
 {id:'skill:magnet',slot:'skills',name:'Imán corto',cost:500,text:'Recoge fragmentos un poco más lejos.',art:''},
 {id:'skill:sprint',slot:'skills',name:'Sprint',cost:600,text:'Al arrancar tras parar, un acelerón breve. Se recarga en 6 s.',art:''},
 {id:'skill:glide',slot:'skills',name:'Planeo',cost:750,text:'En el Cielo, toca y planea unos segundos antes de bajar.',art:''}
].map(Object.freeze));
export const shopPiece=id=>CUBE_SHOP.find(p=>p.id===id)||null;
export const shopSlot=id=>CUBE_SHOP_SLOTS.find(s=>s.id===id)||null;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<80&&!['__proto__','constructor','prototype'].includes(k);
// wear: one piece per single slot; on: pieces switched on in slots that allow many.
// Entries a newer version wrote for pieces this version does not know are kept untouched when they are owned.
export function normalizeWear(raw,purchases={},legacyEquipped=''){
 const owned=id=>safeKey(id)&&!!purchases?.[id],wear={},on={};
 if(object(raw?.wear))for(const [slot,id] of Object.entries(raw.wear)){
  if(!safeKey(slot)||!owned(id))continue;const piece=shopPiece(id),known=shopSlot(slot);
  if(piece&&(piece.slot!==slot||shopSlot(slot)?.many))continue;if(known?.many)continue;wear[slot]=id;
 }
 else if(owned(legacyEquipped)&&shopPiece(legacyEquipped))wear[shopPiece(legacyEquipped).slot]=legacyEquipped;
 if(object(raw?.on))for(const [id,value] of Object.entries(raw.on)){
  if(value!==true||!owned(id))continue;const piece=shopPiece(id);if(piece&&!shopSlot(piece.slot)?.many)continue;on[id]=true;
 }
 return {wear,on};
}
export const wearing=(q,id)=>{const piece=shopPiece(id);if(!piece)return false;return shopSlot(piece.slot)?.many?q?.on?.[id]===true:q?.wear?.[piece.slot]===id;};
// Route kept for Huellas del día and Fantasma de ayer: today's steps and yesterday's walk, small and bounded.
export const ROUTE_TODAY=600,ROUTE_YESTERDAY=120;
const day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
const points=(v,max)=>Array.isArray(v)?v.filter(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&Math.abs(n)<1e12)).slice(-max).map(([x,y])=>[Math.round(x),Math.round(y)]):[];
export function normalizeRoute(raw){const q=object(raw)?raw:{};return {...q,version:1,day:day(q.day),today:points(q.today,ROUTE_TODAY),yday:day(q.yday),yesterday:points(q.yesterday,ROUTE_YESTERDAY)};}
// Keeps the shape of a long walk in a few points.
export function thinRoute(list,max=ROUTE_YESTERDAY){if(list.length<=max)return list.slice();const out=[];for(let i=0;i<max;i++)out.push(list[Math.round(i*(list.length-1)/(max-1))]);return out;}
// A new day turns today's steps into yesterday's walk; a day without walking keeps the older one.
export function rollRoute(q,today){if(q.day===today)return q;return {...q,day:today,today:[],...(q.today.length>1?{yday:q.day,yesterday:thinRoute(q.today)}:{})};}
