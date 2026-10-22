import {prefersReducedMotion} from './frame-state.js';
// Original, small line glyphs. All color belongs to the encounter, never the background.
import {drawAnatomy,anatomyOf} from './anatomy.js';
export function livingGlyph(c,o,t){
 if(!o.anatomy&&'frond chime cap fan cluster kite ribbon spinner spiral hare lantern centipede harp cairn gate nest wheel'.split(' ').includes(o.shape))o={...o,anatomy:anatomyOf(o)};
 if(o.anatomy){drawAnatomy(c,o.anatomy,o.size,prefersReducedMotion()?0:o.phase);return;}
 const s=o.size,p=o.phase+Math.sin(t/1200+o.phase)*.12;c.beginPath();
 switch(o.shape){
 // Seen from above (docs/UNIVERSO.md): branching forms spread out from a centre instead of rising from a ground line.
 case 'branch':case 'roots':for(let i=0;i<5;i++){const a=i*Math.PI*2/5+Math.sin(p)*.2;c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a+.4)*s*.5,Math.sin(a+.4)*s*.5,Math.cos(a)*s,Math.sin(a)*s);}break;
 case 'pods':for(let i=0;i<3;i++){const x=(i-1)*s*.6;c.moveTo(x,0);c.ellipse(x,-s*.2,s*.22,s*.38,p,0,Math.PI*2);}break;
 case 'vine':case 'worm':c.moveTo(-s,0);c.bezierCurveTo(-s*.5,-s,0,s,s,0);break;
 case 'network':for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*s,y=Math.sin(a)*s;c.moveTo(0,0);c.lineTo(x,y);c.moveTo(x+3,y);c.arc(x,y,3,0,Math.PI*2);}break;
 case 'flower':for(let i=0;i<5;i++){const a=i*Math.PI*2/5+p*.1;c.moveTo(0,0);c.lineTo(Math.cos(a)*s,Math.sin(a)*s);}break;
 case 'reeds':for(let i=0;i<3;i++){const a=i*Math.PI*2/3+Math.sin(p)*.3,x=Math.cos(a)*s*.6,y=Math.sin(a)*s*.6;c.moveTo(x+3,y);c.arc(x,y,3,0,Math.PI*2);}break;
 case 'moss':case 'lichen':for(let i=0;i<5;i++){const a=i*2.4;c.moveTo(Math.cos(a)*s*.6+3,Math.sin(a)*s*.5);c.arc(Math.cos(a)*s*.6,Math.sin(a)*s*.5,3,0,Math.PI*2);}break;
 case 'cactus':for(let i=0;i<4;i++){const a=i*Math.PI/2;c.moveTo(Math.cos(a)*s*.3,Math.sin(a)*s*.3);c.lineTo(Math.cos(a)*s,Math.sin(a)*s);}break;
 case 'seed':c.ellipse(0,0,s*.3,s*.65,p,0,Math.PI*2);c.moveTo(0,-s*.65);c.quadraticCurveTo(s*.8,-s,s,-s*.2);break;
 case 'manta':c.moveTo(-s,0);c.quadraticCurveTo(-s*.5,-s*Math.abs(Math.sin(p)),0,0);c.quadraticCurveTo(s*.5,-s*Math.abs(Math.sin(p)),s,0);c.moveTo(0,0);c.lineTo(0,s*.5);break;
 // Chispa del eco: a four-pointed spark that flickers.
 case 'moth':{const k=s*(.6+.4*Math.abs(Math.sin(p*2)));c.moveTo(-k,0);c.lineTo(k,0);c.moveTo(0,-k);c.lineTo(0,k);c.moveTo(-k*.35,-k*.35);c.lineTo(k*.35,k*.35);c.moveTo(k*.35,-k*.35);c.lineTo(-k*.35,k*.35);break;}
 // Cometa resonante: a head with a tail of light behind it.
 case 'deer':c.moveTo(s*.6+4,0);c.arc(s*.6,0,4,0,Math.PI*2);for(let i=-1;i<=1;i++){c.moveTo(s*.6,0);c.lineTo(-s,i*s*.25+Math.sin(p)*2);}break;
 // Asteroide lento: an irregular rock with a crater.
 case 'turtle':for(let i=0;i<=9;i++){const a=i*Math.PI*2/9,r=s*(.7+.2*Math.sin(i*2.7+o.variant));i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r*.8):c.moveTo(Math.cos(a)*r,Math.sin(a)*r*.8);}c.moveTo(s*.3,-s*.1);c.arc(s*.15,-s*.1,s*.15,0,Math.PI*2);break;
 // Satélite reloj: a small body with two panels. Prisma andante: a diamond with its facets.
 case 'beetle':c.rect(-s*.25,-s*.25,s*.5,s*.5);c.moveTo(-s*.25,0);c.lineTo(-s*.45,0);c.rect(-s,-s*.2,s*.55,s*.4);c.moveTo(s*.25,0);c.lineTo(s*.45,0);c.rect(s*.45,-s*.2,s*.55,s*.4);break;
 case 'crab':c.moveTo(0,-s);c.lineTo(s*.7,0);c.lineTo(0,s);c.lineTo(-s*.7,0);c.closePath();c.moveTo(-s*.7,0);c.lineTo(s*.7,0);c.moveTo(0,-s);c.lineTo(0,s);break;
 case 'jelly':c.ellipse(0,0,s,s*.5,0,Math.PI,Math.PI*2);for(let i=-1;i<=1;i++){c.moveTo(i*s*.6,0);c.quadraticCurveTo(i*s*.6+Math.sin(p)*5,s*.5,i*s*.6,s);}break;
 // Sombra del vacío: a vast dark shape seen only by its rim.
 case 'whale':c.ellipse(0,0,s,s*.45,p*.2,0,Math.PI*2);c.moveTo(s*.55,0);c.ellipse(0,0,s*.55,s*.22,p*.2,0,Math.PI*2);break;
 case 'blob':for(let i=0;i<=24;i++){const a=i*Math.PI/12,r=s*(.75+.1*Math.sin(a*3+p));if(!i)c.moveTo(Math.cos(a)*r,Math.sin(a)*r);else c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}break;
 case 'mill':c.arc(0,0,s*.25,0,Math.PI*2);for(let i=0;i<4;i++){const a=p+i*Math.PI/2;c.moveTo(Math.cos(a)*s*.25,Math.sin(a)*s*.25);c.lineTo(Math.cos(a)*s*.85,Math.sin(a)*s*.85);}break;
 case 'arches':for(let i=-1;i<=1;i++){c.moveTo(i*s*.55-s*.25,s*.6);c.quadraticCurveTo(i*s*.55,-s,i*s*.55+s*.25,s*.6);}break;
 case 'orbit':{const a=o.variant/256*Math.PI*2;c.ellipse(0,0,s,s*.45,p,0,Math.PI*2);c.moveTo(Math.cos(a)*s+2,Math.sin(a)*s);c.arc(Math.cos(a)*s,Math.sin(a)*s,2,0,Math.PI*2);break;}
 case 'plaza':for(let i=0;i<5;i++){const a=i*Math.PI*2/5;c.moveTo(Math.cos(a)*s*.8+3,Math.sin(a)*s*.8);c.arc(Math.cos(a)*s*.8,Math.sin(a)*s*.8,3,0,Math.PI*2);}break;
 case 'mirrors':for(let i=-1;i<=1;i++){c.moveTo(i*s*.4-s*.15,-s*.7);c.lineTo(i*s*.4+s*.15,-s*.5);c.lineTo(i*s*.4+s*.15,s*.7);c.lineTo(i*s*.4-s*.15,s*.5);c.closePath();}break;
 case 'bridge':c.moveTo(-s,s*.3);c.quadraticCurveTo(0,-s*.3,s,s*.3);for(let i=-1;i<=1;i++){c.moveTo(i*22+3,0);c.arc(i*22,0,3,0,Math.PI*2);}break;
 case 'shelter':c.moveTo(-s,s*.5);c.quadraticCurveTo(0,-s,s,s*.5);c.moveTo(-s,s*.5);c.quadraticCurveTo(0,-s*.3,s,s*.5);break;
 default:c.ellipse(0,0,s,s*.6,p,0,Math.PI*2);
 }
 c.stroke();
}
