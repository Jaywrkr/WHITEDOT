import assert from 'node:assert/strict';
import {normalizeHouse} from '../src/house-model.js';
import {roomSummary,nearThing,houseNews,houseSeen} from '../src/house-guide.js';
import {CAPSULE_PRICE} from '../src/house-capsules.js';
// Each room told in one sentence: objects, capsule pieces and what is always there.
const h=normalizeHouse({objects:[{kind:'obj:origen',room:'sala',x:.5,y:.5}],decor:[{id:'decor:reloj',room:'sala',x:.1,y:.1},{id:'sound:cajita',room:'sala',x:.3,y:.9}]},14,0);
assert.equal(roomSummary(h,'sala'),'Sala: 1 objeto, Reloj de pared, Caja de música, cuadros, trofeos y la máquina de cápsulas.');
assert.equal(roomSummary(h,'jardin'),'Jardín: el jardín de voces.');assert.equal(roomSummary(h,'nada'),'');
assert.match(roomSummary(h,'sala','máquina de cápsulas'),/Cerca: máquina de cápsulas\. Pulsa Enter\.$/);
const many=normalizeHouse({decor:['decor:cometa','decor:veleta','decor:hamaca','decor:luna','sound:xilofono','sound:theremin'].map(id=>({id,room:'azotea',x:.5,y:.5}))},14,0);assert.match(roomSummary(many,'azotea'),/y 2 más/);
// Near the machine or the workbench, and nothing in between.
assert.equal(nearThing({floor:1,fx:210},h),'máquina de cápsulas');assert.equal(nearThing({floor:2,fx:840},h),'mesa del Taller');assert.equal(nearThing({floor:1,fx:400},h),'');
assert.equal(nearThing({floor:2,fx:840},normalizeHouse({},0,0)),'','a closed basement has no workbench');
// The menu says what is new: framed cards first, then trophies, then a capsule ready.
const s={house:{...h,seen:{cards:1,ach:2}},rareBook:{items:[{},{},{}]},ach:{a:1,b:1,c:1},sparks:0};
assert.equal(houseNews(s),'2 cuadros nuevos');s.rareBook.items.pop();assert.equal(houseNews(s),'Un cuadro nuevo');s.rareBook.items.pop();assert.equal(houseNews(s),'Trofeos nuevos');
s.house.seen=houseSeen(s);assert.equal(houseNews(s),'Tus objetos y el taller');s.sparks=CAPSULE_PRICE;assert.equal(houseNews(s),'Cápsula lista · '+CAPSULE_PRICE+' ✦');
assert.equal(houseNews({house:{}}),'Tus objetos y el taller','a house never entered announces nothing');
console.log('PASS house guide: one sentence per room with capsule pieces, what is near, menu news for new cards, trophies and a ready capsule');
