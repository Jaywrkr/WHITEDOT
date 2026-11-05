import {bake} from './fx-kit.js';
// One icon per kind (Escáner NMS, Jay, 5 Nov 2026, alpha.263; docs/MUNDO.md#el-escáner). «Las cajas siempre con el
// mismo icono, para que uno lo aprenda.» The one table every layer reads: the scanner's marks, the arrows at the edge
// (scanner-arrows.js) and the Mapa del universo (universe-map-art.js). Simple white line pictograms on a 14×14 grid,
// baked once (fx-kit bake) and stamped; gold is never here (it is for what is earned, drawn by whoever earns it).
// «?» (secreto) is only for what you have not discovered at all; once a kind is known it shows its own icon.
const TAU=Math.PI*2;
export const ICON_SIZE=14;
// kind → its name (the word under the icon when nothing better is known) and how it is drawn.
const P={
 // A voice nearby (a musical source): an eighth note.
 voz:c=>{c.beginPath();c.ellipse(5.2,10.4,2.4,1.8,-.4,0,TAU);c.fill();c.beginPath();c.moveTo(7.4,10);c.lineTo(7.4,2.5);c.lineTo(10.5,4.6);c.stroke();},
 // A form (a creature's shape in the catalogue): a triangle.
 forma:c=>{c.beginPath();c.moveTo(7,2.5);c.lineTo(11.5,11);c.lineTo(2.5,11);c.closePath();c.stroke();},
 // A box: a square with its centre.
 caja:c=>{c.strokeRect(3,3,8,8);c.fillRect(6,6,2,2);},
 // A find (a relic): a diamond.
 hallazgo:c=>{c.beginPath();c.moveTo(7,2);c.lineTo(12,7);c.lineTo(7,12);c.lineTo(2,7);c.closePath();c.stroke();},
 // A game (an activity of the universe): two rings.
 juego:c=>{c.beginPath();c.arc(7,7,5,0,TAU);c.stroke();c.beginPath();c.arc(7,7,2,0,TAU);c.stroke();},
 // A place (the ring of eleven, a door): a ring and its centre.
 lugar:c=>{c.beginPath();c.arc(7,7,5,0,TAU);c.stroke();c.beginPath();c.arc(7,7,1.6,0,TAU);c.fill();},
 // A lost probe: a cross through a small square.
 sonda:c=>{c.beginPath();c.moveTo(7,1.5);c.lineTo(7,12.5);c.moveTo(1.5,7);c.lineTo(12.5,7);c.stroke();c.strokeRect(4.5,4.5,5,5);},
 // A rest satellite: a body and two panels.
 satelite:c=>{c.strokeRect(5,5,4,4);c.strokeRect(1,5.5,3,3);c.strokeRect(10,5.5,3,3);},
 // A buoy: a post and its light.
 boya:c=>{c.beginPath();c.moveTo(7,12.5);c.lineTo(7,7);c.stroke();c.beginPath();c.arc(7,4.5,2.5,0,TAU);c.fill();},
 // What you have not discovered at all: «?».
 secreto:c=>{c.lineWidth=1.6;c.beginPath();c.arc(7,5,3,Math.PI,Math.PI*2.4);c.lineTo(7,9.4);c.stroke();c.fillRect(6,10.8,2,2);},
 // A rare sound: three arcs.
 sonido:c=>{c.fillRect(2,6,2,2);for(const r of [3.5,6.5])c.beginPath(),c.arc(3,7,r,-.9,.9),c.stroke();},
 // A creature (an encounter, a habitat): a round body with two eyes.
 criatura:c=>{c.beginPath();c.arc(7,8,4.5,Math.PI,0);c.lineTo(11.5,11.5);c.lineTo(2.5,11.5);c.closePath();c.stroke();c.fillRect(5,7,1.5,1.5);c.fillRect(7.5,7,1.5,1.5);},
 // A station: a house with an antenna.
 estacion:c=>{c.strokeRect(3,6,8,6);c.beginPath();c.moveTo(7,6);c.lineTo(7,2);c.moveTo(5,3);c.lineTo(9,3);c.stroke();},
 // A comet crystal: a small star with its tail.
 cometa:c=>{c.beginPath();c.moveTo(9.5,2.5);c.lineTo(11,5);c.lineTo(9.5,7.5);c.lineTo(8,5);c.closePath();c.fill();c.beginPath();c.moveTo(8,6.5);c.lineTo(2.5,12);c.stroke();},
 // The asteroid: an uneven rock.
 asteroide:c=>{c.beginPath();c.moveTo(4,3);c.lineTo(10,2.5);c.lineTo(12,7);c.lineTo(9,11.5);c.lineTo(3,11);c.lineTo(2,6);c.closePath();c.stroke();c.fillRect(6,6,1.5,1.5);},
 // A landmark: a tall stone with its light.
 hito:c=>{c.strokeRect(5,4,4,8.5);c.beginPath();c.moveTo(5,4);c.lineTo(7,1.5);c.lineTo(9,4);c.stroke();},
 // Your flare: a stick and its sparks.
 bengala:c=>{c.beginPath();c.moveTo(7,12.5);c.lineTo(7,6);c.moveTo(7,4.5);c.lineTo(7,1.5);c.moveTo(4.2,3);c.lineTo(5.6,4.4);c.moveTo(9.8,3);c.lineTo(8.4,4.4);c.stroke();},
 // A challenge's next ring: a hoop.
 reto:c=>{c.beginPath();c.ellipse(7,7,5.2,3,0,0,TAU);c.stroke();c.fillRect(6,1.5,2,2.5);},
 // An order (an errand to a spot): an envelope.
 encargo:c=>{c.strokeRect(2,4,10,7);c.beginPath();c.moveTo(2,4);c.lineTo(7,8);c.lineTo(12,4);c.stroke();},
 // A spark: a four-pointed star.
 chispa:c=>{c.beginPath();c.moveTo(7,1.5);c.lineTo(8.6,5.4);c.lineTo(12.5,7);c.lineTo(8.6,8.6);c.lineTo(7,12.5);c.lineTo(5.4,8.6);c.lineTo(1.5,7);c.lineTo(5.4,5.4);c.closePath();c.fill();},
 // An eclipse: a ring with a dark disc over it.
 eclipse:c=>{c.beginPath();c.arc(7,7,5,0,TAU);c.stroke();c.beginPath();c.arc(8.2,6,3.6,0,TAU);c.fill();},
 // A region (a land to go to, a region you revived): a hexagon.
 region:c=>{c.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;c[i?'lineTo':'moveTo'](7+Math.cos(a)*5,7+Math.sin(a)*5);}c.closePath();c.stroke();},
 // A thing of the far bands (past 10 km): three crossing lines.
 banda:c=>{c.beginPath();for(let i=0;i<3;i++){const a=i/3*Math.PI+Math.PI/2;c.moveTo(7+Math.cos(a)*5,7+Math.sin(a)*5);c.lineTo(7-Math.cos(a)*5,7-Math.sin(a)*5);}c.stroke();},
 // Your Refugio: a house.
 refugio:c=>{c.beginPath();c.moveTo(2.5,7);c.lineTo(7,2.5);c.lineTo(11.5,7);c.lineTo(11.5,11.5);c.lineTo(2.5,11.5);c.closePath();c.stroke();},
 // A favourite: a bookmark.
 favorito:c=>{c.beginPath();c.moveTo(4,2);c.lineTo(10,2);c.lineTo(10,12);c.lineTo(7,9.5);c.lineTo(4,12);c.closePath();c.stroke();},
 // Your mark: a ring and four ticks.
 marca:c=>{c.beginPath();c.arc(7,7,3.5,0,TAU);c.moveTo(7,.5);c.lineTo(7,3.5);c.moveTo(7,10.5);c.lineTo(7,13.5);c.moveTo(.5,7);c.lineTo(3.5,7);c.moveTo(10.5,7);c.lineTo(13.5,7);c.stroke();},
 // A rarity: a six-pointed star.
 rareza:c=>{c.beginPath();for(let i=0;i<12;i++){const q=i%2?2.2:5.5,a=i/12*TAU-Math.PI/2;c[i?'lineTo':'moveTo'](7+Math.cos(a)*q,7+Math.sin(a)*q);}c.closePath();c.fill();},
 // A figure of the Mapa del cielo: three stars joined.
 figura:c=>{c.beginPath();c.moveTo(2.5,10);c.lineTo(6.5,4);c.lineTo(11.5,7.5);c.stroke();for(const [x,y] of [[2.5,10],[6.5,4],[11.5,7.5]])c.fillRect(x-1.25,y-1.25,2.5,2.5);}
};
export const SCAN_KINDS=Object.freeze({
 voz:'Voz',forma:'Forma',caja:'Caja',hallazgo:'Hallazgo',juego:'Juego',lugar:'Lugar',sonda:'Sonda',satelite:'Satélite',boya:'Boya',
 secreto:'?',sonido:'Sonido',criatura:'Criatura',estacion:'Estación',cometa:'Cristal de cometa',asteroide:'Asteroide',hito:'Hito',
 bengala:'Bengala',reto:'Reto',encargo:'Encargo',chispa:'Chispa',eclipse:'Eclipse',region:'Región',banda:'Algo lejano',
 refugio:'Tu Refugio',favorito:'Favorito',marca:'Tu marca',rareza:'Rareza',figura:'Constelación'});
export const ICON_KINDS=Object.freeze(Object.keys(SCAN_KINDS));
// The old shape words (T1–T3) and the arrow layer's kinds, read as the table's kinds. A kind decides its icon; a shape
// only helps when the kind says nothing (cosa).
const ALIAS=Object.freeze({portal:'juego',estrella:'chispa',pregunta:'secreto',rumor:'secreto',cosa:null,carga:null,actividad:'juego',
 satellite:'satelite',landmark:'hito',heard:'hito',rare:'rareza',sky:'figura',live:'criatura',habitat:'criatura',revived:'region',favorite:'favorito',
 mark:'marca',place:'lugar',ringHome:'lugar',flare:'bengala',order:'encargo'});
export function iconKind(...words){for(const w of words){if(typeof w!=='string')continue;if(Object.hasOwn(SCAN_KINDS,w))return w;if(Object.hasOwn(ALIAS,w)&&ALIAS[w])return ALIAS[w];}return 'banda';}
const paint=kind=>(c,w,h)=>{c.strokeStyle=c.fillStyle='#fff';c.lineWidth=1.25;c.lineJoin='miter';c.lineCap='butt';P[kind](c,w,h);};
export const scanIconSprite=kind=>{const k=iconKind(kind);return bake('icon:'+k,ICON_SIZE,ICON_SIZE,paint(k));};
// Stamp the icon of a kind centred at x,y (size px). Without a canvas to bake on (Node), a square outline.
export function drawScanIcon(c,kind,x,y,size=ICON_SIZE){const s=scanIconSprite(kind);if(s){c.drawImage(s,x-size/2,y-size/2,size,size);return;}
 c.strokeStyle='#fff';c.lineWidth=1;c.strokeRect(x-size/2,y-size/2,size,size);}
// For a page (the map's legend): the icon on a small canvas of its own, white on black.
export function iconCanvas(kind,size=16,doc=globalThis.document){const cv=doc?.createElement?.('canvas');if(!cv)return null;const k=2;cv.width=cv.height=size*k;cv.style.width=cv.style.height=size+'px';
 const c=cv.getContext?.('2d');if(!c)return cv;c.scale(k*size/ICON_SIZE,k*size/ICON_SIZE);paint(iconKind(kind))(c,ICON_SIZE,ICON_SIZE);cv.dataset.icon=iconKind(kind);cv.setAttribute('aria-hidden','true');return cv;}
