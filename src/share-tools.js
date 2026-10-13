// Compartir (fase 8): códigos de lugar y grabación de un set con video y audio.
// - Código de lugar: semilla + versiones + layout + capa + coordenadas. Abrirlo guarda el lugar en
//   Favoritos y, si es del mismo mundo, te orienta hacia él (no teletransporta: la distancia sigue contando).
// - Grabar set: hasta 60 s de la pantalla con el audio real del juego, para descargar o compartir.
import {supportedWorld,sameWorld,placeAddress} from './world-identity.js';

const PREFIX='WD1-';
const b64url=s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const unb64url=s=>decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((s.length+3)%4))));
// Código compacto y legible por máquina. Redondea a 1 px: suficiente para volver al mismo punto.
export function encodePlace(address,name=''){
 const a=placeAddress(address,address.x,address.y,address.layer||'superficie');
 return PREFIX+b64url(JSON.stringify({s:a.seed,l:a.layout,g:a.generatorVersion,c:a.catalogVersion,o:a.layoutVersion,x:Math.round(a.x),y:Math.round(a.y),L:a.layer==='superficie'?0:a.layer==='bajo'?1:2,n:String(name).slice(0,40)}));
}
export function decodePlace(code){
 const text=String(code||'').trim();if(!text.startsWith(PREFIX)||text.length>400)throw Error('Código no reconocido');
 let v;try{v=JSON.parse(unb64url(text.slice(PREFIX.length)));}catch(_){throw Error('Código dañado');}
 const identity={seed:String(v.s??''),layout:v.l,generatorVersion:v.g,catalogVersion:v.c,layoutVersion:v.o};
 if(!supportedWorld(identity))throw Error('Mundo o versión no compatible');
 const address=placeAddress(identity,Number(v.x),Number(v.y),['superficie','bajo','cielo'][v.L]||'superficie');
 return {address,name:typeof v.n==='string'?v.n.slice(0,40):''};
}
// Formato de grabación que el navegador soporte (Safari prefiere mp4; Chrome/Android webm).
export function recordingType(isSupported=t=>typeof MediaRecorder!=='undefined'&&MediaRecorder.isTypeSupported?.(t)){
 return ['video/mp4;codecs=avc1,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>isSupported(t))||null;
}
export const MAX_SET_SECONDS=60;

export function initialize(runtime){
 const $=runtime.$,S=()=>runtime.S;
 // ---------- códigos de lugar ----------
 function currentCode(){const s=S(),region=runtime.activeLayerRegion?.()||runtime.regionOfPos(s.wx,s.wy);return encodePlace({...runtime.worldIdentity,x:s.wx,y:s.wy,layer:s.layer||'superficie'},region.name);}
 async function copy(text){try{await navigator.clipboard.writeText(text);return true;}catch(_){return false;}}
 async function shareHere(){
  if(!runtime.inWorld()){runtime.toast('<em>Código</em> · entra al Mundo para compartir dónde estás');return null;}
  const code=currentCode();$('placeCode').value=code;const ok=await copy(code);runtime.toast(ok?'<em>Código</em> · copiado':'<em>Código</em> · listo para copiar');runtime.unlock('codigo1');return code;
 }
 function openCode(text){
  let place;try{place=decodePlace(text);}catch(error){$('placeCodeInfo').textContent=error.message;return null;}
  const same=sameWorld(place.address,runtime.worldIdentity);
  const point=runtime.addFavoriteAddress?.(place.address,place.name||'Lugar compartido');
  if(!point){$('placeCodeInfo').textContent='No se pudo guardar: ¿Favoritos está lleno?';return null;}
  $('placeCodeInfo').textContent=same?'Guardado en Favoritos. Te oriento hacia allá.':`Guardado. Es de otro mundo (semilla “${place.address.seed||'original'}”): ábrelo desde Explorar mundos.`;
  if(same)runtime.selectDestination?.(point.id);runtime.unlock('codigoAbierto');return point;
 }
 $('placeShare').onclick=shareHere;
 $('placeOpen').onclick=()=>openCode($('placeCode').value);
 // ---------- grabar set ----------
 const rec={recorder:null,chunks:[],dest:null,stop:null,started:0,timer:null};
 function setUI(){const on=!!rec.recorder;$('bRecord').classList.toggle('rec',on);$('bRecord').querySelector('span').textContent=on?'Detener grabación':'Grabar set';$('recBadge').hidden=!on;}
 function start(){
  if(rec.recorder)return stop();
  const type=recordingType(),cv=$('w');
  if(!type||!cv.captureStream){runtime.toast('<em>Grabar</em> · este navegador no permite grabar el juego');return false;}
  runtime.audio();const out=runtime.outputStage?.clipper,ac=runtime.ac;if(!out||!ac?.createMediaStreamDestination){runtime.toast('<em>Grabar</em> · activa el sonido primero');return false;}
  rec.dest=ac.createMediaStreamDestination();out.connect(rec.dest);
  const stream=new MediaStream([...cv.captureStream(30).getVideoTracks(),...rec.dest.stream.getAudioTracks()]);
  rec.chunks=[];rec.recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:4e6});rec.recorder.ondataavailable=e=>{if(e.data.size)rec.chunks.push(e.data);};
  rec.recorder.onstop=()=>finish(type);rec.recorder.start(1000);rec.started=Date.now();
  rec.timer=setInterval(()=>{const left=MAX_SET_SECONDS-Math.floor((Date.now()-rec.started)/1000);$('recBadge').textContent=`● ${left} s`;if(left<=0)stop();},250);
  $('mMenu').hidden=true;setUI();runtime.toast('<em>Grabando</em> · hasta 60 s. Toca el punto rojo para terminar');return true;
 }
 function stop(){if(!rec.recorder)return false;clearInterval(rec.timer);try{rec.recorder.stop();}catch(_){finish(rec.recorder.mimeType);}return true;}
 function finish(type){
  try{runtime.outputStage?.clipper?.disconnect(rec.dest);}catch(_){}
  const blob=new Blob(rec.chunks,{type:type.split(';')[0]}),ext=type.includes('mp4')?'mp4':'webm',name=`whitedot-set-${new Date().toISOString().slice(0,16).replace(/[:T]/g,'-')}.${ext}`;
  rec.recorder=null;rec.dest=null;setUI();if(!blob.size){runtime.toast('<em>Grabar</em> · no se grabó nada');return;}
  const url=URL.createObjectURL(blob),file=new File([blob],name,{type:blob.type});runtime.lastSet={url,name,size:blob.size,type:blob.type,file};
  $('setVideo').src=url;$('setDownload').href=url;$('setDownload').download=name;$('setShare').hidden=!(navigator.canShare?.({files:[file]}));$('mSet').hidden=false;runtime.unlock('set1');
 }
 $('bRecord').onclick=e=>{e.stopPropagation();start();};$('recBadge').onclick=stop;
 $('setShare').onclick=async()=>{const f=runtime.lastSet?.file;if(f)try{await navigator.share({files:[f],title:'Mi set en WHITEDOT',text:'@jaywrkr'});}catch(_){}};
 $('setClose').onclick=()=>{$('mSet').hidden=true;};
 Object.defineProperties(runtime,{encodeFavorite:{get:()=>point=>encodePlace(point.address,point.name)},placeCode:{get:()=>currentCode},openPlaceCode:{get:()=>openCode},startSet:{get:()=>start},stopSet:{get:()=>stop},setRecording:{get:()=>!!rec.recorder}});
}
