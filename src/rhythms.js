// Biblioteca ampliada de ritmos. Cada género es una receta completa: tempo, swing, batería,
// bajo, frase melódica, instrumentos, escalas y una guía corta para la Bitácora.
// Tanda 1: raíces afroamericanas (house, techno, electro, club y hip hop).
// Para añadir una tanda nueva: agrega entradas aquí con `family`; audio, radio, voces,
// Bitácora y Atlas las recogen solas. tests/rhythms.mjs exige que sean alcanzables y distintas.

const MINOR=[[0,2,3,5,7,8,10],[0,2,3,5,7,9,10]],WARM=[[0,2,4,5,7,9,10],[0,2,3,5,7,9,10]];
const PHRYG=[[0,1,3,5,7,8,10],[0,2,3,5,7,8,10]],MAJ7=[[0,2,4,5,7,9,11],[0,2,3,5,7,9,10]];
const FOUR=[0,4,8,12],OFF=[2,6,10,14],EIGHT=[0,2,4,6,8,10,12,14],SIXTEEN=[...Array(16).keys()];
// Bajo: 16 pasos con grado de escala o -1. Se escribe como cadena para leerlo a ojo:
// dígito = grado, "." = silencio.
const B=s=>[...s].map(c=>c==='.'?-1:+c);

export const FAMILIES={calma:'Ambient y calma',house:'House y disco',techno:'Techno y electro',bass:'Bass y breaks',afrolatino:'Afro, latino y andino',experimental:'Experimental y jazz',afroamericana:'Raíz afroamericana'};
// Familia de los 34 estilos anteriores; los nuevos la declaran en su receta.
const BASE_FAMILY={ambient:'calma',downtempo:'calma',heart:'calma',berlin:'calma',organic:'calma',
 deep:'house',minimal:'house',rominimal:'house',microhouse:'house',progressive:'house',techhouse:'house',melodic:'house',tropical:'house',nudisco:'house',cosmic:'house',
 minimaltechno:'techno',acid:'techno',dub:'techno',melodictechno:'techno',ebm:'techno',robotic:'techno',electro:'techno',
 breaks:'bass',garage:'bass',dubstep:'bass',dnb:'bass',liquid:'bass',
 afro:'afrolatino',tribal:'afrolatino',amapiano:'afrolatino',andean:'afrolatino',
 idm:'experimental',algorave:'experimental',jazztronica:'experimental'};
export const familyOf=id=>RHYTHM_GENRES[id]?.family||BASE_FAMILY[id]||'experimental';

export const RHYTHM_GENRES={
 chicago:{name:'Chicago house',family:'afroamericana',bpm:[124,126],sw:.14,pt:0,bassI:'pluck',bassP:['pluck','rubber'],hookP:['rhodes','organ'],percP:['kick','clap','hat','conga'],scales:WARM,pad:.1,
  guide:'Nació en Chicago a inicios de los 80: bombo en cada tiempo, clap, hi-hat abierto a contratiempo y acordes de piano.',
  drums:{kick:FOUR,clap:[4,12],hatO:OFF,hat:[3,7,11,15],conga:[7,15],chord:OFF},chordI:'rhodes',kickTone:[54,.24],
  bass:B('0.....0.4.....2.'),steps:[0,6,10,14]},
 detroit:{name:'Detroit techno',family:'afroamericana',bpm:[126,134],sw:.04,pt:5,bassI:'fm',bassP:['fm','roll'],hookP:['strings','saw'],percP:['kick','clap','hat','rim'],scales:MINOR,pad:.3,
  guide:'Detroit, mediados de los 80: máquinas de ritmo, cuerdas de sintetizador y melodías que suenan a futuro.',
  drums:{kick:FOUR,clap:[4,12],hat:SIXTEEN,hatO:OFF,rim:[3,11]},kickTone:[48,.26],
  bass:B('0.0...0.0.0...4.'),steps:[0,3,6,8,12],v:[{},{rim:[3,7,11]},{rim:[3,11,14],clap:[4,12,15]}]},
 acidhouse:{name:'Acid house',family:'afroamericana',bpm:[127,130],sw:.12,pt:5,bassI:'acid',bassP:['acid'],hookP:['organ','keys'],percP:['kick','clap','hat','shaker'],scales:MINOR,pad:.05,
  guide:'Chicago, 1987: la línea de bajo ácida y resonante de un sintetizador de bajo sobre un groove de house.',
  drums:{kick:FOUR,clap:[12],hatO:OFF,hat:[1,5,9,13],cowbell:[7,15]},kickTone:[54,.22],
  bass:B('0.0707.00.07.0.7'),steps:[0,3,8,11]},
 soulful:{name:'Soulful y gospel house',family:'afroamericana',bpm:[118,121],sw:.2,pt:0,bassI:'rubber',bassP:['rubber','sub'],hookP:['organ','rhodes','strings'],percP:['kick','clap','shaker','conga'],scales:WARM,pad:.2,melodyDegrees:[0,2,4,6],
  guide:'House con raíz de iglesia y soul: órgano, acordes con séptimas, palmas y mucho calor.',
  drums:{kick:FOUR,clap:FOUR.concat([4,12]).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b),shaker:SIXTEEN.filter(s=>s%2),conga:[3,6,7,11,13,14],chord:[2,10]},chordI:'organ',kickTone:[50,.32],
  bass:B('0..0..4.2..2..4.'),steps:[0,3,6,10,14]},
 garagehouse:{name:'Garage house (Nueva York)',family:'afroamericana',bpm:[119,121],sw:.34,pt:0,bassI:'organb',bassP:['organb','rubber'],hookP:['organ','rhodes'],percP:['kick','clap','hat','shaker'],scales:WARM,pad:.15,
  guide:'Nueva York, Paradise Garage: house con swing marcado, bajo de órgano y acordes que flotan.',
  drums:{kick:FOUR,clap:[4,12],hat:[3,7,11,15],shaker:[1,2,5,6,9,10,13,14],chord:[3,11]},chordI:'organ',kickTone:[54,.28],
  bass:B('0...0.2.0...4.2.'),steps:[0,3,8,11]},
 ghetto:{name:'Ghetto house',family:'afroamericana',bpm:[128,136],sw:.06,pt:3,bassI:'machine',bassP:['machine','sub'],hookP:['vocalform','clav'],percP:['kick','clap','hat','rim'],scales:MINOR,pad:0,
  guide:'Chicago, años 90: bombos duros, claps rápidos y frases vocales cortas que se repiten.',
  drums:{kick:[0,4,8,10,12],clap:[4,12],clapRoll:[15],hat:EIGHT,rim:[3,7,11,15]},kickTone:[55,.22],
  bass:B('0...0...0.0.0...'),steps:[0,2,8,10]},
 footwork:{name:'Footwork / juke',family:'afroamericana',bpm:[158,162],sw:0,pt:3,bassI:'sub',bassP:['sub','machine'],hookP:['vocalform','rhodes'],percP:['kick','clap','hat','tom'],scales:MINOR,pad:.05,
  guide:'Chicago, para bailar en batallas de pies: 160 BPM, bombos en tresillo y frases cortadas.',
  drums:{kick:[0,3,6,10,13],clap:[8],hat:[2,6,10,14],hatRoll:[7,15],tom:[11,14]},kickTone:[42,.5],
  bass:B('0..0..0...0..0..'),steps:[0,3,6,12],v:[{},{kick:[0,3,6,9,12]},{kick:[0,3,6,10,13,14],hatRoll:[3,7,15]}]},
 baltimore:{name:'Baltimore club',family:'afroamericana',bpm:[128,134],sw:.04,pt:3,bassI:'machine',bassP:['machine','sub'],hookP:['vocalform','brass'],percP:['kick','clap','hat','snare'],scales:MINOR,pad:0,
  guide:'Baltimore, años 90: breakbeat cortado a 130 BPM, bombos dobles y llamados vocales.',
  drums:{kick:[0,4,7,8,12],snare:[4,12],clap:[12],clapRoll:[14],hat:EIGHT},kickTone:[50,.3],
  bass:B('0...0..0........'),steps:[0,4,7,8,12]},
 jersey:{name:'Jersey club',family:'afroamericana',bpm:[136,144],sw:0,pt:3,bassI:'sub',bassP:['sub','machine'],hookP:['vocalform','brass'],percP:['kick','clap','hat','rim'],scales:MINOR,pad:0,
  guide:'Newark: el bombo en ráfagas de cinco que rebota y frases vocales cortadas.',
  drums:{kick:[0,6,8,11,14],clap:[4,12],hat:OFF,rim:[3]},kickTone:[46,.32],
  bass:B('0.....0.0..0..0.'),steps:[0,6,8,11],v:[{},{kick:[0,3,6,8,11,14]},{kick:[0,6,8,10,11,14]}]},
 miamibass:{name:'Miami bass',family:'afroamericana',bpm:[126,134],sw:.04,pt:5,bassI:'sub',bassP:['sub','machine'],hookP:['saw','vocalform'],percP:['kick','clap','hat','snare'],scales:PHRYG,pad:0,
  guide:'Miami, años 80: bombo de caja de ritmo larguísimo, caja seca y hi-hats rápidos.',
  drums:{kick:[0,6,10],snare:[4,12],clap:[4,12],hat:EIGHT,hatO:[14],cowbell:[2,10]},kickTone:[40,.75],
  bass:B('0.....0...0.....'),steps:[0,3,6,10]},
 electrofunk:{name:'Electro-funk',family:'afroamericana',bpm:[108,118],sw:.06,pt:5,bassI:'machine',bassP:['machine','fm'],hookP:['vocalform','saw'],percP:['kick','clap','hat','rim'],scales:MINOR,pad:.05,
  guide:'Nueva York, 1982: funk tocado por máquinas, voz robótica y bombo sincopado.',
  drums:{kick:[0,6,10],clap:[4,12],hat:EIGHT,rim:[3,15],cowbell:[7]},kickTone:[48,.4],
  bass:B('0..0..0.0.4..0..'),steps:[0,3,8,11]},
 boogie:{name:'Boogie',family:'afroamericana',bpm:[98,104],sw:.14,pt:0,bassI:'rubber',bassP:['rubber','pluck'],hookP:['clav','brass','rhodes'],percP:['kick','clap','shaker','hat'],scales:WARM,pad:.15,
  guide:'Post-disco de los 80: bajo slap de sintetizador, clavinet, metales y groove más lento.',
  drums:{kick:[0,6,10],snare:[4,12],clap:[12],hat:EIGHT,shaker:[1,3,5,7,9,11,13,15]},kickTone:[56,.26],
  bass:B('0.0.4..02.0..4.2'),steps:[0,3,6,10]},
 boombap:{name:'Boom bap',family:'afroamericana',bpm:[86,96],sw:.24,pt:0,bassI:'sub',bassP:['sub','rubber'],hookP:['rhodes','keys'],percP:['kick','snare','hat','rim'],scales:MINOR,pad:.05,melodyDegrees:[0,2,4,6],
  guide:'Hip hop de Nueva York en los 90: bombo grave, caja seca en 2 y 4 y muestras de jazz.',
  drums:{kick:[0,7,10],snare:[4,12],hat:EIGHT,rim:[15]},kickTone:[50,.35],
  bass:B('0......0..0.....'),steps:[0,3,7,10]},
 lofi:{name:'Lo-fi hip hop',family:'afroamericana',bpm:[70,86],sw:.28,pt:0,bassI:'sub',bassP:['sub','rubber'],hookP:['rhodes','kalimba'],percP:['kick','rim','hat','shaker'],scales:MAJ7,pad:.18,melodyDegrees:[0,2,4,6],
  guide:'Hip hop lento y relajado: swing perezoso, acordes con séptimas y golpes suaves.',
  drums:{kick:[0,10],snare:[4,12],hat:EIGHT,rim:[7],chord:[0]},chordI:'rhodes',kickTone:[50,.3],soft:true,
  bass:B('0.........4.....'),steps:[0,4,6,10]},
 trap:{name:'Trap',family:'afroamericana',bpm:[136,148],sw:0,pt:3,bassI:'sub',bassP:['sub','machine'],hookP:['strings','metalkeys'],percP:['kick','clap','hat','snare'],scales:PHRYG,pad:.1,
  guide:'Atlanta, años 2000: bombo 808 largo, caja a medio tiempo y hi-hats en ráfagas.',
  drums:{kick:[0,7,10],clap:[8],snare:[8],hat:EIGHT,hatRoll:[6,14]},kickTone:[38,.8],
  bass:B('0......0..0.....'),steps:[0,3,8,11],v:[{},{hatRoll:[3,11,14]},{kick:[0,3,7,10],hatRoll:[6,7,14]}]},
 gfunk:{name:'G-funk',family:'afroamericana',bpm:[88,98],sw:.18,pt:0,bassI:'rubber',bassP:['rubber','sub'],hookP:['saw','rhodes'],percP:['kick','clap','hat','shaker'],scales:WARM,pad:.15,
  guide:'Costa oeste, años 90: funk lento, bajo de sintetizador redondo y una melodía aguda que silba.',
  drums:{kick:[0,7,10],clap:[4,12],snare:[4,12],hat:EIGHT,shaker:[3,11]},kickTone:[50,.35],
  bass:B('0.0....0.4.2....'),steps:[0,4,8,12]},
 detroitelectro:{name:'Electro de Detroit',family:'afroamericana',bpm:[128,138],sw:.02,pt:5,bassI:'machine',bassP:['machine','fm'],hookP:['metalkeys','strings'],percP:['kick','clap','hat','rim'],scales:PHRYG,pad:.2,
  guide:'Detroit, años 90: electro rápido y acuático, bombos quebrados y secuencias frías.',
  drums:{kick:[0,7,10,13],clap:[4,12],hat:SIXTEEN,rim:[3,11]},kickTone:[46,.3],
  bass:B('0.0..0.0.0..0.0.'),steps:[0,2,6,10]},
 brokenbeat:{name:'Broken beat',family:'afroamericana',bpm:[116,124],sw:.2,pt:0,bassI:'rubber',bassP:['rubber','sub'],hookP:['rhodes','clav'],percP:['kick','snare','rim','shaker'],scales:WARM,pad:.12,melodyDegrees:[0,2,4,6],
  guide:'Londres oeste, 2000: jazz, soul y house con bombos y cajas desplazados.',
  drums:{kick:[0,7,10],snare:[4,13],rim:[6,15],hat:[2,6,9,14],shaker:[1,5,11]},kickTone:[52,.28],
  bass:B('0...0..2..4..2..'),steps:[0,3,7,10,13]}
};

export function rhythmPattern(id,variation=0){
 const g=RHYTHM_GENRES[id];if(!g)return null;
 return {...g.drums,...(g.v?.[variation%g.v.length]||{})};
}
