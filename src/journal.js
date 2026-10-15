import {HYBRID_STYLES} from './musical-hybrids.js';
import {ACH_CATEGORIES,baseAchievementMeta} from './achievement-metadata.js';
import {albumEntries,filterAlbum,progressRing,nextDiscovery} from './journal-model.js';
import {albumPortrait} from './album-art.js';
import {RHYTHM_ELEMENTS} from './percussion-model.js';
import {SYNTH_PROGRAMS} from './synth-colors.js';
import {ECOLOGIES,ECOLOGY_CONTENT} from './ecology-model.js';
import { relicAt } from './relics.js';
import { gravityOf } from './gravity.js';
import { RHYTHM_GENRES } from './rhythms.js';
export const ROLES={bajo:'Bajos',perc:'Percusión',acorde:'Acordes',lead:'Melodías medias',agudo:'Detalles agudos'};
export const INSTRUMENTS={feltpiano:['Piano de fieltro','Parciales modales y caída cálida.'],airflute:['Flauta de aire','Armónicos, respiración y vibrato contenido.'],silkstrings:['Cuerdas de seda','Ensamble sostenido con desafinación suave.'],wavetable:['Ondas entrelazadas','Dos tablas armónicas que cambian su mezcla.'],graincloud:['Nube de granos','Granos afinados con ventanas superpuestas.'],pluckbody:['Cuerda física','Cuerda de retardo fraccional y amortiguación.'],modaldrum:['Membrana profunda','Modos resonantes con caída de afinación.'],analogpad:['Pad analógico','Ondas desafinadas y filtro cálido con entrada suave.'],phasekeys:['Teclas de fase','Síntesis armónica que cambia el color de la pulsación.'],fmglass:['Cristal FM','Modulación armónica suave con cuerpo y resonancia.'],choir:['Coro sintético','Formantes móviles y voces sostenidas de registro medio.'],resonantpluck:['Cuerda resonante','Sierra y triángulo con un filtro que abre y cierra.'],velvetbass:['Bajo de terciopelo','Seno y triángulo graves, suaves y sin efectos espaciales.'],granularair:['Aire granular','Grano de ruido filtrado y parciales afinados suaves.'],orbitorgan:['Órgano orbital','Parciales armónicos y resonancia móvil con espacio.'],pad:['Pad cálido','Entrada suave, cuerpo grave y acordes con espacio.'],plucked:['Cuerda pulsada','Ataque orgánico y resonancia corta de cuerda sintetizada.'],reed:['Ancheta electrónica','Triángulo y modulación suave filtrados para frases de aire y madera.'],membrane:['Membrana resonante','Parciales inarmónicos de caída breve para percusión afinada.'],bowed:['Cuerda frotada sintética','Entrada lenta y trémolo suave para frases sostenidas.'],hollow:['Resonador hueco','Ondas filtradas de registro medio con cuerpo y ataque contenido.'],cowbell:['Cencerro electrónico','Golpe metálico corto de las cajas de ritmo del electro y el Miami bass.'],logdrum:['Log drum FM','Bajo de ataque percutido y modulación breve para el groove amapiano.'],steel:['Steel pan sintético','Parciales resonantes de lámina para un color tropical suave.'],kalimba:['Kalimba FM','Lámina electrónica con ataque breve y resonancia afinada.'],rhodes:['Teclas FM cálidas','Teclado eléctrico sintetizado para acordes y melodías.'],strings:['Cuerdas analógicas','Ondas suavemente desafinadas y filtradas, con entrada lenta.'],brass:['Metales sintéticos','Ataque de filtro y armónicos para acentos disco.'],clav:['Clavinet electrónico','Pulsación corta y seca para síncopas funk.'],rubber:['Bajo elástico filtrado','Bajo de triángulo y sierra con cuerpo y ataque contenido.'],machine:['Bajo modular FM','Modulación armónica para secuencias robóticas graves.'],vocalform:['Formantes sintéticos','Filtro resonante sobre ondas de sierra con un color vocal electrónico.'],metalkeys:['Teclas metálicas FM','Parciales inarmónicos moderados para motivos mecánicos.'],guiro:['Güiro sintético','Raspado breve de ruido filtrado para contratiempos latinos.'],timbale:['Timbal electrónico','Percusión de tono y ruido para acentos latinos o mecánicos.'],sub:['Subgrave','Onda suave que sostiene las frecuencias bajas.'],fm:['Bajo FM','Modulación de frecuencia para bajos con cuerpo y armónicos.'],pluck:['Pulsación','Ataque corto que puede aportar notas graves o medias al ritmo.'],acid:['Bajo ácido','Onda y filtro resonante con carácter electrónico.'],reese:['Reese','Ondas desafinadas que crean un bajo ancho.'],roll:['Bajo rodante','Notas cortas que impulsan el groove.'],organb:['Órgano grave','Timbre de órgano usado en el registro bajo.'],boing:['Bajo elástico','Una nota cuya altura cae rápidamente.'],keys:['Teclas','Notas suaves con ataque definido.'],marimba:['Percusión melódica','Ataques breves y resonantes con altura musical.'],glass:['Cristal','Timbre brillante con armónicos y resonancia.'],organ:['Órgano','Ondas combinadas para notas y acordes con cuerpo.'],flute:['Flauta sintética','Onda suave con vibrato.'],saw:['Lead de sierra','Timbre electrónico rico en armónicos.'],bell:['Campana suave','Tono resonante de caída lenta.'],kick:['Bombo','Golpe grave que marca el pulso.'],tom:['Tom','Percusión afinada con resonancia grave o media.'],conga:['Conga','Golpe corto que añade síncopas.'],wood:['Madera','Percusión seca para patrones rítmicos.'],rim:['Rim','Acento corto y definido.'],shaker:['Shaker','Ruido breve que añade movimiento al ritmo.'],hat:['Hi-hat','Percusión de ruido en frecuencias altas.'],clap:['Clap','Golpe de ruido que acentúa el compás.'],snare:['Caja','Ruido y tono que aportan un golpe central.']};
const GENRE_GUIDE={electro:'Bombo sincopado, caja y bajo electrónico de carácter FM.',progressive:'Pulso de house, bajo continuo y capas melódicas que crecen.',microhouse:'Percusión pequeña, silencios y detalles con swing.',minimaltechno:'Bombo regular, bajo sintético y pocos acentos precisos.',dubstep:'Caja a medio tiempo, graves largos y síncopas.',dnb:'Tempo rápido, caja marcada y bajos con cuerpo.',ambient:'Notas espaciadas y texturas que dejan respirar el silencio.',downtempo:'Pulso lento con golpes separados y melodías tranquilas.',dub:'Ritmo estable, acordes con eco y espacio entre las notas.',deep:'Bombo regular, bajos cálidos y acordes con cuerpo.',afro:'Bombo regular y percusión sincopada de congas y claves.',minimal:'Pocos elementos, golpes precisos y pequeños detalles rítmicos.',rominimal:'Bajo rodante, percusión sutil y acentos desplazados.',acid:'Bajo resonante y ritmo electrónico intenso.',breaks:'Bombo y caja en patrones quebrados.',garage:'Ritmos con swing y acentos entre los pulsos.',tribal:'Toms, congas y patrones de percusión entrelazados.',heart:'Pulso lento y profundo con resonancias y eco.'};
export const MODES={'0,2,3,5,7,8,10':'Menor natural','0,2,3,5,7,9,10':'Dórica','0,1,3,5,7,8,10':'Frigia','0,2,4,6,7,9,11':'Lidia','0,2,4,5,7,9,10':'Mixolidia','0,2,4,5,7,9,11':'Mayor','0,2,3,5,7,8,11':'Menor armónica','0,1,4,5,7,8,10':'Frigia dominante'};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function regionFromKey(key, runtime) {
  if(!/^-?\d+,-?\d+$/.test(key))return null;
  const [x,y]=key.split(',').map(Number);
  if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y))return null;
  return runtime.regionOfPos(x*runtime.REG*runtime.WCH+1,y*runtime.REG*runtime.WCH+1);
}
export function ensureJournal(state) {
  state.journal ||= {};
  state.journal.events ||= {};
  state.journal.relics ||= {};
  state.journal.music ||= {};
  for(const kind of ['genres','instruments','scales','programs','hybrids'])state.journal.music[kind] ||= {};
  // Old stars have no location. Restore only entries that actually record one.
  for(const star of state.stars||[])if(star.region)state.journal.relics[star.region]=1;
  for(const key of Object.keys(state.events||{})) {
    const match=key.match(/^(lluvia|eclipse|migracion|aurora):(-?\d+,-?\d+)\d{4}-\d{2}-\d{2}$/);
    if(match)state.journal.events[match[2]]=1;
  }
  return state.journal;
}
export function initialize(runtime) {
  ensureJournal(runtime.S);
  const data=()=>runtime.S.journal?.music?.hybrids?runtime.S.journal:ensureJournal(runtime.S);
  let tab='places',group='todo',query='',ownership='todo',limit=60;
  function recordInstrument(id) {
    if(!(runtime.inWorld()||runtime.houseActive?.())||!runtime.S.sound||runtime.ac?.state!=='running')return;
    const music=data().music;
    music.instruments[id]=1;const hybrid=runtime.MU.radio?.hybrid;if(hybrid&&HYBRID_STYLES.some(h=>h.id===hybrid.id))music.hybrids[hybrid.id]=1;
    const program=runtime.activeInstrumentPatch?.program;if(program)music.programs[program.id]=1;
    const region=runtime.MU.dnaA;
    runtime.sessionInstrument?.(id,region);
    if(region){music.genres[region.genre]=1;music.scales[region.scale.join(',')]=1;}
  }
  const card=(title,description,extra='')=>`<article class="journal-card"><h3>${escape(title)}</h3><p>${escape(description)}</p>${extra}</article>`;
  function places() {
    const regions=Object.keys(runtime.S.places).map(k=>regionFromKey(k,runtime)).filter(Boolean);
    const favorites=runtime.favorites||[];const saved=favorites.length?'<h3>Favoritos</h3>'+favorites.map(p=>card(p.name,`${p.layer} · ${runtime.GEN[p.genre]?.name||p.genre} · ${p.character}`)).join(''):'';
    const mirrorEntries=Object.values(runtime.S.mirrorSites||{});
    const mirrorCard=mirrorEntries.length?card('Espejos musicales',`${mirrorEntries.length} instalaciones exploradas · ${mirrorEntries.filter(e=>e.solved).length} rutas de luz completadas. Orienta los tres espejos para revelar una figura y cambiar la secuencia.`):'';
    const depth=runtime.S.journal.depth||{},depthCard=Object.values(depth).some(Boolean)?card('Interacciones profundas',`${depth.threads?'Redes tejidas · ':''}${depth.dialogue?'Frases respondidas · ':''}${depth.box?'Suelos transformados':''} Los sonidos aprendidos, redes y patrones de estos encuentros son temporales.`):'';
    const installations=depthCard+mirrorCard+(Object.keys(runtime.S.glassSites||{}).length?card('Vidrios cromáticos',`${Object.keys(runtime.S.glassSites).length} instalaciones exploradas. Gira sus aros directamente para transformar bajo, groove y armonía sin panel; la orientación queda guardada.`):'');
    const living=data().ecologies||{},elements=data().ecologyObjects||{};const ecologyCard=Object.keys(living).length?card('Paisajes vivos',Object.values(ECOLOGIES).flat().filter(e=>living[e.id]).map(e=>e.name).join(' · '),Object.keys(elements).length?'<p>'+escape(ECOLOGY_CONTENT.filter(e=>elements[e.id.slice(8)]).map(e=>e.name).join(' · '))+'</p><p>Tocar, modelar y permanecer cerca transforma partes del género del lugar. El estado de los gestos es temporal.</p>':''):'';
    const rhythm=Object.keys(runtime.S.rhythmFound||{}).filter(k=>RHYTHM_ELEMENTS[k]);
    const rhythmCard=rhythm.length?card('Paisaje de percusión',rhythm.map(k=>RHYTHM_ELEMENTS[k].name).join(' · '),''):'';
    return (runtime.rewardCollectionCard?.()||'')+(runtime.livingStoryCard?.()||'')+((runtime.livingCard?.()||'')+(runtime.worldMemoryCard?.()||''))+(runtime.voiceDiaryCard?.()||'')+rhythmCard+(runtime.petCard?.()||'')+(runtime.cultureCard?.()||'')+ecologyCard+(runtime.creativeCard?.()||'')+(runtime.encounterJournal?.()||'')+saved+installations+(regions.length?regions.map(region=>{
      const found=region.species.filter(sp=>runtime.S.cat[sp.id]).length,gravity=gravityOf(region,runtime.seedOf),j=data();
      const [rx,ry]=region.key.split(',').map(Number);
      let hasSite=!!j.relics[region.key];
      for(let x=0;x<runtime.REG&&!hasSite;x++)for(let y=0;y<runtime.REG&&!hasSite;y++)hasSite=!!relicAt(rx*runtime.REG+x,ry*runtime.REG+y,runtime.WCH,runtime.seedOf,runtime.rng);
      const tasks=[['Formas',found===region.species.length],['Reto',!!runtime.S.retos[region.key]],...(region.name==='Origen'?[]:[['Evento',!!j.events[region.key]]]),...(hasSite?[['Reliquia',!!j.relics[region.key]]]:[])];
      const percent=Math.round((found/region.species.length+tasks.slice(1).filter(t=>t[1]).length)/tasks.length*100);
      return card(region.name,`${region.worldFamily?.name||region.ecology?.name||runtime.BIOMES[region.z].name} · ${runtime.GEN[region.genre].name} · ${region.bpm} BPM · ${gravity.name} · ${gravity.movement}`,`<p>${escape(region.hab?.[1]||"")} · ${escape(region.fill?.[1]||"")} · ${escape(runtime.AIRTXT[region.air]||"")} · ${escape(region.ground?"Suelo de "+region.ground:"Sin suelo")}</p>${region.recipe?`<p>${escape(region.recipe.name)} · ${escape(region.recipe.materialName)}</p>`:""}<p>Descubrimiento ${percent}% · Formas ${found}/${region.species.length}</p><ul>${tasks.map(([name,done])=>`<li>${name}: ${done?'descubierto':'pendiente'}</li>`).join('')}</ul>`);
    }).join(''):card('El mapa espera','Completa el Camino y entra al Mundo para descubrir lugares.'));
  }
  function forms() {
    const groups=Object.fromEntries(Object.keys(ROLES).map(k=>[k,[]]));
    for(const id of Object.keys(runtime.S.cat)) {
      const region=regionFromKey(id.split(':')[0],runtime),sp=region?.species.find(s=>s.id===id);
      if(!sp)continue;
      const voice=runtime.getVoice(`forma:${id}`,region);
      groups[voice.role].push(card(sp.name,`${region.name} · ${INSTRUMENTS[voice.instrument]?.[0]||voice.instrument}`));
    }
    return Object.entries(groups).filter(([,items])=>items.length).map(([role,items])=>`<h3>${ROLES[role]}</h3>${items.join('')}`).join('')||card('Sin formas descubiertas','Toca las formas con anillo dorado para registrarlas.');
  }
  function music() {
    const heard=data().music;
    return progressRing(Object.keys(heard.genres).length,52,'Géneros')+'<h3>Cruces musicales</h3>'+HYBRID_STYLES.filter(h=>heard.hybrids?.[h.id]).map(h=>card(h.name,'Una influencia transforma frases, armonía, registro e instrumentos.')).join('')+'<h3>Colores de síntesis</h3>'+SYNTH_PROGRAMS.filter(p=>heard.programs?.[p.id]).map(p=>card(p.name,`Filtro ${p.type==='lowpass'?'grave':p.type==='bandpass'?'de banda':'de muesca'} · ${p.slope?p.slope+' dB':''}`)).join('')+
      '<h3>Géneros</h3>'+Object.keys(heard.genres).map(id=>card(runtime.GEN[id]?.name||id,GENRE_GUIDE[id]||RHYTHM_GENRES[id]?.guide||'Identidad musical de una región escuchada.')).join('')+
      '<h3>Escalas</h3>'+Object.keys(heard.scales).map(id=>card(MODES[id]||'Escala regional','Conjunto de intervalos que organiza las notas y acordes del lugar.')).join('')+
      '<h3>Instrumentos</h3>'+Object.keys(heard.instruments).map(id=>card(...(INSTRUMENTS[id]||[id,'Instrumento sintetizado del Mundo.']))).join('')+
      '<h3>Sets</h3>'+((runtime.S.setLog||[]).map(set=>card('Set registrado',set.at+' · '+set.name)).join('')||(runtime.S.ach.set1?card('Tu primer set',String(runtime.S.ach.set1)):card('Graba tu música','Menú → Crear → Grabar set.')))+(runtime.lastSet?'<button data-journal-set>Tu último set</button>':'')+
      (!Object.keys(heard.instruments).length?card('Escucha el Mundo','Activa el sonido y explora. Aquí se registran los sonidos que el juego reproduce.'): '');
  }
  function achievements(){const list=runtime.ACH.filter(a=>!runtime.achievementMeta?.(a)?.retired||runtime.S.ach[a[0]]),got=list.filter(a=>runtime.S.ach[a[0]]);return progressRing(got.length,list.length,'Logros')+ACH_CATEGORIES.map(category=>{const group=list.filter(a=>(runtime.achievementMeta?.(a)||baseAchievementMeta(a)).category===category);return '<h3>'+category+'</h3>'+group.map(a=>{const meta=runtime.achievementMeta?.(a)||baseAchievementMeta(a),date=runtime.S.ach[a[0]],rule=runtime.achievementRules?.find(p=>p.id===a[0]),progress=rule?runtime.achievementProgress(rule):null;return card(meta.hidden&&!date?'???':a[1],meta.hidden&&!date?'Sigue explorando.':a[2],'<p>'+escape(meta.tier+' · '+(date?date:'Pendiente'))+'</p>'+(progress?'<progress max="'+progress.target+'" value="'+progress.value+'" aria-label="Progreso"></progress>':''));}).join('');}).join('');}
  function today(){const summary=runtime.sessionSummary?.();if(!summary)return card('Hoy empieza aquí','Entra al mundo y escucha una voz.');return card(runtime.S.session?'Sesión en curso':'Última sesión',`${summary.day} · ${Math.floor(summary.seconds/60)} minutos`)+card('Tu actividad',`${summary.interactions} interacciones · ${summary.pulses} pulsos`)+card('Descubrimientos',`${summary.places} lugares · ${summary.forms} formas · ${summary.relics} hallazgos`)+card('Música compartida',summary.genres.map(id=>runtime.GEN[id]?.name||id).join(' · ')||'Escucha el mundo.');}
  function collection(){if(group==='tarjetas')return runtime.rareBookCards?.(query)||'';if(group==='formas')return forms();const all=albumEntries(runtime.S,runtime.rewardPieces||[]),rows=filterAlbum(all,{group,search:query,owned:ownership});runtime.$('journalMore').hidden=rows.length<=limit;return progressRing(rows.filter(p=>p.owned).length,rows.length,'Colección',{earned:rows.filter(p=>p.owned&&p.earned!==false).length})+'<div class="journal-album">'+rows.slice(0,limit).map(p=>`<article class="journal-card album-piece" data-owned="${p.owned&&p.earned!==false}"><svg viewBox="-40 -40 80 80" aria-hidden="true">${albumPortrait(p)}</svg><h3>${escape(p.name)}</h3><p>${escape(p.owned?'Conseguida · '+(p.date||'Progreso anterior'):p.hint||'Explora y escucha.')}</p></article>`).join('')+'</div>';}
  function constellation(){return '<h3>Tu constelación</h3><canvas id="journalSky" width="320" height="220" aria-label="Recorridos guardados"></canvas>'+card('Estrellas compartidas',runtime.S.stars.length+' recuerdos conservados.');}
  function render() {
    ensureJournal(runtime.S);
    runtime.$('sessionShare').hidden=tab!=='today'||!runtime.sessionSummary?.();
    runtime.$('rareCodeFallback').hidden=true;
    runtime.$('journalFilters').hidden=tab!=='collection';runtime.$('journalMore').hidden=true;runtime.$('journalBody').innerHTML=({today,places:()=>places()+constellation(),collection,music,achievements})[tab]();if(tab==='places'){const canvas=document.getElementById('journalSky');runtime.drawSky?.(canvas.getContext('2d'),20,20,280,180);}
    runtime.$('journalBody').scrollTop=0;
    document.querySelectorAll('[data-journal-tab]').forEach(button=>{const active=button.dataset.journalTab===tab;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);});
  }
  function openJournal(nextTab){const aliases={forms:'formas',elements:'elementos',rares:'tarjetas'};if(aliases[nextTab]){tab='collection';group=aliases[nextTab];runtime.$('journalGroup').value=group;}else if(['today','places','collection','music','achievements'].includes(nextTab))tab=nextTab;render();runtime.$('mJournal').hidden=false;}
  document.querySelectorAll('[data-journal-tab]').forEach(button=>button.onclick=()=>{tab=button.dataset.journalTab;render();});
  runtime.$('sessionShare').addEventListener('click',()=>runtime.$('mJournal').hidden=true);
  runtime.$('journalGroup').onchange=e=>{group=e.target.value;limit=60;render();};runtime.$('journalOwnership').onchange=e=>{ownership=e.target.value;limit=60;render();};runtime.$('journalSearch').oninput=e=>{query=e.target.value;limit=60;render();};runtime.$('journalMore').onclick=()=>{limit+=60;render();};
  runtime.$('journalNext').onclick=()=>{const d=runtime.regionOfPos(runtime.S.wx,runtime.S.wy),n=nextDiscovery(runtime.S,{biomeId:runtime.BIOMES[d.z].id});runtime.$('mJournal').hidden=true;runtime.say(n.text,n.name);};
  runtime.$('bSession').hidden=true;runtime.$('bSky').hidden=true;
  document.getElementById('journalClose').onclick=()=>{runtime.$('mJournal').hidden=true;runtime.save();};
  runtime.$('journalBody').addEventListener('click',event=>{if(event.target.closest('[data-journal-set]')){runtime.$('mJournal').hidden=true;runtime.$('mSet').hidden=false;}else runtime.rareBookAction?.(event);});
  Object.defineProperties(runtime,{refreshJournal:{get:()=>render},openJournal:{get:()=>openJournal},recordInstrument:{get:()=>recordInstrument}});
}
