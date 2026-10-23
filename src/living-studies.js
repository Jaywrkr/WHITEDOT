// Original studies, not claims of authentic performance or quotations of modern recordings.
export const LIVING_STUDIES=Object.freeze([
 {id:'jardin-andino',name:'Cuerdas de altura',reference:'Inspiración en pentatonías andinas',rhythm:[0,3,6,10],flora:'seed',fauna:'manta'},
 {id:'patio-mexicano',name:'Patio de madera',reference:'Inspiración en respuesta y zapateado del son jarocho; estudio electrónico propio',rhythm:[0,3,6,8,11,14],flora:'cactus',fauna:'beetle'},
 {id:'tinta',name:'Campo de respiración',reference:'Inspiración en el espacio y las frases de tradiciones instrumentales japonesas',rhythm:[0,6,10,14],flora:'reeds',fauna:'moth'},
 {id:'bronce',name:'Islas resonantes',reference:'Inspiración en patrones entrelazados de ensambles de gamelan',rhythm:[0,4,8,12],flora:'pulse-fruit',fauna:'crab'},
 {id:'cinco-rutas',name:'Corriente de cinco rutas',reference:'Estudio original de pentatonía inspirado en tradiciones chinas',rhythm:[0,4,10,14],flora:'vine',fauna:'deer'},
 {id:'sabana',name:'Campanas de encuentro',reference:'Estudio de llamadas y respuestas inspirado en patrones de campana de África occidental',rhythm:[0,3,6,10,12],flora:'pulse-fruit',fauna:'turtle'},
 {id:'modal',name:'Patio de intervalos',reference:'Inspiración en desarrollo modal de tradiciones de India, con afinación del mundo',rhythm:[0,3,7,11],flora:'pressure-flower',fauna:'worm'},
 {id:'horizonte',name:'Membranas del horizonte',reference:'Estudio original de percusión de marco inspirado en tradiciones de Asia occidental',rhythm:[0,3,8,11],flora:'reeds',fauna:'jelly'},
 {id:'norte',name:'Casa del viento',reference:'Estudio original de llamadas y paisaje de regiones nórdicas',rhythm:[0,5,9,14],flora:'moss',fauna:'deer'},
 {id:'canon',name:'Campo del canon',reference:'Principio de imitación entre voces desarrollado por compositores como J. S. Bach; frase original',rhythm:[0,4,8,12],flora:'fungal-net',fauna:'moth'},
 {id:'mecanismo',name:'Molino de memoria',reference:'Inspiración en mecanismos de transmisión dibujados por Leonardo da Vinci; mecanismo sonoro original',rhythm:[0,3,8,11],flora:'lichen',fauna:'beetle'},
 {id:'respiracion',name:'Cámara modal',reference:'Estudio original de continuidad y modo inspirado en repertorios históricos como los de Hildegard',rhythm:[0,8],flora:'breath-tree',fauna:'whale'}
]);
export function studyOf(o){return LIVING_STUDIES[(o.studyVariant??o.variant)%LIVING_STUDIES.length];}
export const JAY_STORY=[
 {id:'atencion',need:1,text:'Tu primer instrumento es la atención. El lugar responde.'},
 {id:'gesto',need:4,text:'Un gesto, una respuesta y espacio para escuchar.'},
 {id:'constancia',need:8,text:'Jay pregunta: ¿qué cambia cuando volvemos? La constancia encuentra nuevas voces.'},
 {id:'compartir',need:16,text:'Crear juntos también es escuchar. Deja espacio para otra voz.'}
];
