// Listening intentions, not automatic taste scores. Reuses actual laboratory destinations.
export const LISTENING_REFERENCES=Object.freeze([
 {id:'groove',name:'Piel y madera',a:'band:interlock',b:'band:heavy',goal:'Compara el cuerpo y el movimiento del ritmo.'},
 {id:'blues',name:'Blues y máquina',a:'hybrid:blues-machine',b:'hybrid:industrial-soft',goal:'Reconoce fraseo y armonía, además del timbre.'},
 {id:'fiesta',name:'Dos fiestas',a:'band:patio',b:'band:aurora',goal:'Distingue la síncopa tropical del movimiento disco.'},
 {id:'espacio',name:'Grave y silencio',a:'hybrid:silence-bass',b:'hybrid:ambient-tape',goal:'Escucha profundidad sin depender de notas agudas.'},
 {id:'cuerdas',name:'Cuerda y tecla',a:'synth:pluckbody',b:'synth:feltpiano',goal:'Compara ataque, cuerpo y caída en Solo y mezcla.'},
 {id:'sostenidos',name:'Aire y arco',a:'synth:airflute',b:'synth:silkstrings',goal:'Escucha respiración y continuidad al permanecer junto a la rama.'},
 {id:'percusion',name:'Golpe y raspado',a:'rhythm:hollow',b:'rhythm:reeds',goal:'Reconoce la fuente del golpe y del raspado.'},
 {id:'filtros',name:'Luz y sombra',a:'filter:madera',b:'filter:sombra',goal:'Compara apertura y cuerpo sin subir el volumen.'},
 {id:'optica',name:'Color y reflejo',a:'glass',b:'mirrors',goal:'Relaciona el movimiento del objeto con el cambio musical.'},
 {id:'quietud',name:'El lugar responde',a:'quiet:90',b:'quiet:300',goal:'Escucha el desarrollo del arreglo mientras permaneces quieto.'}
].map(r=>Object.freeze({...r,seconds:90})));
export const listeningReference=id=>LISTENING_REFERENCES.find(r=>r.id===id)||null;
export function listeningReport(notes={},nameOf=id=>id){
 const tested=LISTENING_REFERENCES.filter(r=>[r.a,r.b].some(id=>{
  const n=notes[id];return !!(n&&(n.verdict||n.text||Object.keys(n.checks||{}).length));
 }));
 if(!tested.length)return '';
 return ['','## Escucha comparada','',
  'Evaluación humana; sin puntuación artística automática.',
  'Compara al mismo volumen. Una nota no acredita la pareja completa.','',
  ...tested.flatMap(r=>[`### ${r.name}`,r.goal,
   ...[r.a,r.b].map((id,i)=>`${i?'B':'A'} · ${nameOf(id)}: ${{ok:'Bien',fix:'Mejorar',cut:'Quitar'}[notes[id]?.verdict]||'sin veredicto'}`),''])].join('\n');
}
