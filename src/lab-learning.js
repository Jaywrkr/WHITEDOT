import {openSurface} from './frame-state.js';
import {normalizeLabLearning,responseMatches} from './lab-learning-model.js';
export function initialize(runtime){
 let owner=null,lesson=null,lastTime=0;
 const audible=()=>runtime.inWorld()&&runtime.S.sound&&runtime.musicVolume?.()>0&&runtime.ac?.state==='running'&&!document.hidden&&!openSurface('.modal:not([hidden])')&&!runtime.scanning&&!runtime.duetRoom;
 function book(){if(owner!==runtime.S){owner=runtime.S;owner.labLearning=normalizeLabLearning(owner.labLearning);lesson=null;}return owner.labLearning;}
 function begin(){if(book().version!==1)return false;lesson={stage:'choose',times:[],age:0};runtime.$('mGuide').hidden=true;lastTime=runtime.ac?.currentTime||0;return true;}
 function heard(kind,index,time,region,source,origin){
  book();if(!lesson||origin!=='player'||!audible())return;
  if(lesson.stage==='choose'){
   if(kind==='pulso'||!source||!Number.isFinite(source.x)||!Number.isFinite(source.y))return;
   lesson={stage:'call',kind,index,region,source,times:[],age:0};return;
  }
  if(lesson.stage!=='reply'||kind!=='pulso')return;
  lesson.times.push(time);lesson.times=lesson.times.slice(-2);
  if(!responseMatches(lesson.times,runtime.SIX*4))return;
  const voice=runtime.getVoice(lesson.kind,lesson.region,lesson.source),b=book();if(b.version!==1)return;
  b.completed=Math.min(999,b.completed+1);if(!b.roles.includes(voice.role))b.roles.push(voice.role);
  if(!b.instruments.includes(voice.instrument))b.instruments.push(voice.instrument);b.instruments=b.instruments.slice(-64);
  lesson.stage='done';lesson.age=0;runtime.save();
 }
 function bar(time){
  book();if(!lesson||!audible())return;
  if(lesson.stage==='call'){
   for(const offset of [0,8]){const at=time+offset*runtime.SIX;runtime.playVoice(lesson.kind,lesson.index,at,lesson.region,false,.35,lesson.source,'lesson');runtime.labLearningNoteCue?.({time:at,kind:lesson.kind});}
   lesson.stage='listening';lesson.replyAt=time+runtime.SIX*16;lesson.age=0;
  }
 }
 function tick(){
  book();const now=runtime.ac?.currentTime||0,dt=Math.max(0,Math.min(.1,now-lastTime));lastTime=now;if(!lesson)return;
  if(!audible()){if(['listening','reply'].includes(lesson.stage)){lesson.stage='call';lesson.age=0;lesson.times=[];}return;}
  if(lesson.source&&Math.hypot(lesson.source.x-runtime.S.wx,lesson.source.y-runtime.S.wy)>220){lesson={stage:'choose',age:0,times:[]};return;}
  lesson.age+=dt;if(lesson.stage==='listening'&&now>=lesson.replyAt){lesson.stage='reply';lesson.age=0;}
  if(lesson.stage==='reply'&&lesson.age>Math.max(8,runtime.SIX*64)){lesson.stage='call';lesson.age=0;lesson.times=[];}
  if(lesson.stage==='done'&&lesson.age>4)lesson=null;
 }
 function draw(ox,oy){
  if(!lesson||!audible())return;const c=runtime.cx,source=lesson.source,
   text={choose:'Acércate a una voz para escucharla.',call:'Escucha dos llamadas.',listening:'Escucha dos llamadas.',reply:'Pulsa dos veces con ese mismo espacio.',done:'Encontraste el pulso compartido.'}[lesson.stage],
   x=source?source.x+ox:runtime.W/2,y=source?source.y+oy:runtime.H/2;
  c.save();c.globalAlpha=.72;c.fillStyle='#fff';c.textAlign='center';c.font='11px "Geist Mono", monospace';c.fillText(text,Math.max(110,Math.min(runtime.W-110,x)),Math.max(100,Math.min(runtime.H-100,y+48)),220);c.restore();
 }
 function card(){const b=book();return b.version===1&&b.completed?`<article class="journal-card"><h3>Escuchar y responder</h3><p>${b.roles.length} papeles musicales explorados.</p></article>`:'';}
 runtime.$('guideLabPractice').onclick=begin;
 Object.defineProperties(runtime,{beginLabLearning:{get:()=>begin},labLearningHear:{get:()=>heard},labLearningBar:{get:()=>bar},labLearningTick:{get:()=>tick},drawLabLearning:{get:()=>draw},labLearningCard:{get:()=>card},labLearningState:{get:()=>lesson}});book();
}
