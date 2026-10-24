// The narrator (plan F8, docs/MUNDO.md): achievements speak with a mocking voice, in the spirit of Dungeon Crawler Carl
// but for every age. Nothing earned is lost: existing achievements keep their id, title and date; only their voice
// changes. New ones follow the places, the stars, the ring and your song. The line shows under the title when it is
// earned and in the Bitácora.
export const NARRATOR_LINES=Object.freeze({
 // The ones you already had, with a new voice.
 dia1:'Empezaste. Ya superas a quien sigue pensándolo.',
 mundo:'Saliste al Mundo. El Mundo no estaba listo. Tú tampoco.',
 dorada:'Una luz dorada. Brilla más que tus decisiones recientes.',
 tiempo:'Ocho luces a tiempo. El metrónomo está celoso.',
 contratiempo:'Veinte luces fuera de tiempo. Es un estilo. Malo, pero un estilo.',
 percusion1:'Golpeaste el suelo. El suelo no se quejó. Todavía.',
 caja1:'Abriste una caja que alguien dejó tirada. Estupendo plan.',
 caja5:'Cinco cajas. Esto ya no es curiosidad, es un problema.',
 quietud5:'Cinco minutos sin moverte. El mundo empezaba a preocuparse.',
 silencio:'Un minuto quieto en plena fiesta. Muy misterioso. Muy raro.',
 poder_cometa:'Fuiste tan rápido que dejaste atrás tu dignidad.',
 poder_iman:'Las cosas pequeñas te siguen. No te lo creas mucho.',
 poder_brujula:'Seguiste unas flechas. Sin preguntar. Así empiezan las malas películas.',
 fx_freeze:'Congelaste la música. Nadie te lo pidió. Bien hecho.',
 fx_chorus:'Chorus. Ahora todo suena dos veces. Hasta tus errores.',
 robot:'Voz de robot. Por fin suenas como tus ideas.',
 cinta:'Frenaste la cinta. La canción no te lo va a perdonar.',
 set1:'Grabaste un set. La industria musical tiembla. Un poco.',
 bandada1:'Gritaste al cielo y el cielo contestó. Ahora tienes que hablar con él.',
 bandadaAmiga:'No hiciste nada y vinieron. Tu mejor estrategia hasta ahora.',
 aveLira:'Un quásar que imita todo. Cuidado con lo que le enseñas.',
 liraCopia:'Te copió. Y lo hizo mejor. Duele, ¿verdad?',
 mapa1:'Abriste el mapa. Ahora sabes exactamente lo perdido que estás.',
 zona5:'Cinco zonas. Ya puedes presumir en reuniones familiares.',
 atlas:'Las once zonas. No queda rincón sin tu huella. Ni sin tu ruido.',
 mar1:'Cruzaste un mar de silencio entero. Nadie te lo pidió. Lo hiciste igual.',
 lejos60:'Sesenta regiones lejos de casa. Tu Refugio ya no te reconoce.',
 alreves:'Noventa segundos hacia la izquierda. La derecha se siente ofendida.',
 bajista:'Cuarenta y cinco segundos en notas graves. El sótano te aplaude.',
 insistente:'Veinticinco golpes al mismo fragmento. Él ya se rindió. Tú no.',
 esquivador:'Esquivaste todas las luces. Un juego de luces. Sin luces. Bravo.',
 turista:'Diez fronteras en una sesión. Nadie te pidió el pasaporte. Aún.',
 regreso:'Volviste. Hicimos como que no nos dimos cuenta.',
 r7:'Una semana seguida. Esto ya es una costumbre. O una obsesión.',
 r30:'Un mes seguido. Tus plantas te extrañan.',
 r365:'Un año entero. Ya no sé si tú juegas o el juego te juega a ti.',
 favorito1:'Un lugar favorito. Qué tierno. Ya no hay vuelta atrás.',
 hito1:'Lo oíste de lejos y viniste. Como con el camión de los helados.',
 rareza1:'Esto no es normal. Tú tampoco. Hacen buena pareja.',
 mito1:'La Luna de oro. Nadie te va a creer. Toma captura.',
 // The places, the stars, the ring and your song.
 lugarEstrella:'Una estrella. Los astrónomos no se enteraron. Yo sí.',
 lugarRitmo:'Ochenta y cinco por ciento a tiempo. El otro quince queda entre nosotros.',
 lugarMaestro:'Maestro. Ya puedes pedir que te llamen así. Nadie lo hará.',
 lugarMaestro5:'Cinco Maestros. Ya no es suerte. O sí, pero muchísima.',
 lugarCasi:'Menos de la mitad a tiempo. El ritmo te saluda desde lejos.',
 lugarPerfecto:'Cien por cien a tiempo. Sospechoso. Muy sospechoso.',
 lugarRapido:'Menos de dos minutos. ¿Tienes prisa o tienes talento?',
 lugarLento:'Seis minutos en una ronda. El objeto dorado envejeció esperándote.',
 lugarInquilino:'Cuarta ronda hoy en el mismo lugar. ¿Le pagas alquiler?',
 lugarRecord:'Superaste tu récord. Tu yo de ayer está furioso.',
 lugarValiente:'Una ronda entera sin sonido. Un juego musical. Sin música. Valiente.',
 lugarNoche:'Una ronda de madrugada. Tus vecinos te odian en silencio.',
 lugarTres:'Tres lugares distintos en un día. Turismo intensivo.',
 estrellas10:'Diez estrellas. Empieza a parecer un plan.',
 estrellas20:'Veinte estrellas. Ya no puedes decir que fue casualidad.',
 estrellas33:'Treinta y tres estrellas. La versión maestra. Ahora sal un rato: el sol también es un lugar.',
 portalCerrado:'Empujaste un portal cerrado. Muy fuerte. Muy inútil.',
 portales5:'Visitaste los cinco portales. El anillo ya te conoce de vista.',
 rondaMedias:'Dejaste la ronda a medias. El objeto dorado llora en silencio.',
 viajeRapido10:'Diez viajes rápidos. Tus piernas te extrañan.',
 trofeoTocado:'Tocaste tu trofeo. Sí, suena. Sí, es tuyo. Sí, estás presumiendo.',
 cancionFan:'Escuchaste tu canción cinco veces. En la casa ya nadie la soporta.',
 viajeFin:'Terminaste el Viaje. Era el prólogo. Sí, todo eso era el prólogo.'
});
// The new achievements: id, title, how it is earned, and whether it is secret until earned.
export const NARRATOR_ACHIEVEMENTS=Object.freeze([
 ['lugarEstrella','Una estrella','Gana tu primera ★ en un lugar.'],
 ['lugarRitmo','Ritmo','Gana una ★★ con el 85 % a tiempo.'],
 ['lugarMaestro','Maestro','Gana una ★★★ en una ronda Maestro.'],
 ['lugarMaestro5','Cinco Maestros','Gana cinco ★★★.'],
 ['lugarCasi','Casi ritmo','Termina una ronda con menos de la mitad a tiempo.'],
 ['lugarPerfecto','Sospechoso','Termina una ronda con todos los pulsos a tiempo.',1],
 ['lugarRapido','Con prisa','Termina una ronda en menos de dos minutos.'],
 ['lugarLento','Sin prisa','Tarda más de seis minutos en una ronda.'],
 ['lugarInquilino','Inquilino','Juega cuatro rondas en un mismo lugar el mismo día.'],
 ['lugarRecord','Contra ti','Supera tu récord en un lugar.'],
 ['lugarValiente','Valiente','Termina una ronda sin sonido.',1],
 ['lugarNoche','Madrugada','Termina una ronda entre la medianoche y las cinco.',1],
 ['lugarTres','Turismo intensivo','Termina rondas en tres lugares distintos el mismo día.'],
 ['estrellas10','Diez estrellas','Reúne 10 ★.'],
 ['estrellas20','Veinte estrellas','Reúne 20 ★.'],
 ['estrellas33','Treinta y tres','Reúne las 33 ★.'],
 ['portalCerrado','Puerta cerrada','Entra a un portal que aún pide estrellas.'],
 ['portales5','Conocido del anillo','Entra a los cinco portales del Viaje.'],
 ['rondaMedias','A medias','Deja una ronda sin terminar.'],
 ['viajeRapido10','Caminar es de otros','Usa el viaje rápido diez veces.'],
 ['trofeoTocado','Presumido','Toca un trofeo en el Refugio.'],
 ['cancionFan','Fan número uno','Escucha tu canción cinco veces.'],
 ['viajeFin','Prólogo','Termina el Viaje.']
].map(Object.freeze));
export const narratorLine=id=>NARRATOR_LINES[id]||null;
// What a finished round earns: pure, so it can be tested without the game.
export function roundAchievements(r,{stars=0,maestros=0,places=[],hour=12}={}){const out=[];
 if(r.fresh?.[0]||r.stars?.[0])out.push('lugarEstrella');if(r.stars?.[1])out.push('lugarRitmo');if(r.stars?.[2])out.push('lugarMaestro');if(maestros>=5)out.push('lugarMaestro5');
 if(r.onTime<.5)out.push('lugarCasi');if(r.onTime>=1&&r.sound)out.push('lugarPerfecto');if(r.ms<120000)out.push('lugarRapido');if(r.ms>360000)out.push('lugarLento');
 if(r.roundsToday>=3)out.push('lugarInquilino');if(r.record&&r.roundsBefore>0)out.push('lugarRecord');if(!r.sound)out.push('lugarValiente');if(hour>=0&&hour<5)out.push('lugarNoche');
 if(new Set(places).size>=3)out.push('lugarTres');if(stars>=10)out.push('estrellas10');if(stars>=20)out.push('estrellas20');if(stars>=33)out.push('estrellas33');return out;}
export function initialize(runtime){
 for(const a of NARRATOR_ACHIEVEMENTS)if(!runtime.ACH.some(x=>x[0]===a[0]))runtime.ACH.push([...a]);
 // The voice the game records when one is earned.
 for(const [id,line] of Object.entries(NARRATOR_LINES))if(runtime.VOZ)runtime.VOZ[id]=line;
 const counts=()=>{const n=runtime.S.narrator;if(n&&typeof n==='object'&&!Array.isArray(n))return n;return runtime.S.narrator={};};
 const bump=(key,max=9999)=>{const n=counts();n[key]=Math.min(max,(Number.isInteger(n[key])?n[key]:0)+1);return n[key];};
 const unlock=id=>{if(!runtime.S.ach?.[id])runtime.unlock?.(id);};
 // A round closed: what it earned, from the round's own card.
 function round(r){const d=runtime.placesData?.();if(!d)return;const day=runtime.S.todayKey||'',n=counts();if(n.day!==day){n.day=day;n.places=[];}n.places=[...new Set([...(Array.isArray(n.places)?n.places:[]),r.id])].slice(0,11);
  const stars=Object.values(d.stars||{}).reduce((a,s)=>a+s.filter(Boolean).length,0),maestros=Object.values(d.stars||{}).filter(s=>s[2]).length;
  for(const id of roundAchievements({...r,roundsBefore:(d.best?.[r.id]?.rounds||1)-1},{stars,maestros,places:n.places,hour:new Date().getHours()}))unlock(id);}
 // Everything else that happens in the ring, the Refugio and your song.
 function event(kind){if(kind==='locked')unlock('portalCerrado');else if(kind==='abandon')unlock('rondaMedias');else if(kind==='trophy')unlock('trofeoTocado');else if(kind==='journeyDone')unlock('viajeFin');else if(kind==='won')unlock('estrellas33');
  else if(kind==='travel'&&bump('travel')>=10)unlock('viajeRapido10');else if(kind==='song'&&bump('song')>=5)unlock('cancionFan');
  else if(kind==='portal'){const seen=runtime.placesData?.()?.seen||{};if(['llanura','lago','bosque','tormenta','vacio'].every(id=>seen[id]))unlock('portales5');}}
 Object.defineProperties(runtime,{narrateRound:{get:()=>round},narrate:{get:()=>event},narratorLine:{get:()=>narratorLine}});
}
