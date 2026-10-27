import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
// Panel 11 (Q1 · Reglas a la vista, D10-B): gold only for ★ and ✦; counts of places, buttons and notices in white;
// one number per concept, one word per count, one message on leaving the Journey.
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const css=read('styles/estilo-j.css'),html=read('index.html');
const rule=sel=>{const i=css.lastIndexOf(sel+'{');assert(i>=0,sel);return css.slice(i+sel.length+1,css.indexOf('}',i));};
const GOLD=/f0d27a|e9ca7d|var\(--gold|var\(--earned/i;
// Counts of places, the Lugares button, «Explorar a pie» and the unread marks: white.
for(const sel of ['.lugares-count','.house-panel .house-stars','.lugares-remix','#journeyFinale .journey-explore','#bAch.has-unread svg','#bAch.has-unread span::after',":is(#bMenu,#bCube).has-new::after"])assert.doesNotMatch(rule(sel),GOLD,sel+' is not gold');
assert.match(rule('#journeyFinale .journey-explore'),/background:#fff;color:#000/,'«Explorar a pie» is a white button');
// ★ and ✦ stay gold (D10-B); ✦ is never larger nor heavier than ★, and the three HUD numbers share one size and weight.
assert.match(rule('.hud-stars'),/color:var\(--earned\)/);assert.match(rule('.spark-count'),/color:var\(--earned\)/);
const font=sel=>rule(sel).match(/font:(\d+) (\d+)px/).slice(1).map(Number);
assert.deepEqual(font('.spark-count'),font('.hud-tally'),'✦ at the size and weight of ★ and places');
for(const m of css.matchAll(/#sparkGain\{font-size:(\d+)px/g))assert(Number(m[1])<=font('.hud-tally')[1],'the delta is never larger than ★');
// No gap when the delta is empty, so the three numbers end on the same x.
assert.match(rule('.spark-count'),/gap:0/);assert.match(css,/#sparkGain:not\(:empty\)\{margin-left:8px\}/);
// One word per count: portals in the map, the Refugio is the Refugio.
for(const f of readdirSync(new URL('../src/',import.meta.url)).filter(f=>f.endsWith('.js'))){const t=read('src/'+f);assert.doesNotMatch(t,/lugares abiertos/,f);}
const map=read('src/map.js');assert.match(map,/portales abiertos \(○\)/);assert.match(map,/'⌂ tu Refugio'/);assert.doesNotMatch(map,/tu Estudio/);
// The Refugio: the shelf's wall says «★ N / 33» in white (no «LUGARES»), the house bar only «Lugares».
{const {initialize}=await import('../src/refugio-lugares.js');const els={};const $=id=>els[id]||(els[id]={id,hidden:true,textContent:'',style:{},onclick:null,addEventListener(){},replaceChildren(){},appendChild(){}});
 const d={stars:{lago:[true,true,false],llanura:[true,false,false]},best:{},seen:{lago:true}},runtime={$,S:{journey:{finished:true}},placesData:()=>d,houseVisiting:()=>false};initialize(runtime);
 const texts=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='fillText'?(t)=>texts.push({t,fill:o.fillStyle}):()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
 runtime.drawHouseLugares(c,{toScreen:(x,y)=>({x,y}),k:1,t:0,calm:true,house:{unlocked:['sala']}});
 assert.equal(texts.length,1);assert.equal(texts[0].t,'★ 3 / 33');assert.equal(texts[0].fill,'#ffffff','the wall is white');
 assert.equal(els.houseStars.textContent,'Lugares','one number per concept: the HUD counts the places');assert.equal(els.houseStars.hidden,false);
 assert.match(html,/id="houseStars"/,'the id stays');}
// «Vista tranquila» says what it does: title and subtitle both name the current state, and the subtitle names Tu cubo and the numbers.
{globalThis.document={body:{classList:{toggle(){}}}};const {initialize}=await import('../src/journey-mode.js');
 const small={textContent:''},label={firstChild:{textContent:''}},b={hidden:true,querySelector:k=>k==='span'?label:small,setAttribute(){}},menu={hidden:true};
 const runtime={$:id=>id==='bJourneyMode'?b:menu,S:{journey:{version:1,mode:'libre',free:true,colors:{}},help:{}},save:()=>true,hud(){}};initialize(runtime);
 const seen=[];for(const mode of ['libre','viaje']){if(runtime.journeyMode()!==mode)runtime.setJourneyMode(mode);seen.push([label.firstChild.textContent,small.textContent]);}
 for(const [title,sub] of seen){assert.match(sub,/Tu cubo/,title);assert.match(sub,/cifras/,title);assert.doesNotMatch(sub,/^(Ocultar|Mostrar)/,'a state, not an action');}
 assert.equal(seen[0][0],'Vista completa');assert.equal(seen[1][0],'Vista tranquila');assert.notEqual(seen[0][1],seen[1][1]);
 assert.match(html,/<small>Tu cubo, cifras y herramientas a la vista<\/small>/,'the page starts with the same words');}
// One message on leaving the Journey: no «Se abre el Mundo libre.»; «Prólogo» goes to the Bitácora unannounced.
{const finale=read('src/journey-finale.js');assert.doesNotMatch(finale,/Se abre el Mundo libre/);assert.match(finale,/narrate\?\.\('journeyDone'\);runtime\.quietAchievements\?\.\(\)/);}
// Nor the Refugio's first-landing voice (the finale lands quietly), nor a new colour or reward while the World is calm
// (from the credits to the first portal, achievements.js); both wait in Tu cubo.
{const finale=read('src/journey-finale.js');assert.match(finale,/landHouse\?\.\(\{quiet:true\}\)/);{const house=read('src/house.js');assert.match(house,/function land\(\{quiet=false\}=\{\}\)/);assert.match(house,/if\(quiet\)\{\}else if\(!own\(\)\.readOnly&&first\)/);}
 assert.match(read('src/ui.js'),/if\(!runtime\.achievementsCalm\?\.\(\)\)runtime\.COLORS\.forEach/);assert.match(read('src/celebration.js'),/if\(runtime\.achievementsCalm\?\.\(\)\)return;\n\s*runtime\.toast\?\.\('Ganaste/);assert.match(read('src/achievements.js'),/achievementsCalm:\{get:\(\)=>calm\}/);}
// VIAJE.md's header names a version from panel 11 on (it said alpha.207 before Q1).
{const m=read('docs/VIAJE.md').split('\n').slice(0,4).join('\n').match(/alpha\.(\d+)/);assert(m&&Number(m[1])>=216,'docs/VIAJE.md header names the version in force');}
console.log('PASS rules in sight: places, buttons and notices in white; ★ and ✦ gold at one size; three HUD numbers aligned; portals and Refugio named once; Vista tranquila says what it hides; one message on leaving the Journey');
