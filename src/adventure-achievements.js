import {MISCHIEF} from './universe-mischief-model.js';
import {ACTIVITIES} from './universe-activities-model.js';
import {WONDERS} from './musical-wonders-model.js';
import {houseValue} from './house-capsules.js';
const names={
 helper:['Abogado de las piedras','Departamento de asuntos minerales','Sindicato del cuarzo','El cristal tiene representante'],
 imitator:['Profesor de baile dudoso','No hagas exactamente eso','Academia de pasos torcidos','Coreógrafo de accidentes'],
 rain:['El paraguas no sirve','Meteorología al revés','Cobrador de lluvia ascendente','La gravedad presentó su renuncia'],
 shadow:['Mi sombra tiene agenda','Agencia de detectives oscuros','Custodia compartida de la sombra','Oscuridad con antecedentes'],
 audience:['Me estaban mirando','Famoso en tres arbustos','Gira mundial sin contrato','Estadio lleno de vecinos'],
 dance:['Bailar con un mueble','Escultura con rodillas','Museo fuera de horario','Patrimonio cultural descontrolado'],
 race:['¿Esto era una carrera?','Atleta sin inscripción','Campeonato de acompañar','Medalla de llegar eventualmente'],
 breath:['El universo aguantó la risa','Silencio incómodo certificado','Inspector de respiraciones','Prohibido estornudar aquí'],
 twin:['Yo, versión económica','Problemas de fotocopiadora','Familia numerosa de fragmentos','Departamento de identidad cúbica'],
 farewell:['Adiós, pero con producción','Despedida en cuatro barrios','Todavía siguen diciendo adiós','Director general de despedidas']
};
const activityNames=['Perdido con experiencia','Espejito, empújate','Astrónomo de suelo','Director sin batuta','No pienso mojarme','¿Quién anda repitiendo?','Arquitecto por accidente','Pastor de cosas raras','Mi rival soy yo','Fontanero de ondas','Todas las puertas iguales','Efecto dominó, literalmente','Apaga eso por favor','¿Y si gira esta pieza?','Ganadero de bombillitas','Doblar un planeta es normal','Detective de manchas','Acorde aprobado por urbanismo','Arqueólogo con esquinas','Revisor del tren imaginario','Imán con patas','Archivero del infinito','Embotellador de mal tiempo','Casting de criaturas','Ingeniero de puentes cantados','Alineador profesional','Agricultor extraterrestre','Quiropráctico de gigantes','Electricista municipal','Investigador de pisaditas'];
const wonderNames=['Estrella de bolsillo','El mar cabe aquí','DJ del gramófono gigante','Jardinero del día anterior','Campanero del hueco','Zapatero de gigantes','Pescador de partituras','Barbacoa con repertorio','Nido con pronóstico adverso','Portero de una nota','La noche me queda bien','Veterinario de cristal','Cartero sin dirección','Cardiólogo de madera','La luna vino doblada','Sastre del silencio','Paraguas de uso incorrecto','Arquitectura comestible','Incendio astronómico controlado','Hoy amanecí del otro lado'];
const rule=(id,name,description,metric,threshold=1,category='Secretos',hidden=false)=>Object.freeze({id:'adventure:'+id,name,description,metric,threshold,category,hidden,tier:threshold>=20?'oro':threshold>=3?'plata':'bronce',adventure:true});
const story=MISCHIEF.flatMap(d=>[1,3,10,25].map((n,i)=>rule(d.id+':'+n,names[d.id][i],'Completa '+n+' encuentros distintos: '+d.name+'.','story:'+d.id,n,'Mundo')));
const activities=ACTIVITIES.map((d,i)=>rule('activity:'+d.id,activityNames[i],'Completa '+d.name+'.','activity:'+d.id,1,'Mundo'));
const wonders=WONDERS.map((d,i)=>rule('wonder:'+d.id,wonderNames[i],'Encuentra '+d.name+'.','wonder:'+d.id,1,'Colección'));
const sculptures=['stack','hourglass','orb','diamond','bottle','spire'].map((id,i)=>rule('totem:'+id,['Vecino de la torre violeta','El reloj no trabaja','La bola tiene audiencia','Rombo con vida social','La botella pide pista','Antena de asuntos raros'][i],'Despierta o haz bailar esta escultura.','totem:'+id,1,'Colección'));
const aggregate=[...[[5,'Ya hice algo'],[15,'Oficios que no pedí'],[30,'Currículum del universo']].map(([n,name])=>rule('types:'+n,name,'Completa '+n+' tipos de actividad.','activityTypes',n,'Mundo')),
 ...[[10,'Una tarea más y me voy'],[30,'Empleado del infinito'],[100,'Jubilación pendiente']].map(([n,name])=>rule('sites:'+n,name,'Completa '+n+' lugares de actividad.','activitySites',n,'Mundo')),
 ...[[5,'Mi cubo lleva equipaje'],[10,'Museo portátil'],[20,'El cubo ya no cabe']].map(([n,name])=>rule('gifts:'+n,name,'Encuentra '+n+' regalos del cubo.','wonders',n,'Colección')),
 ...[[3,'Algo raro está pasando'],[7,'Esto ya es personal'],[10,'El universo es cómplice']].map(([n,name])=>rule('stories:'+n,name,'Vive '+n+' situaciones diferentes.','storyTypes',n,'Secretos')),
 ...[[3,'Comité de esculturas'],[6,'Museo completamente despierto']].map(([n,name])=>rule('sculptures:'+n,name,'Despierta '+n+' formas de escultura.','totems',n,'Colección'))];
const tricks=[['stoneLawyer','No era mi problema','Ayuda a romper el cristal grande.'],['badChoreographer','Tres giros, cero talento','Haz tres cambios de dirección con tu imitador.'],['upsideDownWeather','Me llovió al contrario','Recoge toda la lluvia ascendente.'],['shadowDetective','Mi sombra me debe explicaciones','Sigue las tres pistas de tu sombra.'],['awkwardSilence','Cinco segundos de fama incómoda','Espera ante el público antes de iniciar la procesión.'],['festivalManager','Festival sin permisos','Lleva tu procesión a una escultura.'],['leftFeet','Dos pies izquierdos, cero pies','Rodea bailando una escultura en sentido horario.'],['politeLoser','Después de usted','Deja llegar primero a tu rival.'],['heldLaughter','Ocho segundos sin estornudar','Espera ocho segundos dentro del círculo inmóvil.'],['farewellConductor','Adiós al adiós del adiós','Escucha las cuatro respuestas de despedida.']].map(([id,name,text])=>rule('trick:'+id,name,text,'trick:'+id,1,'Secretos',true));
export const ADVENTURE_ACHIEVEMENTS=Object.freeze([...story,...activities,...wonders,...sculptures,...aggregate,...tricks]);
const truthCount=v=>Object.values(v||{}).filter(x=>x===true||typeof x==='object'&&x!==null).length;
export function adventureValue(metric,s){
 const q=s.mischief?.version===1?s.mischief:{},[kind,id]=metric.split(':');
 if(kind==='house')return houseValue(metric,s);
 if(kind==='story')return Number.isSafeInteger(q.counts?.[id])?Math.max(0,q.counts[id]):0;
 if(kind==='trick')return q.tricks?.[id]===true?1:0;
 if(kind==='wonder')return s.musicalWonders?.version===1&&s.musicalWonders.found?.[id]===true?1:0;
 if(kind==='totem')return q.sculptures?.[id]===true||s.musicalWonders?.version===1&&s.musicalWonders.totems?.[id]===true?1:0;
 if(kind==='activity')return s.activities?.version===1&&s.activities.types?.[id]===true?1:0;
 if(metric==='activityTypes')return ACTIVITIES.filter(d=>adventureValue('activity:'+d.id,s)).length;
 if(metric==='activitySites')return s.activities?.version===1?truthCount(s.activities.done):0;
 if(metric==='wonders')return WONDERS.filter(d=>adventureValue('wonder:'+d.id,s)).length;
 if(metric==='storyTypes')return MISCHIEF.filter(d=>adventureValue('story:'+d.id,s)>0).length;
 if(metric==='totems')return ['stack','hourglass','orb','diamond','bottle','spire'].filter(id=>adventureValue('totem:'+id,s)).length;
 return 0;
}
export function adventureProgress(rule,s){const value=adventureValue(rule.metric,s);return {value,target:rule.threshold,ratio:Math.min(1,value/rule.threshold)};}
