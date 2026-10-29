import assert from 'node:assert/strict';
import {normalizeHouse} from '../src/house-model.js';
import {roomSummary,nearThing,houseNews,houseSeen} from '../src/house-guide.js';
import {CAPSULE_PRICE} from '../src/house-capsules.js';
// Each room told in one sentence: objects, capsule pieces and what is always there.
const h=normalizeHouse({objects:[{kind:'obj:origen',room:'sala',x:.5,y:.5}],decor:[{id:'decor:reloj',room:'sala',x:.1,y:.1},{id:'sound:cajita',room:'sala',x:.3,y:.9}]},{places:11});
// Refugio simple (alpha.234): the Taller and the Prisma are buttons under «Más», no longer things in Eco.
assert.equal(roomSummary(h,'sala'),'Eco: 1 objeto, Órbita, Caja sonora, paneles de tarjetas, tus trofeos y la constelación de logros.');
assert.equal(roomSummary(h,'jardin'),'Jardín de voces: las voces de tus tarjetas.');assert.equal(roomSummary(h,'nada'),'');
assert.match(roomSummary(h,'sala','Prisma'),/Cerca: Prisma\. Pulsa Enter\.$/);
const many=normalizeHouse({decor:['decor:cometa','decor:veleta','decor:hamaca','decor:luna','sound:xilofono','sound:theremin'].map(id=>({id,room:'azotea',x:.5,y:.5}))},{places:11});assert.match(roomSummary(many,'azotea'),/y 2 más/);
// Nothing in the rooms is used from where the cube stands any more: Enter never spends sparks on a hidden Prism.
for(const fx of [210,340,500])assert.equal(nearThing({floor:1,fx},h),'');assert.equal(nearThing({floor:2,fx:840},h),'');
// The menu says what is new: framed cards first, then trophies, then a capsule ready.
const s={house:{...h,seen:{cards:1,ach:2}},rareBook:{items:[{},{},{}]},ach:{a:1,b:1,c:1},sparks:0};
assert.equal(houseNews(s),'2 paneles nuevos');s.rareBook.items.pop();assert.equal(houseNews(s),'Un panel nuevo');s.rareBook.items.pop();assert.equal(houseNews(s),'Trofeos nuevos');
s.house.seen=houseSeen(s);assert.equal(houseNews(s),'Tu Refugio viaja contigo');s.sparks=CAPSULE_PRICE;assert.equal(houseNews(s),'Tu Refugio viaja contigo','with sparks enough, the Refugio does not insist on the Prism');
assert.equal(houseNews({house:{}}),'Tu Refugio viaja contigo','a house never entered announces nothing');
console.log('PASS house guide: one sentence per room with capsule pieces, what is near, menu news for new cards and trophies, never for a ready capsule');
