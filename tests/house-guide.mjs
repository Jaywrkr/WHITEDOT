import assert from 'node:assert/strict';
import {normalizeHouse} from '../src/house-model.js';
import {roomSummary,nearThing,houseNews,houseSeen} from '../src/house-guide.js';
import {CAPSULE_PRICE} from '../src/house-capsules.js';
// Each room told in one sentence: objects, capsule pieces and what is always there.
const h=normalizeHouse({objects:[{kind:'obj:origen',room:'sala',x:.5,y:.5}],decor:[{id:'decor:reloj',room:'sala',x:.1,y:.1},{id:'sound:cajita',room:'sala',x:.3,y:.9}]},14,0);
assert.equal(roomSummary(h,'sala'),'Eco: 1 objeto, Órbita, Caja sonora, paneles de tarjetas, la constelación de logros, el disco del Taller y el Prisma.');
assert.equal(roomSummary(h,'jardin'),'Jardín de voces: las voces de tus tarjetas.');assert.equal(roomSummary(h,'nada'),'');
assert.match(roomSummary(h,'sala','Prisma'),/Cerca: Prisma\. Pulsa Enter\.$/);
const many=normalizeHouse({decor:['decor:cometa','decor:veleta','decor:hamaca','decor:luna','sound:xilofono','sound:theremin'].map(id=>({id,room:'azotea',x:.5,y:.5}))},14,0);assert.match(roomSummary(many,'azotea'),/y 2 más/);
// Near the machine or the workbench, and nothing in between.
assert.equal(nearThing({floor:1,fx:210},h),'Prisma');assert.equal(nearThing({floor:1,fx:340},h),'disco del Taller');assert.equal(nearThing({floor:1,fx:500},h),'');assert.equal(nearThing({floor:2,fx:840},h),'');
assert.equal(nearThing({floor:1,fx:340},normalizeHouse({},0,0)),'disco del Taller','the Taller is open from the first day');
// The menu says what is new: framed cards first, then trophies, then a capsule ready.
const s={house:{...h,seen:{cards:1,ach:2}},rareBook:{items:[{},{},{}]},ach:{a:1,b:1,c:1},sparks:0};
assert.equal(houseNews(s),'2 paneles nuevos');s.rareBook.items.pop();assert.equal(houseNews(s),'Un panel nuevo');s.rareBook.items.pop();assert.equal(houseNews(s),'Trofeos nuevos');
s.house.seen=houseSeen(s);assert.equal(houseNews(s),'Tu Refugio viaja contigo');s.sparks=CAPSULE_PRICE;assert.equal(houseNews(s),'Prisma listo · '+CAPSULE_PRICE+' ✦');
assert.equal(houseNews({house:{}}),'Tu Refugio viaja contigo','a house never entered announces nothing');
console.log('PASS house guide: one sentence per room with capsule pieces, what is near, menu news for new cards, trophies and a ready capsule');
