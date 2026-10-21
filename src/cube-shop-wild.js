import {prefersReducedMotion,frameMemo} from './frame-state.js';
import {wearing} from './cube-shop-model.js';
import {livingGlyph} from './living-art.js';
// Cube shop batch 6: the world reacts and wild pieces. Drawing only: nothing here moves the cube, sounds or changes play.
export const SHOP_WORLD=Object.freeze(['world:lantern','world:grass','world:puddles','world:retinue','world:constellation']);
export const SHOP_WILD=Object.freeze(['wild:morse','wild:backpack','wild:screen','wild:hologram','wild:costume','wild:vjskin']);
const TAU=Math.PI*2;
// 3x5 capitals for the constellation; accents and Ñ fall back to the plain letter.
const FONT={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111'};
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
const plain=name=>String(name||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();
export const initialOf=name=>[...plain(name)].find(ch=>FONT[ch])||'K';
// The stars of a letter: grid points of its 3x5 shape.
export function letterStars(letter){const rows=FONT[letter]||FONT.K,out=[];for(let i=0;i<15;i++)if(rows[i]==='1')out.push([i%3,Math.floor(i/3)]);return out;}
// Morse as on/off units: dot 1, dash 3, gap 1 inside a letter, 3 between letters, 7 before repeating.
export function morseUnits(name){const out=[];for(const ch of plain(name).slice(0,12)){const code=MORSE[ch];if(!code){if(out.length)out.push(0,0,0,0);continue;}for(const [i,sym]of [...code].entries()){if(i)out.push(0);out.push(...Array(sym==='-'?3:1).fill(1));}out.push(0,0,0);}if(!out.includes(1))out.push(1,0,1,1,1,0,0,0);out.push(0,0,0,0);return out;}
// FNV hash: puddles follow the world, not the game's random stream.
export function hash(text){let h=2166136261;for(const ch of String(text))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;}
export const PUDDLE_CELL=150;
export function puddleIn(i,j,seed=''){const h=hash('puddle:'+seed+':'+i+','+j);if(h%5)return null;return {x:(i+.2+(h>>>3)%60/100)*PUDDLE_CELL,y:(j+.2+(h>>>9)%60/100)*PUDDLE_CELL,rx:14+(h>>>15)%16,ry:6+(h>>>20)%5};}
const TIER_RANK={mitico:4,legendario:3,singular:2,raro:1};
const TIER_INK={raro:'#9fe8ff',singular:'#bda5f5',legendario:'#bda5f5',mitico:'#f0d27a'};
export const recentCards=(book,n=3)=>(Array.isArray(book?.items)?book.items:[]).filter(c=>c&&typeof c==='object').slice(-n);
export function rarestCard(book){let best=null;for(const c of Array.isArray(book?.items)?book.items:[]){const rank=TIER_RANK[c?.odds?.tier]||0;if(!best||rank>=best.rank)best={card:c,rank};}return best?.card||null;}
export const COSTUMES=Object.freeze(['sphere','pyramid','dodeca']);
function shapePath(c,shape,x,y,s){
 c.beginPath();const r=s*.62;
 if(shape==='sphere'){c.arc(x,y,s*.56,0,TAU);return;}
 if(shape==='pyramid'){c.moveTo(x,y-r);c.lineTo(x+r,y+r*.8);c.lineTo(x-r,y+r*.8);c.closePath();return;}
 for(let i=0;i<5;i++){const a=-Math.PI/2+i*TAU/5;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();
}
// A costume body: filled shape with a few lines that show its volume.
export function drawCostume(c,shape,x,y,s,t,{color='#fff',calm=false}={}){
 c.save();c.fillStyle=color;shapePath(c,shape,x,y,s);c.fill();c.strokeStyle='#000';c.globalAlpha=.45;c.lineWidth=1;const turn=calm?0:t/900;
 if(shape==='sphere'){c.beginPath();c.ellipse(x,y,s*.56,s*.2,0,0,TAU);c.stroke();c.beginPath();c.ellipse(x,y,Math.abs(Math.cos(turn))*s*.56,s*.56,0,0,TAU);c.stroke();}
 else if(shape==='pyramid'){const r=s*.62,k=Math.sin(turn)*r*.5;c.beginPath();c.moveTo(x,y-r);c.lineTo(x+k,y+r*.8);c.stroke();}
 else{const r=s*.62,k=s*.3;c.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*TAU/5+(calm?0:Math.sin(turn)*.2);c.moveTo(x+Math.cos(a)*k,y+Math.sin(a)*k);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.stroke();c.beginPath();for(let i=0;i<=5;i++){const a=-Math.PI/2+i*TAU/5+(calm?0:Math.sin(turn)*.2);i?c.lineTo(x+Math.cos(a)*k,y+Math.sin(a)*k):c.moveTo(x+Math.cos(a)*k,y+Math.sin(a)*k);}c.stroke();}
 c.restore();
}
// VJ visuals clipped to the body: stripes that run with the beat in the region's colours.
export function drawSkin(c,x,y,s,t,{inks=['#fff','#f0d27a'],beat=0,calm=false,shape=null}={}){
 c.save();if(shape)shapePath(c,shape,x,y,s);else{c.beginPath();c.rect(Math.round(x-s/2),Math.round(y-s/2),Math.round(s),Math.round(s));}c.clip();
 const shift=calm?0:(t/90)%8,band=Math.max(2,Math.round(s/5));c.globalAlpha=.55+beat*.35;
 for(let k=-s*2;k<s*2;k+=band*2){c.fillStyle=inks[(Math.floor((k+s*2)/(band*2)))%inks.length];c.beginPath();const o=k+shift;c.moveTo(x-s+o,y-s);c.lineTo(x-s+o+band,y-s);c.lineTo(x+o+band,y+s);c.lineTo(x+o,y+s);c.closePath();c.fill();}
 c.restore();
}
function cardGlyph(c,card,x,y,w,h){c.fillStyle='#000';c.fillRect(x,y,w,h);c.strokeStyle=TIER_INK[card?.odds?.tier]||'#fff';c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);c.fillStyle=c.strokeStyle;c.fillRect(x+Math.floor(w/2)-1,y+Math.floor(h/2)-1,2,2);}
// Shop and in-game marks for pieces that need the world around them.
export function drawWildGlyph(c,id,x,y,s,t,{color='#fff',ink='#fff',calm=false}={}){
 c.save();c.strokeStyle=c.fillStyle=ink;c.lineWidth=1;
 if(id==='world:puddles'){c.globalAlpha=.5;c.fillStyle='#4a6f8f';c.beginPath();c.ellipse(x,y+s*.9,s*1.4,s*.45,0,0,TAU);c.fill();c.save();c.beginPath();c.ellipse(x,y+s*.9,s*1.4,s*.45,0,0,TAU);c.clip();c.globalAlpha=.45;c.fillStyle=color;c.fillRect(Math.round(x-s/2),Math.round(y+s*.6),Math.round(s),Math.round(s*.5));c.restore();c.globalAlpha=.7;c.strokeStyle='#9fd7ff';c.beginPath();c.moveTo(x-s*.9,y+s*.85);c.lineTo(x-s*.4,y+s*.85);c.stroke();}
 else if(id==='world:grass'){c.strokeStyle='#7fae6a';for(const side of [-1,1])for(let i=0;i<3;i++){const bx=x+side*(s*.7+i*5),by=y+s/2+3;c.beginPath();c.moveTo(bx,by);c.lineTo(bx+side*(4+i),by-7+i);c.stroke();}}
 else if(id==='world:retinue'){for(let i=0;i<3;i++){c.save();c.translate(x-s-8-i*13,y+3+(i%2)*4);c.globalAlpha=.85-i*.15;livingGlyph(c,{shape:['moth','beetle','jelly'][i],size:5,phase:i},calm?0:t);c.restore();}}
 else if(id==='world:constellation'){const stars=letterStars('K');c.globalAlpha=.9;for(const [i,j]of stars)c.fillRect(Math.round(x+s*.8+i*5),Math.round(y-s/2-26+j*5),2,2);}
 c.restore();
}
export function initialize(runtime){
 let morseName=null,morse=[];const morseOf=name=>{if(name!==morseName){morseName=name;morse=morseUnits(name);}return morse;};
 let owner=null,taps=[],costume=null,costumeAt=-1e9,turn=0,trail=[],lastT=null;
 const counts={costumes:0};
 const q=()=>runtime.sparkEconomy||{},has=id=>runtime.inWorld()&&wearing(q(),id);
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const layer=()=>runtime.S.layer||'superficie';
 const ink=(part='lead')=>runtime.musicInk?.(null,part)||'#fff';
 function own(){if(owner!==runtime.S){owner=runtime.S;taps=[];costume=null;trail=[];lastT=null;}}
 // Disfraces: three pulses in a row put on the next costume for a minute.
 function tap(now=performance.now()){own();if(!has('wild:costume'))return;taps=taps.filter(x=>now-x<1300);taps.push(now);if(taps.length>=3){taps=[];costume=COSTUMES[turn++%COSTUMES.length];costumeAt=now;counts.costumes++;}}
 const costumeNow=(now=performance.now())=>costume&&has('wild:costume')&&now-costumeAt<60000?costume:null;
 function drawBody(c,x,y,s,t,color){own();const shape=costumeNow();if(!shape)return false;drawCostume(c,shape,x,y,s,t,{color,calm:calm()});if(has('wild:vjskin'))drawSkin(c,x,y,s,t,{inks:[ink('lead'),ink('perc'),color],beat:runtime.beat?.()||0,calm:calm(),shape});return true;}
 function drawSkinOver(c,x,y,s,t){if(!has('wild:vjskin')||costumeNow())return;drawSkin(c,x,y,s,t,{inks:[ink('lead'),ink('perc'),runtime.cubeColor?.()||'#fff'],beat:runtime.beat?.()||0,calm:calm()});}
 // Hierba: the grass opens wider and further as the cube passes.
 // Asked once per grass blade: answered once per frame.
 const grassWide=()=>frameMemo('shop:grass-wide',()=>has('world:grass')&&layer()==='superficie');
 function puddles(c,x,y,s,t){
  const S=runtime.S,ox=x-S.wx,oy=y-S.wy,seed=S.worldSeed||'',W=runtime.W,H=runtime.H,still=calm(),rain=!!runtime.rainingNow;
  const i0=Math.floor((S.wx-W/2)/PUDDLE_CELL)-1,i1=Math.floor((S.wx+W/2)/PUDDLE_CELL)+1,j0=Math.floor((S.wy-H/2)/PUDDLE_CELL)-1,j1=Math.floor((S.wy+H/2)/PUDDLE_CELL)+1;let shown=0;
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const p=puddleIn(i,j,seed);if(!p)continue;const px=p.x+ox,py=p.y+oy;if(px<-40||py<-40||px>W+40||py>H+40)continue;shown++;
   c.save();c.globalAlpha=rain?.5:.35;c.fillStyle='#3d5f7c';c.beginPath();c.ellipse(px,py,p.rx,p.ry,0,0,TAU);c.fill();c.clip();
   // The reflection: the cube upside down, under itself, wherever it stands near the puddle.
   if(Math.abs(S.wx-p.x)<p.rx+s&&Math.abs(S.wy-p.y)<p.ry+s*1.5){c.globalAlpha=.45;c.fillStyle=runtime.cubeColor?.()||'#fff';const wob=still?0:Math.sin(t/180)*1.5;c.fillRect(Math.round(x-s/2+wob),Math.round(y+s*.55),Math.round(s),Math.round(s*.7));}
   c.globalAlpha=.6;c.strokeStyle='#9fd7ff';c.beginPath();c.moveTo(px-p.rx*.6,py-p.ry*.3);c.lineTo(px-p.rx*.1,py-p.ry*.3);c.stroke();
   if(rain&&!still){const k=(t/700+hash(i+':'+j)%10/10)%1;c.globalAlpha=.5*(1-k);c.beginPath();c.ellipse(px+p.rx*.3,py,k*p.rx*.6,k*p.ry*.6,0,0,TAU);c.stroke();}
   c.restore();}
  return shown;
 }
 function retinue(c,x,y,s,t){
  const S=runtime.S;if(lastT===null||t-lastT>500||t<lastT)trail=[];lastT=t;const last=trail.at(-1);if(!last||Math.hypot(S.wx-last[0],S.wy-last[1])>6){trail.push([S.wx,S.wy]);if(trail.length>60)trail.shift();}
  const seen=Object.keys(S.livingSeen||{}),shapes=['moth','beetle','jelly','crab','turtle','seed'],ox=x-S.wx,oy=y-S.wy,still=calm();
  for(let k=0;k<3;k++){const p=trail[Math.max(0,trail.length-1-(k+1)*3)]||[S.wx-(k+1)*16,S.wy+4];const kind=seen[k]?shapes[hash(seen[k])%shapes.length]:shapes[k];c.save();c.translate(Math.round(p[0]+ox+(k%2?5:-5)),Math.round(p[1]+oy+8+(still?0:Math.sin(t/300+k)*2)));c.strokeStyle=c.fillStyle=ink('lead');c.globalAlpha=.85-k*.15;livingGlyph(c,{shape:kind,size:6,phase:k},still?0:t);c.restore();}
 }
 function constellation(c,t){
  const name=runtime.S.playerProfile?.name||'Kubono',stars=letterStars(initialOf(name)),light=runtime.worldLight?.()?.stars??1,still=calm(),gap=Math.max(14,Math.min(26,runtime.W/22)),x0=runtime.W*.74-gap,y0=runtime.H*.12;
  c.save();c.strokeStyle=c.fillStyle='#fff';const alpha=.2+.8*Math.max(0,Math.min(1,light));
  c.globalAlpha=alpha*.25;c.lineWidth=1;c.beginPath();for(const [i,j]of stars)for(const [a,b]of stars)if((a===i+1&&b===j)||(a===i&&b===j+1)){c.moveTo(x0+i*gap,y0+j*gap);c.lineTo(x0+a*gap,y0+b*gap);}c.stroke();
  for(const [k,[i,j]]of stars.entries()){c.globalAlpha=alpha*(still?.9:.6+.4*Math.sin(t/400+k*1.7));c.fillRect(Math.round(x0+i*gap)-1,Math.round(y0+j*gap)-1,3,3);}
  c.restore();
 }
 function drawUnder(c,x,y,s,t){
  if(!runtime.inWorld())return;own();c.save();c.globalAlpha=1;try{underPieces(c,x,y,s,t);}finally{c.restore();}
 }
 function underPieces(c,x,y,s,t){
  if(has('world:lantern')&&layer()==='bajo'){const g=c.createRadialGradient(x,y,0,x,y,150);g.addColorStop(0,'rgba(255,214,150,.32)');g.addColorStop(1,'rgba(255,214,150,0)');c.save();c.fillStyle=g;c.fillRect(x-150,y-150,300,300);c.restore();}
  if(has('world:puddles')&&layer()==='superficie')puddles(c,x,y,s,t);
  if(grassWide()&&calm())drawWildGlyph(c,'world:grass',x,y,s,t,{calm:true});
  if(has('world:retinue')&&layer()==='superficie')retinue(c,x,y,s,t);
 }
 function drawOver(c,x,y,s,t){
  if(!runtime.inWorld())return;own();c.save();c.globalAlpha=1;try{overPieces(c,x,y,s,t);}finally{c.restore();}
 }
 function overPieces(c,x,y,s,t){
  const still=calm(),lead=ink('lead'),color=runtime.cubeColor?.()||'#fff';
  if(has('world:lantern')){const lx=Math.round(x-s/2-7),ly=Math.round(y-s/2-2+(still?0:Math.sin(t/500)*1.5));c.save();c.fillStyle='#fff';c.fillRect(lx+1,ly-3,1,3);c.strokeStyle='#f0d27a';c.strokeRect(lx-1.5,ly+.5,5,6);c.fillStyle='#f0d27a';c.globalAlpha=layer()==='bajo'?1:.6;c.fillRect(lx,ly+2,2,3);c.restore();}
  if(has('world:constellation')&&layer()!=='bajo'&&runtime.W>=240)constellation(c,t);
  if(has('wild:morse')){const units=morseOf(runtime.S.playerProfile?.name||'Kubono'),unit=Math.round((runtime.SIX||.125)*2*1000),on=still?1:units[Math.floor(t/unit)%units.length];c.save();c.fillStyle=on?'#fff':'#ffffff44';c.fillRect(Math.round(x+s/2+3),Math.round(y-s/2-7),4,4);c.restore();}
  if(has('wild:backpack')){const cards=recentCards(runtime.S.rareBook);c.save();for(let k=0;k<3;k++){const swing=still?0:Math.sin(t/420+k)*1.5,cx=Math.round(x-s/2-4-k*5+swing),cy=Math.round(y-2+k*3);c.globalAlpha=cards[k]?1:.4;c.strokeStyle='#ffffff66';c.beginPath();c.moveTo(x-s/2,y-s/2+2);c.lineTo(cx+2,cy);c.stroke();cardGlyph(c,cards[k]||null,cx,cy,5,7);}c.restore();}
  if(has('wild:screen')){const rg=runtime.MU?.dnaA||runtime.MU?.dnaT,bpm=Math.round(rg?.bpm||runtime.MU?.bpm||120),genre=runtime.GEN?.[rg?.genre]?.name||'',show=still||!genre||Math.floor(t/3000)%2===0?bpm+' BPM':genre.slice(0,14);c.save();c.font='9px "Geist Mono", monospace';c.textAlign='center';const w=Math.ceil(c.measureText?.(show)?.width||show.length*5.5)+6,sx=Math.round(x-w/2),sy=Math.round(y+s/2+8);c.fillStyle='#000';c.fillRect(sx,sy,w,12);c.strokeStyle=lead;c.strokeRect(sx+.5,sy+.5,w-1,11);c.fillStyle=lead;c.fillText(show,Math.round(x),sy+9);c.restore();}
  if(has('wild:hologram')){const card=rarestCard(runtime.S.rareBook),hx=Math.round(x),hy=Math.round(y-s/2-24);c.save();c.globalAlpha=.25;c.fillStyle=TIER_INK[card?.odds?.tier]||'#9fe8ff';c.beginPath();c.moveTo(x-s/4,y-s/2);c.lineTo(hx-9,hy+12);c.lineTo(hx+9,hy+12);c.lineTo(x+s/4,y-s/2);c.closePath();c.fill();c.globalAlpha=.85;cardGlyph(c,card,hx-7,hy-8,14,20);c.globalAlpha=.25;c.fillStyle='#000';for(let k=still?0:Math.floor(t/80)%3;k<20;k+=3)c.fillRect(hx-7,hy-8+k,14,1);c.restore();}
 }
 Object.defineProperties(runtime,{drawCubeShopWildUnder:{get:()=>drawUnder},drawCubeShopWildOver:{get:()=>drawOver},drawCubeShopCostume:{get:()=>drawBody},drawCubeShopSkin:{get:()=>drawSkinOver},cubeShopWildTap:{get:()=>tap},cubeShopGrassWide:{get:()=>grassWide},
  cubeShopWild:{get:()=>()=>({costume:costumeNow(),costumes:counts.costumes,trail:trail.length})}});
}
