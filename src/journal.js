import { relicAt } from './relics.js';
import { gravityOf } from './gravity.js';
import { RHYTHM_GENRES } from './rhythms.js';
export const ROLES={bajo:'Bajos',perc:'Percusión',acorde:'Acordes',lead:'Melodías medias',agudo:'Detalles agudos'};
export const INSTRUMENTS={cowbell:['Cencerro electrónico','Golpe metálico corto de las cajas de ritmo del electro y el Miami bass.'],logdrum:['Log drum FM','Bajo de ataque percutido y modulación breve para el groove amapiano.'],steel:['Steel pan sintético','Parciales resonantes de lámina para un color tropical suave.'],kalimba:['Kalimba FM','Lámina electrónica con ataque breve y resonancia afinada.'],rhodes:['Teclas FM cálidas','Teclado eléctrico sintetizado para acordes y melodías.'],strings:['Cuerdas analógicas','Ondas suavemente desafinadas y filtradas, con entrada lenta.'],brass:['Metales sintéticos','Ataque de filtro y armónicos para acentos disco.'],clav:['Clavinet electrónico','Pulsación corta y seca para síncopas funk.'],rubber:['Bajo elástico filtrado','Bajo de triángulo y sierra con cuerpo y ataque contenido.'],machine:['Bajo modular FM','Modulación armónica para secuencias robóticas graves.'],vocalform:['Formantes sintéticos','Filtro resonante sobre ondas de sierra con un color vocal electrónico.'],metalkeys:['Teclas metálicas FM','Parciales inarmónicos moderados para motivos mecánicos.'],guiro:['Güiro sintético','Raspado breve de ruido filtrado para contratiempos latinos.'],timbale:['Timbal electrónico','Percusión de tono y ruido para acentos latinos o mecánicos.'],sub:['Subgrave','Onda suave que sostiene las frecuencias bajas.'],fm:['Bajo FM','Modulación de frecuencia para bajos con cuerpo y armónicos.'],pluck:['Pulsación','Ataque corto que puede aportar notas graves o medias al ritmo.'],acid:['Bajo ácido','Onda y filtro resonante con carácter electrónico.'],reese:['Reese','Ondas desafinadas que crean un bajo ancho.'],roll:['Bajo rodante','Notas cortas que impulsan el groove.'],organb:['Órgano grave','Timbre de órgano usado en el registro bajo.'],boing:['Bajo elástico','Una nota cuya altura cae rápidamente.'],keys:['Teclas','Notas suaves con ataque definido.'],marimba:['Percusión melódica','Ataques breves y resonantes con altura musical.'],glass:['Cristal','Timbre brillante con armónicos y resonancia.'],organ:['Órgano','Ondas combinadas para notas y acordes con cuerpo.'],flute:['Flauta sintética','Onda suave con vibrato.'],saw:['Lead de sierra','Timbre electrónico rico en armónicos.'],bell:['Campana suave','Tono resonante de caída lenta.'],kick:['Bombo','Golpe grave que marca el pulso.'],tom:['Tom','Percusión afinada con resonancia grave o media.'],conga:['Conga','Golpe corto que añade síncopas.'],wood:['Madera','Percusión seca para patrones rítmicos.'],rim:['Rim','Acento corto y definido.'],shaker:['Shaker','Ruido breve que añade movimiento al ritmo.'],hat:['Hi-hat','Percusión de ruido en frecuencias altas.'],clap:['Clap','Golpe de ruido que acentúa el compás.'],snare:['Caja','Ruido y tono que aportan un golpe central.']};
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
  for(const kind of ['genres','instruments','scales'])state.journal.music[kind] ||= {};
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
  const data=()=>runtime.S.journal||ensureJournal(runtime.S);
  let tab='places';
  function recordInstrument(id) {
    if(!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running')return;
    const music=data().music;
    music.instruments[id]=1;
    const region=runtime.MU.dnaA;
    runtime.sessionInstrument?.(id,region);
    if(region){music.genres[region.genre]=1;music.scales[region.scale.join(',')]=1;}
  }
  const card=(title,description,extra='')=>`<article class="journal-card"><h3>${escape(title)}</h3><p>${escape(description)}</p>${extra}</article>`;
  function places() {
    const regions=Object.keys(runtime.S.places).map(k=>regionFromKey(k,runtime)).filter(Boolean);
    return regions.length?regions.map(region=>{
      const found=region.species.filter(sp=>runtime.S.cat[sp.id]).length,gravity=gravityOf(region,runtime.seedOf),j=data();
      const [rx,ry]=region.key.split(',').map(Number);
      let hasSite=!!j.relics[region.key];
      for(let x=0;x<runtime.REG&&!hasSite;x++)for(let y=0;y<runtime.REG&&!hasSite;y++)hasSite=!!relicAt(rx*runtime.REG+x,ry*runtime.REG+y,runtime.WCH,runtime.seedOf,runtime.rng);
      const tasks=[['Formas',found===region.species.length],['Reto',!!runtime.S.retos[region.key]],...(region.name==='Origen'?[]:[['Evento',!!j.events[region.key]]]),...(hasSite?[['Reliquia',!!j.relics[region.key]]]:[])];
      const percent=Math.round((found/region.species.length+tasks.slice(1).filter(t=>t[1]).length)/tasks.length*100);
      return card(region.name,`${runtime.BIOMES[region.z].name} · ${runtime.GEN[region.genre].name} · ${region.bpm} BPM · ${gravity.name} · ${gravity.movement}`,`<p>${escape(region.hab?.[1]||"")} · ${escape(region.fill?.[1]||"")} · ${escape(runtime.AIRTXT[region.air]||"")} · ${escape(region.ground?"Suelo de "+region.ground:"Sin suelo")}</p>${region.recipe?`<p>${escape(region.recipe.name)} · ${escape(region.recipe.materialName)}</p>`:""}<p>Descubrimiento ${percent}% · Formas ${found}/${region.species.length}</p><ul>${tasks.map(([name,done])=>`<li>${name}: ${done?'descubierto':'pendiente'}</li>`).join('')}</ul>`);
    }).join(''):card('El mapa espera','Completa el Camino y entra al Mundo para descubrir lugares.');
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
    return '<h3>Géneros</h3>'+Object.keys(heard.genres).map(id=>card(runtime.GEN[id]?.name||id,GENRE_GUIDE[id]||RHYTHM_GENRES[id]?.guide||'Identidad musical de una región escuchada.')).join('')+
      '<h3>Escalas</h3>'+Object.keys(heard.scales).map(id=>card(MODES[id]||'Escala regional','Conjunto de intervalos que organiza las notas y acordes del lugar.')).join('')+
      '<h3>Instrumentos</h3>'+Object.keys(heard.instruments).map(id=>card(...(INSTRUMENTS[id]||[id,'Instrumento sintetizado del Mundo.']))).join('')+
      (!Object.keys(heard.instruments).length?card('Escucha el Mundo','Activa el sonido y explora. Aquí se registran los sonidos que el juego reproduce.'): '');
  }
  function achievements() {
    const groups={Constancia:[],Exploración:[],Música:[],Ocultos:[]};
    for(const [id,name,description,hidden]of runtime.ACH) {
      const got=runtime.S.ach[id],group=hidden?'Ocultos':/^(r\d|t\d|dia1|tope|regreso|s10)/.test(id)?'Constancia':['escuchaViva','tiempo','under','faro','banda','jardinero','tambor'].includes(id)?'Música':'Exploración';
      groups[group].push(card(hidden&&!got?'???':name,hidden&&!got?'Logro oculto. Sigue explorando.':description,`<p>${got?'Conseguido':'Pendiente'}</p>`));
    }
    return Object.entries(groups).map(([name,items])=>`<h3>${name}</h3>${items.join('')}`).join('');
  }
  function render() {
    ensureJournal(runtime.S);
    runtime.$('journalBody').innerHTML=({places,forms,music,achievements})[tab]();
    runtime.$('journalBody').scrollTop=0;
    document.querySelectorAll('[data-journal-tab]').forEach(button=>{const active=button.dataset.journalTab===tab;button.setAttribute('aria-pressed',String(active));button.classList.toggle('gold',active);});
  }
  function openJournal() {render();runtime.$('mJournal').hidden=false;}
  document.querySelectorAll('[data-journal-tab]').forEach(button=>button.onclick=()=>{tab=button.dataset.journalTab;render();});
  document.getElementById('journalClose').onclick=()=>{runtime.$('mJournal').hidden=true;runtime.save();};
  Object.defineProperties(runtime,{openJournal:{get:()=>openJournal},recordInstrument:{get:()=>recordInstrument}});
}
