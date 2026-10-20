// Laboratorio: catálogo completo de elementos interactivos, navegación circular, notas validadas e informe.
import assert from 'node:assert/strict';
import {LAB_ELEMENTS,LAB_GROUPS,LAB_CHECKS,labElement,labStep,normalizeLabNotes,labTested,labReport} from '../src/lab-catalog.js';
import {FAMILIES} from '../src/encounter-families.js';
import {TOY_NAMES} from '../src/playthings.js';
import {PHENOMENON_NAMES} from '../src/phenomena.js';

const ids=LAB_ELEMENTS.map(e=>e.id);
assert.equal(new Set(ids).size,ids.length,'unique ids');
for(const f of Object.keys(FAMILIES))assert.ok(ids.includes('family:'+f),'every encounter family is testable: '+f);
for(const k of Object.keys(TOY_NAMES))assert.ok(ids.includes('toy:'+k),'every toy: '+k);
for(const k of Object.keys(PHENOMENON_NAMES))assert.ok(ids.includes('phenomenon:'+k),'every phenomenon: '+k);
for(const k of ['life:golondrina','life:grulla','life:luciernaga','life:lira','life:plant','materia:strings','materia:prism','materia:membrane','glass','mirrors','tool:fx'])assert.ok(ids.includes(k),k);
for(const e of LAB_ELEMENTS){assert.ok(e.name&&e.group&&e.try.length>=1&&e.try.every(t=>t.length>3),e.id);assert.ok(['inhabitants','native','micro','ecology','band','hybrid','landscape','synth','filter','music','home','family','toy','phenomenon','tool','flock','culture','box','quiet','experimental','rhythm','living'].includes(e.find.type),e.id);}
assert.deepEqual(LAB_GROUPS,['Materia','Instalaciones','Vida','Encuentros','Juguetes','Fenómenos','Herramientas','Guardianes','Poderes','Quietud','Experimental','Percusión','Flora viva','Fauna viva','Arquitectura viva','Música','Síntesis','Filtros','Paisajes','Cruces','Paisaje vivo','Especies originales','Instrumentos vivos','Paisajes vivos','Habitantes']);
// Navegación circular.
assert.equal(labStep(ids[0],-1).id,ids.at(-1));assert.equal(labStep(ids.at(-1),1).id,ids[0]);assert.equal(labStep('nope',1).id,ids[1]);
// Notas: descarta ids desconocidos, veredictos inválidos, preguntas no booleanas y texto excesivo.
const notes=normalizeLabNotes({'materia:prism':{verdict:'fix',checks:{clear:false,sound:true,bogus:true,look:'si'},text:'x'.repeat(2000),at:5},'otra:cosa':{verdict:'ok'},glass:{verdict:'meh'},mirrors:null});
assert.deepEqual(Object.keys(notes),['materia:prism','glass']);
assert.deepEqual(notes['materia:prism'].checks,{clear:false,sound:true});assert.equal(notes['materia:prism'].text.length,1200);assert.equal(notes.glass.verdict,'');
assert.ok(labTested(notes['materia:prism']));assert.ok(!labTested(notes.glass));assert.deepEqual(normalizeLabNotes('basura'),{});
// Informe legible, agrupado y con lo que falta por probar.
const report=labReport({'materia:prism':{verdict:'fix',checks:{clear:false,sound:true},text:'gira lento\nen móvil'},'family:cloud':{verdict:'ok'}},{date:'2026-10-13'});
assert.match(report,/^# Laboratorio Kubono · 2026-10-13/);assert.match(report,new RegExp(`Probados: 2 de ${LAB_ELEMENTS.length} · Bien 1 · Mejorar 1 · Quitar 0`));
assert.match(report,/### Prisma de luz — Mejorar\n- Falla: Se entiende qué hacer\n- Funciona: Suena bien con la música\n- Nota: gira lento \/ en móvil/);
assert.ok(report.indexOf('## Materia')<report.indexOf('## Encuentros'));assert.match(report,/## Sin probar\n\nCuerdas tensables, /);
assert.equal(LAB_CHECKS.length,5);
console.log(`PASS: laboratory lists ${LAB_ELEMENTS.length} interactive elements in ${LAB_GROUPS.length} groups, circular navigation, validated notes and grouped Markdown report`);
