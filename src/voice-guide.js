const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const VOICE_MODES=['discreta','guia','poetica'];
export function discoveryJourney(state){
 const steps=[
  {id:'voice',done:!!state.creativeJourney?.transformed||Object.keys(state.voiceLearned||{}).length>0,text:'Acerca el cubo a una criatura o planta. Escucha su respuesta.'},
  {id:'place',done:(state.favorites?.items?.length||0)>0,text:'Guarda este lugar en Favoritos: toca el marcador de arriba.'},
  {id:'home',done:(state.house?.objects?.length||0)>0,text:'Entra en Casa desde el menú. Coloca un objeto ganado.'},
  {id:'relic',done:(state.stars?.length||0)>0,text:'Busca una reliquia. Escucha cerca y pulsa para despertarla.'}
 ];
 return {steps,completed:steps.filter(s=>s.done).length,next:steps.find(s=>!s.done)?.text||'Sigue una voz nueva. Conserva lo que haga tu música especial.'};
}
export function rememberVoice(state,text,title,context={}){
 if(!Array.isArray(state.voiceDiary))state.voiceDiary=[];
 if(state.voiceDiary.at(-1)?.text===text)return;
 state.voiceDiary.push({text:String(text).slice(0,600),title:String(title||'Sistema').slice(0,80),at:new Date().toISOString(),x:state.wx,y:state.wy,...context});
 if(state.voiceDiary.length>80)state.voiceDiary.shift();
}
export function initialize(runtime){
 const select=runtime.$('voiceMode');select.value=VOICE_MODES.includes(runtime.S.voiceMode)?runtime.S.voiceMode:'discreta';
 select.onchange=()=>{runtime.S.voiceMode=select.value;runtime.save();};
 let seconds=0,lastKey='',owner=runtime.S;
 function openGuide(){const journey=discoveryJourney(runtime.S);runtime.$('guideNext').textContent=journey.next;runtime.$('guideProgress').textContent=journey.completed+' de '+journey.steps.length+' experiencias · sin orden obligatorio';runtime.$('mMenu').hidden=true;runtime.$('mGuide').hidden=false;}
 runtime.$('bGuide').onclick=openGuide;runtime.$('guideClose').onclick=()=>runtime.$('mGuide').hidden=true;
 runtime.$('guideGlossary').onclick=()=>{const content=runtime.$('guideDefinitions');content.hidden=!content.hidden;runtime.$('guideGlossary').setAttribute('aria-expanded',String(!content.hidden));};
 function tick(dt,paused){
  if(owner!==runtime.S){owner=runtime.S;seconds=0;lastKey='';select.value=owner.voiceMode||'discreta';}
  if(paused||!runtime.inWorld()||runtime.firstJourneyState?.next)return;seconds+=dt;if(seconds<180)return;seconds=0;
  const d=runtime.regionOfPos(runtime.S.wx,runtime.S.wy),key=d.key+':'+(runtime.body?.still>15?'quietud':'caminar');
  if(key===lastKey||!runtime.livingEnvironment?.convergence||runtime.S.voiceMode==='discreta'||!runtime.S.voiceMode)return;lastKey=key;
  if(runtime.S.voiceMode==='guia'&&runtime.livingEnvironment?.migration){runtime.say('El ambiente cambia. Sigue una criatura y escucha su nueva frase.','El ambiente cambia',{exceptional:true});return;}
  if(runtime.S.voiceMode==='poetica')runtime.say(runtime.body?.still>15?'Quédate. El lugar encuentra otra voz junto a ti.':'Camina con atención. Otra presencia puede responder distinto.','El Camino');
  else runtime.say(runtime.body?.still>15?'Escucha el cambio. Acércate despacio y descubre cada voz.':'Acerca el cubo. Alejarte suelta el gesto; fijarlo es opcional.','Escuchar aquí');
 }
 function heard(kind,region,source,origin){
  if(origin!=='player'||!runtime.S.sound||runtime.musicVolume?.()===0||runtime.ac?.state!=='running')return;
  if(kind!=='pulso'&&Number.isFinite(source?.x)&&Number.isFinite(source?.y))runtime.firstJourneyEvent?.('voice');
  const help=runtime.S.voiceLearned||={};const v=runtime.getVoice(kind,region,source);if(help[v.role])return;help[v.role]=true;
  if(runtime.S.voiceMode==='guia')runtime.say(`Este encuentro aporta ${ {bajo:'graves',perc:'percusión',acorde:'armonía',lead:'una frase',agudo:'detalle melódico'}[v.role]||v.role}. Su voz cambia entre ambientes.`, 'El lugar responde',{requested:true});
 }
 function diary(){return '<article class="journal-card"><h3>La Voz · recuerdos</h3>'+((runtime.S.voiceDiary||[]).slice(-12).reverse().map(v=>`<p><b>${escape(v.title)}</b> · ${escape(v.text)}</p>`).join('')||'<p>Los mensajes completos se conservan aquí.</p>')+'</article>';}
 Object.defineProperties(runtime,{voiceGuideTick:{get:()=>tick},voiceGuideHear:{get:()=>heard},voiceDiaryCard:{get:()=>diary}});
}
