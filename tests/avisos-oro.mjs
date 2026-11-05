// T4 · Kubono coherente (alpha.261): one notice style and the gold rule.
// · Every notice reads «Nombre · una frase.»: no «¡», no «!», no «¡Zum!» line for a box, and the box's line names its
//   power. The narrator laughs with the child, never at them, and has no adult winks.
// · «Aquí empiezan…» is gone: each band says «Nombre · Empiezan aquí.», one notice per crossing (the farthest).
// · Gold only for what is earned and kept: one rule in a notice (#toast[data-earned] em), never a state, a pointer, a
//   temporary power, an unearned relic, a festival, an eclipse, the moon of a region or «✦ 0»; no cyan or violet card ink.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {sourceTexts} from '../scripts/i18n-scan.mjs';
import {BOX_LINES,boxLine} from '../src/celebration.js';
import {POWERS} from '../src/expansion-music.js';
import {NARRATOR_LINES} from '../src/narrator.js';
import {CARD_TIERS,TIER_INK} from '../src/rare-card-model.js';
import {ANOMALIES} from '../src/wonders.js';
import {bandEntries} from '../src/bandas-model.js';
import {bandNoticePick,NOTICE_GAP} from '../src/bandas.js';
import '../src/viaje-a-model.js';import '../src/lejos-b-model.js';import '../src/viaje-c-model.js';import '../src/viaje-d-model.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const GOLD=/f0d27a|e9ca7d|var\(--gold|var\(--earned/i;

// --- the words: no exclamation in any text the player can read (the dictionary and the scanner of texts agree).
const loud=sourceTexts().filter(r=>/¡/.test(r.text)||/\p{L}!+(\s|$|·|»)/u.test(r.text));
assert.deepEqual(loud.map(r=>`${r.file}:${r.line} ${r.text}`),[],'no «¡» or «!» in a notice or a label');
const en=read('src/i18n-en.js');assert.doesNotMatch(en,/^ "[^"]*¡/m,'no Spanish key with «¡» left in the dictionary');

// --- a box: its line is «Nombre · una frase.», with the power's name, calm.
for(const [id,line] of Object.entries(BOX_LINES)){assert.ok(POWERS[id],id);assert.match(line,/^\p{Lu}[^¡!·]*\.$/u,id);
 assert.equal(boxLine(POWERS[id].name,id),POWERS[id].name+' · '+line);}
assert.ok(!Object.values(BOX_LINES).some(l=>/Zum|Orejas|Compañía/.test(l)),'no jokes over the power name');

// --- the narrator: playful, never mocking; no adult winks.
const MOCK=/dignidad|te odian|inútil|nadie la soporta|alquiler|pasaporte|reuniones familiares|industria musical|tus decisiones|como tus ideas|Malo, pero|Duele|lo perdido que estás|Nadie lo hará|tus errores|Tú tampoco|llora/;
for(const [id,line] of Object.entries(NARRATOR_LINES))assert.doesNotMatch(line,MOCK,id);

// --- the bands: «Nombre · Empiezan aquí.» (or the fusion's own line), one per crossing, the farthest.
const bands=bandEntries().filter(e=>e.notice);assert.ok(bands.length>=18,'every band has its notice');
for(const e of bands){assert.ok(e.notice.startsWith(e.name+' · '),e.id);assert.match(e.notice,/^[^·]+ · [^·]+\.$/,e.id);assert.doesNotMatch(e.notice,/Aquí /,e.id);}
const at10=bands.filter(e=>e.km<=10&&e.km>2);assert.equal(bandNoticePick(at10).km,10,'one notice: the farthest');assert.equal(bandNoticePick([]),null);
assert.ok(NOTICE_GAP>=10,'notices of distance never come in a flood');
const bandas=read('src/bandas.js');assert.match(bandas,/queue=\[pick\]/,'a crossing leaves one notice waiting, never a queue');

// --- the gold rule in the notice lane: the panel says whether what it shows was earned.
const lane=read('src/notice-lane.js');assert.match(lane,/earned:options\.earned\?\?category==='ganado'/);assert.match(lane,/dataset\.earned=String/);
const css=read('styles/estilo-j.css'),game=read('styles/game.css'),iface=read('styles/interface.css');
const rule=(text,sel)=>{const i=text.lastIndexOf(sel+'{');assert(i>=0,sel);return text.slice(i+sel.length+1,text.indexOf('}',i));};
assert.doesNotMatch(rule(css,'.toast em'),GOLD,'a name in a notice is white');assert.doesNotMatch(rule(game,'.toast em'),GOLD);
assert.match(rule(css,'#toast[data-earned="true"] em'),/color:var\(--earned\)/,'only the earned name is gold');
// States, pointers and temporary powers are white.
assert.doesNotMatch(rule(game,'#routeAuto[aria-pressed="true"]'),GOLD,'«Ir solo» on is a state');
assert.doesNotMatch(rule(game,'.fxpad i'),GOLD);assert.doesNotMatch(rule(iface,'.fxpad i'),GOLD);
assert.doesNotMatch(css,/\.place-narrator\{/,'no rule waiting to paint the sarcasm gold');
assert.doesNotMatch(rule(css,'.narrator-line,.journal-card .narrator-line'),GOLD);
assert.doesNotMatch(rule(css,'.spark-power'),GOLD,'a power from a box lasts a while: white');
assert.match(rule(css,'.spark-count.empty,.spark-count.empty #sparkTotal'),/color:var\(--dim\)/,'«✦ 0» is not gold');
assert.match(read('src/sparks.js'),/classList\.toggle\('empty',!\(sparkNumber\(owner\.sparks\)>0\)\)/);
// One box, one notice: the HUDs wait under its card, and the surprise under the power.
assert.match(css,/body:has\(#celebration:not\(\[hidden\]\)\) :is\(#sparkPowerHud,#surpriseHud\)/);
assert.match(css,/body:has\(#sparkPowerHud:not\(\[hidden\]\)\) #surpriseHud:not\(\[data-return="true"\]\)\{visibility:hidden\}/);
// Cards: one table, the game's palette; a card in the book is earned (gold).
for(const t of Object.values(CARD_TIERS))assert.equal(t.ink,'#f0d27a');assert.deepEqual(Object.keys(TIER_INK),Object.keys(CARD_TIERS));
for(const f of ['src/house-collection.js','src/cube-shop-wild.js','styles/game.css','styles/estilo-j.css','src/jam.js','src/visual.js'])assert.doesNotMatch(read(f),/9fe8ff|bda5f5/,f);
// The canvas: what is not earned is not gold.
const src=f=>read('src/'+f);
assert.doesNotMatch(src('cajas.js'),/WORLD_VISUAL\.gold/,'Brújula, pincel and Campo: white (the pop of an opened box stays gold, Visual 1)');
assert.doesNotMatch(src('render.js'),/ev==="eclipse"\)\{[^}]*GOLD/,'the eclipse event ring: white');
assert.doesNotMatch(src('render.js'),/c9b9ff|c8e9ee/,'a relic before it is yours: white');
assert.doesNotMatch(src('alive.js'),/camps[^\n]*GOLD/,'the old houses of the camps: white');
assert.doesNotMatch(src('world-happenings.js'),/f0d27a/,'the festival of lights: white');
assert.doesNotMatch(src('universe-mischief-art.js').split('export function drawMischiefClue')[1],/e9ca7d/,'the clue of a mischief: white');
assert.equal(ANOMALIES.luna.name,'Luna blanca');assert.doesNotMatch(src('wonders.js'),/hsl\(4\d,/,'the moon of a region is white');
for(const f of readdirSync(new URL('../src/',import.meta.url)).filter(f=>f.endsWith('.js')&&!f.startsWith('i18n')))assert.doesNotMatch(src(f),/'Luna de oro'|"Luna de oro"/,f);
console.log(`PASS avisos y oro (T4): ${Object.keys(BOX_LINES).length} box lines «Nombre · frase», no «¡», ${Object.keys(NARRATOR_LINES).length} narrator lines kind, ${bands.length} band notices, one per crossing; gold only in earned notices, ★ ✦ and cards`);
