import {TOTEMS} from './sculpture-totems-model.js';
import {bake} from './fx-kit.js';
const paths=new Map();
export function drawTotem(c,o,{light=0,progress=0,ball=0,lean=0,dance=0,still=false}={}){
 const def=TOTEMS[o.kind];if(!def)return;
 c.save();c.rotate(still?0:lean);c.translate(0,still?0:Math.sin(dance)*2*light);
 for(const [i,p]of def.pieces.entries()){
  c.save();c.globalAlpha*=.86+.14*(progress>i?1:light*.6);c.translate(p.head?ball:0,p.y-(still?0:Math.min(progress,i+1)*light*2));if(p.head)c.translate(0,Math.abs(ball)/55*(o.kind==='diamond'?42:60));
  if(!paths.has(p.path))paths.set(p.path,new Path2D(p.path));const shape=paths.get(p.path),colors=p.colors||def.colors;
  const top=p.head?-90:p.path.includes('-101')?-101:p.path.includes('-78')?-80:p.path.includes('-45')?-45:-30;
  // Visual 2 (alpha.254): each piece is painted once (bake) with its gradient and side shade, plus a fine lit rim and a
  // little less saturation so it sits with the World's lines; then drawn as one image (it was two gradients per piece
  // and frame). Without a canvas, the painting of before.
  const art=bake('totem:'+o.kind+':'+i,52,124,q=>{q.translate(26,112);paintPiece(q,o.kind,shape,top,colors);q.save();q.clip(shape);q.globalCompositeOperation='saturation';q.fillStyle='hsla(0,0%,50%,.18)';q.fillRect(-24,top-5,48,120);
   q.globalCompositeOperation='source-over';q.strokeStyle='rgba(255,255,255,.3)';q.lineWidth=1.6;q.stroke(shape);q.restore();});
  if(art)c.drawImage(art,-26,-112,52,124);else paintPiece(c,o.kind,shape,top,colors);c.restore();
 }
 c.restore();
}
function paintPiece(c,kind,shape,top,colors){c.save();const g=c.createLinearGradient(-12,top,14,2);g.addColorStop(0,colors[0]);if(kind==='bottle')g.addColorStop(.32,'#d6a1f0');g.addColorStop(.5,colors[1]);g.addColorStop(1,colors[2]);c.fillStyle=g;c.fill(shape);
 c.clip(shape);const shade=c.createLinearGradient(-19,0,19,0);shade.addColorStop(0,'#ffffff1c');shade.addColorStop(.38,'#ffffff00');shade.addColorStop(1,'#00000065');c.fillStyle=shade;c.fillRect(-24,top-5,48,120);c.restore();}
export function totemPortrait(kind){const d=TOTEMS[kind]||TOTEMS.stack;return '<svg viewBox="-42 -112 84 124" aria-hidden="true"><defs>'+d.pieces.map((p,i)=>{const v=p.colors||d.colors;return '<linearGradient id="totem-'+kind+'-'+i+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+v[0]+'"/><stop offset=".5" stop-color="'+v[1]+'"/><stop offset="1" stop-color="'+v[2]+'"/></linearGradient>';}).join('')+'</defs><g class="rare-glyph">'+d.pieces.map((p,i)=>'<path d="'+p.path+'" transform="translate(0 '+p.y+')" fill="url(#totem-'+kind+'-'+i+')" stroke="none"/>').join('')+'</g></svg>';}
