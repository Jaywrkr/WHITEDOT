import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast,commitJourneyClose} from './journey-games.js';
// «Suelta» (the Vacío, chapter 5 of the Journey's games, Jay's decision of 23 October): the cube arrives carrying what
// stuck to it in the Llanura. Each pulse on time lets one thing go: it rises, becomes a star where you are and, a bar
// later, sings your note back. The cube grows lighter and smaller with each one, and the bar fills. When the last
// one is a star, the cube is tiny again under a full sky, and its own gold light comes beside it: one pulse on time
// and the Journey goes on to the Refugio. Off time nothing happens.
export const RELEASE_MIN=12,RELEASE_MAX=24,RELEASE_STARS=RELEASE_MAX,RELEASE_LIGHT_GAP=60,RELEASE_SPACE=100;
// Plan F1 (Jay found the Vacío beautiful but too quick): one thing lets go only on the «1» of the bar, and each star
// wants its own sky, at least RELEASE_SPACE from the others, so the player walks to draw the constellation.
export const downbeat=step=>Number.isFinite(step)&&Math.round(step)%16===0;
export const freeSky=(stars,spot)=>stars.every(p=>Math.hypot(p.x-spot.x,p.y-spot.y)>=RELEASE_SPACE);
// How many things the cube carries: what stuck in the Llanura, between twelve and twenty-four.
export const releaseTotal=stuck=>Math.max(RELEASE_MIN,Math.min(RELEASE_MAX,Number.isFinite(stuck)?Math.round(stuck):0));
export const releaseProgress=(released,total)=>total>0?Math.max(0,Math.min(1,released/total)):0;
// The cube carries its load: a little bigger while full, its usual size once it has let everything go.
export const releaseScale=(released,total)=>1+1.2*(1-releaseProgress(released,total));
// Where a released thing becomes a star: up and around from where the cube was, by hash of its number.
export function starSpot(n,from,seed='release:v1'){const a=-1.571+(hashKey(seed+':'+n+':a')-.5)*2.6,d=60+70*hashKey(seed+':'+n+':d');return {x:Math.round(from.x+Math.cos(a)*d),y:Math.round(from.y+Math.sin(a)*d)};}
// A saved sky keeps its size: the quick tests (chapter-test.js) save fewer than twelve, and a reload must not raise
// them back to the minimum (alpha.230). A normal game never saves fewer than RELEASE_MIN.
export function normalizeRelease(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};const total=Number.isInteger(q.total)&&q.total>0?Math.min(RELEASE_MAX,q.total):0;
 const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:Math.round(p.x),y:Math.round(p.y)}:null;
 return {total,released:Number.isInteger(q.released)?Math.max(0,Math.min(total,q.released)):0,stars:Array.isArray(q.stars)?q.stars.map(point).filter(Boolean).slice(-RELEASE_STARS):[],light:point(q.light),lit:q.lit===true,hinted:q.hinted===true,spaceHint:q.spaceHint===true};}
export function initialize(runtime){
 let owner=null,state=null,misses=0,shiver=0,lightPulse=0;const rising=[],songs=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S||j.release!==state){owner=runtime.S;j.release=normalizeRelease(j.release);state=j.release;rising.length=0;songs.length=0;}
  if(!state.total)state.total=Math.round(releaseTotal(j.stick?.gone?.length)*(runtime.placeGoalScale?.()||1));return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('vacio');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const done=()=>own().released>=own().total;
 // The star sings your note back a bar later, an octave up, softly.
 function sing(midi){if(!audible()||!Number.isFinite(midi))return;const bar=(runtime.SIX||.15)*16;runtime.soon?.(t=>runtime.pluck?.(Math.min(96,midi+12),t+bar,runtime.vel?.(.06)??.06,3),'player');songs.push(performance.now()+bar*1000);if(songs.length>8)songs.shift();}
 function arrive(){const s=own();if(s.light)return;s.light={x:Math.round(runtime.S.wx+RELEASE_LIGHT_GAP),y:Math.round(runtime.S.wy-RELEASE_LIGHT_GAP*.5)};lightPulse=1;runtime.save?.();
  chapterToast(runtime,'vacio','Tu luz llegó: tócala a tiempo.');}
 function light(){const s=own();if(s.lit)return 'done';s.lit=true;if(!commitJourneyClose(runtime,'vacio')){s.lit=false;return null;}runtime.enterFx=1;runtime.flash=1;return 'light';}
 // Only on time: one thing lets go and becomes a star. Off time the cube shivers.
 let crowded=null,early=0;
 function pulse(on,beat={}){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}
  if(done()){if(!s.light)arrive();return light();}
  // On time but not on the «1»: the beat dots show where the «1» is. With the sound off any pulse counts.
  if(!beat.silent&&!downbeat(beat.step)){early=performance.now();return 'wait';}
  const next=starSpot(s.released,{x:runtime.S.wx,y:runtime.S.wy});if(!freeSky(s.stars,next)){sayOnce(runtime,s,'spaceHint','Cada estrella quiere su cielo: muévete.','vacio',300);crowded={at:performance.now(),star:s.stars.reduce((a,p)=>Math.hypot(p.x-next.x,p.y-next.y)<Math.hypot(a.x-next.x,a.y-next.y)?p:a)};return 'crowded';}
  const spot=next;s.released++;s.stars.push(spot);if(s.stars.length>RELEASE_STARS)s.stars.shift();
  rising.push({from:{x:runtime.S.wx,y:runtime.S.wy},to:spot,at:performance.now()});// The pulse's theme note is chosen right after this call: sing it once the judge has finished.
  Promise.resolve().then(()=>sing(runtime.journeyPulseState?.()?.midi));
  if(done())arrive();runtime.save?.();return 'release';}
 function tick(){const s=own();if(done()&&!s.light)arrive();
  if(s.light&&!s.lit){const dx=runtime.S.wx+RELEASE_LIGHT_GAP-s.light.x,dy=runtime.S.wy-RELEASE_LIGHT_GAP*.5-s.light.y;if(Math.hypot(dx,dy)>4){s.light.x+=dx*.08;s.light.y+=dy*.08;}}}
 // Under the cube: the dark, the stars you made (joined faintly in the order they were born) and your gold light.
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Toca en el 1 de cada compás: lo que llevas se vuelve estrella.','vacio');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now(),singing=songs.some(at=>Math.abs(now-at)<300);
  c.save();c.globalAlpha=.5;c.fillStyle='#000';c.fillRect(0,0,W,H);
  const born=s.stars.filter((_,i)=>i<s.stars.length-rising.filter(r=>now-r.at<900).length);
  if(born.length>1){c.globalAlpha=.18;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();born.forEach((p,i)=>i?c.lineTo(sx(p.x),sy(p.y)):c.moveTo(sx(p.x),sy(p.y)));c.stroke();}
  born.forEach((p,i)=>{const x=sx(p.x),y=sy(p.y),tw=still?1:.6+.4*Math.sin(t/500+i*1.7),z=2+(i===born.length-1&&singing?2:0);
   c.globalAlpha=(.15+.2*glow)*tw;c.fillStyle='#ffffff';c.beginPath();c.arc(x,y,z*3+3,0,6.283);c.fill();
   c.globalAlpha=.9*tw;c.fillRect(Math.round(x)-z/2-1,Math.round(y)-.5,z+2,1);c.fillRect(Math.round(x)-.5,Math.round(y)-z/2-1,1,z+2);c.fillRect(Math.round(x)-1,Math.round(y)-1,2,2);});
  if(s.light&&!s.lit){const gx=sx(s.light.x),gy=sy(s.light.y),breath=still?0:Math.sin(t/700)*3+lightPulse*Math.sin(t/40)*5;lightPulse=Math.max(0,lightPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,24+breath+6*glow,0,6.283);c.fill();c.globalAlpha=.95;c.fillRect(Math.round(gx)-4,Math.round(gy)-4,8,8);}
  c.restore();}
 // Over the cube: what it still carries, turning around it, and what rises to become a star.
 function over(c,W,H,t){if(!active())return;const s=own(),now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),still=calm();c.save();
  const left=s.total-s.released,scale=releaseScale(s.released,s.total),ring=6+7*scale;
  for(let i=0;i<left;i++){const a=hashKey('release:'+i)*6.283+(still?0:t/2400),d=ring*(.7+.3*hashKey('release:d'+i));c.globalAlpha=.9;c.fillStyle=i%3?'#ffffff':gold;c.fillRect(Math.round(cx+Math.cos(a)*d)-1.5,Math.round(cy+Math.sin(a)*d)-1.5,3,3);}
  for(let i=rising.length-1;i>=0;i--){const r=rising[i],k=(now-r.at)/900;if(k>=1){rising.splice(i,1);continue;}const e=1-(1-k)*(1-k),x=sx(r.from.x+(r.to.x-r.from.x)*e),y=sy(r.from.y+(r.to.y-r.from.y)*e);c.globalAlpha=1;c.fillStyle=gold;c.fillRect(Math.round(x)-2,Math.round(y)-2,4,4);}
  // A pulse on another beat makes a gold ring wait around the cube: the «1» is on the Line (plan H2, one guide).
  if(!done()&&now-early<450){c.globalAlpha=1-(now-early)/450;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,14+14*(now-early)/450,0,6.283);c.stroke();}
  if(crowded&&now-crowded.at<700){const k=(now-crowded.at)/700;c.globalAlpha=1-k;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(sx(crowded.star.x),sy(crowded.star.y),8+k*30,0,6.283);c.stroke();}
  if(shiver>0&&!still){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  c.restore();}
 runtime.registerJourneyGame?.('vacio',{pulse,under,over,progress:()=>releaseProgress(own().released,own().total),growth:()=>releaseScale(own().released,own().total)});
 Object.defineProperties(runtime,{journeyRelease:{get:()=>()=>{const s=own();return {active:active(),total:s.total,released:s.released,progress:releaseProgress(s.released,s.total),stars:s.stars.length,misses,light:s.light?{...s.light}:null,lit:s.lit};}}});
}
